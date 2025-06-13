#!/usr/bin/env node

/**
 * JS Chess Engine 2.0 - MCP Server
 * 
 * Model Context Protocol server providing chess analysis tools for AI agents.
 * Implements the definitive response to "Atari Chess beats ChatGPT" with
 * state-of-the-art WebAssembly engine and agentic API integration.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolResult,
  TextContent,
  ImageContent,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { ChessEngine } from './chess-engine.js';
import { SecurityManager } from './security.js';
import { RateLimiter } from './rate-limiter.js';
import { Logger } from './logger.js';

// Tool schemas for validation
const AnalyzePositionSchema = z.object({
  fen: z.string().describe('FEN notation of the chess position'),
  depth: z.number().min(1).max(20).default(10).describe('Search depth (1-20)'),
  time_limit: z.number().min(100).max(30000).default(5000).describe('Time limit in milliseconds'),
});

const GenerateMovesSchema = z.object({
  fen: z.string().describe('FEN notation of the chess position'),
  legal_only: z.boolean().default(true).describe('Return only legal moves'),
  format: z.enum(['uci', 'san', 'lan']).default('uci').describe('Move notation format'),
});

const PlayMoveSchema = z.object({
  fen: z.string().describe('FEN notation of the current position'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert', 'master']).default('intermediate'),
  time_limit: z.number().min(100).max(10000).default(2000).describe('Thinking time in milliseconds'),
});

const EvaluatePositionSchema = z.object({
  fen: z.string().describe('FEN notation of the chess position'),
  detailed: z.boolean().default(false).describe('Include detailed evaluation breakdown'),
});

const SimulateGameSchema = z.object({
  starting_fen: z.string().optional().describe('Starting position (default: standard opening)'),
  white_engine: z.string().default('nnue_depth_10').describe('White engine configuration'),
  black_engine: z.string().default('nnue_depth_10').describe('Black engine configuration'),
  max_moves: z.number().min(10).max(200).default(100).describe('Maximum number of moves'),
  time_control: z.string().default('5+0').describe('Time control (minutes+increment)'),
});

const OpeningBookSchema = z.object({
  fen: z.string().describe('FEN notation of the position'),
  max_variations: z.number().min(1).max(20).default(5).describe('Maximum variations to return'),
  include_stats: z.boolean().default(true).describe('Include statistical data'),
});

class ChessMCPServer {
  private server: Server;
  private engine: ChessEngine;
  private security: SecurityManager;
  private rateLimiter: RateLimiter;
  private logger: Logger;

  constructor() {
    this.server = new Server(
      {
        name: 'js-chess-engine-mcp',
        version: '2.0.0',
        description: 'State-of-the-art chess engine with NNUE evaluation and agentic API',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.engine = new ChessEngine();
    this.security = new SecurityManager();
    this.rateLimiter = new RateLimiter();
    this.logger = new Logger('ChessMCP');

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    // List available chess tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        {
          name: 'analyze_position',
          description: 'Analyze a chess position with NNUE evaluation and search',
          inputSchema: {
            type: 'object',
            properties: {
              fen: { type: 'string', description: 'FEN notation of the position' },
              depth: { type: 'number', minimum: 1, maximum: 20, default: 10 },
              time_limit: { type: 'number', minimum: 100, maximum: 30000, default: 5000 },
            },
            required: ['fen'],
          },
        },
        {
          name: 'generate_moves',
          description: 'Generate all legal moves for a position',
          inputSchema: {
            type: 'object',
            properties: {
              fen: { type: 'string', description: 'FEN notation of the position' },
              legal_only: { type: 'boolean', default: true },
              format: { type: 'string', enum: ['uci', 'san', 'lan'], default: 'uci' },
            },
            required: ['fen'],
          },
        },
        {
          name: 'play_move',
          description: 'Generate the best move for a position',
          inputSchema: {
            type: 'object',
            properties: {
              fen: { type: 'string', description: 'FEN notation of the position' },
              difficulty: { 
                type: 'string', 
                enum: ['beginner', 'intermediate', 'advanced', 'expert', 'master'],
                default: 'intermediate'
              },
              time_limit: { type: 'number', minimum: 100, maximum: 10000, default: 2000 },
            },
            required: ['fen'],
          },
        },
        {
          name: 'evaluate_position',
          description: 'Get static evaluation of a chess position',
          inputSchema: {
            type: 'object',
            properties: {
              fen: { type: 'string', description: 'FEN notation of the position' },
              detailed: { type: 'boolean', default: false },
            },
            required: ['fen'],
          },
        },
        {
          name: 'simulate_game',
          description: 'Simulate a complete chess game between engines',
          inputSchema: {
            type: 'object',
            properties: {
              starting_fen: { type: 'string', description: 'Starting position' },
              white_engine: { type: 'string', default: 'nnue_depth_10' },
              black_engine: { type: 'string', default: 'nnue_depth_10' },
              max_moves: { type: 'number', minimum: 10, maximum: 200, default: 100 },
              time_control: { type: 'string', default: '5+0' },
            },
          },
        },
        {
          name: 'opening_book',
          description: 'Query opening book for position variations',
          inputSchema: {
            type: 'object',
            properties: {
              fen: { type: 'string', description: 'FEN notation of the position' },
              max_variations: { type: 'number', minimum: 1, maximum: 20, default: 5 },
              include_stats: { type: 'boolean', default: true },
            },
            required: ['fen'],
          },
        },
      ];

      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Rate limiting check
        await this.rateLimiter.checkLimit(request.meta?.clientId || 'anonymous');

        // Security validation
        this.security.validateRequest(request);

        this.logger.info(`Tool called: ${name}`, { args });

        switch (name) {
          case 'analyze_position':
            return await this.handleAnalyzePosition(args);
          case 'generate_moves':
            return await this.handleGenerateMoves(args);
          case 'play_move':
            return await this.handlePlayMove(args);
          case 'evaluate_position':
            return await this.handleEvaluatePosition(args);
          case 'simulate_game':
            return await this.handleSimulateGame(args);
          case 'opening_book':
            return await this.handleOpeningBook(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        this.logger.error(`Tool error: ${name}`, { error: error.message, args });
        throw error;
      }
    });
  }

  private async handleAnalyzePosition(args: unknown): Promise<CallToolResult> {
    const { fen, depth, time_limit } = AnalyzePositionSchema.parse(args);
    
    const analysis = await this.engine.analyzePosition(fen, depth, time_limit);
    
    const content: TextContent = {
      type: 'text',
      text: JSON.stringify({
        evaluation: analysis.evaluation,
        best_move: analysis.bestMove,
        principal_variation: analysis.principalVariation,
        nodes_searched: analysis.nodesSearched,
        search_depth: analysis.searchDepth,
        time_ms: analysis.timeMs,
        nps: Math.round(analysis.nodesSearched / (analysis.timeMs / 1000)),
        interpretation: this.interpretEvaluation(analysis.evaluation),
      }, null, 2),
    };

    return { content: [content] };
  }

  private async handleGenerateMoves(args: unknown): Promise<CallToolResult> {
    const { fen, legal_only, format } = GenerateMovesSchema.parse(args);
    
    const moves = await this.engine.generateMoves(fen, legal_only, format);
    
    const content: TextContent = {
      type: 'text',
      text: JSON.stringify({
        position: fen,
        moves: moves,
        move_count: moves.length,
        format: format,
      }, null, 2),
    };

    return { content: [content] };
  }

  private async handlePlayMove(args: unknown): Promise<CallToolResult> {
    const { fen, difficulty, time_limit } = PlayMoveSchema.parse(args);
    
    const depth = this.difficultyToDepth(difficulty);
    const result = await this.engine.getBestMove(fen, depth, time_limit);
    
    const content: TextContent = {
      type: 'text',
      text: JSON.stringify({
        position: fen,
        best_move: result.move,
        evaluation: result.evaluation,
        confidence: result.confidence,
        reasoning: result.reasoning,
        difficulty: difficulty,
        search_depth: depth,
        nodes_searched: result.nodesSearched,
      }, null, 2),
    };

    return { content: [content] };
  }

  private async handleEvaluatePosition(args: unknown): Promise<CallToolResult> {
    const { fen, detailed } = EvaluatePositionSchema.parse(args);
    
    const evaluation = await this.engine.evaluatePosition(fen, detailed);
    
    const content: TextContent = {
      type: 'text',
      text: JSON.stringify(evaluation, null, 2),
    };

    return { content: [content] };
  }

  private async handleSimulateGame(args: unknown): Promise<CallToolResult> {
    const params = SimulateGameSchema.parse(args);
    
    const gameResult = await this.engine.simulateGame(params);
    
    const content: TextContent = {
      type: 'text',
      text: JSON.stringify({
        result: gameResult.result,
        moves: gameResult.moves,
        final_position: gameResult.finalPosition,
        game_length: gameResult.moves.length,
        termination: gameResult.termination,
        white_engine: params.white_engine,
        black_engine: params.black_engine,
        pgn: gameResult.pgn,
      }, null, 2),
    };

    return { content: [content] };
  }

  private async handleOpeningBook(args: unknown): Promise<CallToolResult> {
    const { fen, max_variations, include_stats } = OpeningBookSchema.parse(args);
    
    const openingData = await this.engine.queryOpeningBook(fen, max_variations, include_stats);
    
    const content: TextContent = {
      type: 'text',
      text: JSON.stringify(openingData, null, 2),
    };

    return { content: [content] };
  }

  private interpretEvaluation(eval: number): string {
    if (Math.abs(eval) > 10) {
      return eval > 0 ? 'White is winning decisively' : 'Black is winning decisively';
    } else if (Math.abs(eval) > 3) {
      return eval > 0 ? 'White has a significant advantage' : 'Black has a significant advantage';
    } else if (Math.abs(eval) > 1) {
      return eval > 0 ? 'White is slightly better' : 'Black is slightly better';
    } else {
      return 'Position is roughly equal';
    }
  }

  private difficultyToDepth(difficulty: string): number {
    const depthMap = {
      beginner: 3,
      intermediate: 6,
      advanced: 10,
      expert: 15,
      master: 20,
    };
    return depthMap[difficulty] || 6;
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      this.logger.error('MCP Server error', { error: error.message });
    };

    process.on('SIGINT', async () => {
      this.logger.info('Shutting down MCP server...');
      await this.server.close();
      process.exit(0);
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('JS Chess Engine MCP Server started successfully');
    this.logger.info('Ready to provide chess analysis tools for AI agents');
  }
}

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new ChessMCPServer();
  server.start().catch((error) => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });
}

export { ChessMCPServer };