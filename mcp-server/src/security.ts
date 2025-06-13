/**
 * Security Manager for MCP Chess Server
 * 
 * Provides authentication, authorization, and security validation
 * for the agentic chess API.
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const RequestSchema = z.object({
  params: z.object({
    name: z.string(),
    arguments: z.any(),
  }),
  meta: z.object({
    clientId: z.string().optional(),
    apiKey: z.string().optional(),
    userAgent: z.string().optional(),
  }).optional(),
});

export class SecurityManager {
  private readonly jwtSecret: string;
  private readonly apiKeys: Set<string>;
  private readonly rateLimits: Map<string, number>;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'chess-engine-secret-key-change-in-production';
    this.apiKeys = new Set([
      'chess-api-key-demo', // Demo API key
      'satware-ai-internal', // Internal satware AI key
    ]);
    this.rateLimits = new Map();
  }

  validateRequest(request: any): void {
    try {
      // Validate request structure
      RequestSchema.parse(request);

      // Check for suspicious patterns
      this.checkSuspiciousPatterns(request);

      // Validate tool name
      this.validateToolName(request.params.name);

      // Validate arguments
      this.validateArguments(request.params.arguments);

    } catch (error) {
      throw new Error(`Security validation failed: ${error.message}`);
    }
  }

  authenticateApiKey(apiKey: string): boolean {
    return this.apiKeys.has(apiKey);
  }

  generateJWT(payload: any): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' });
  }

  verifyJWT(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  private checkSuspiciousPatterns(request: any): void {
    const suspicious = [
      'eval(',
      'Function(',
      'require(',
      'import(',
      'process.',
      'global.',
      '__dirname',
      '__filename',
      'fs.',
      'child_process',
    ];

    const requestStr = JSON.stringify(request);
    for (const pattern of suspicious) {
      if (requestStr.includes(pattern)) {
        throw new Error(`Suspicious pattern detected: ${pattern}`);
      }
    }
  }

  private validateToolName(toolName: string): void {
    const allowedTools = [
      'analyze_position',
      'generate_moves',
      'play_move',
      'evaluate_position',
      'simulate_game',
      'opening_book',
    ];

    if (!allowedTools.includes(toolName)) {
      throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  private validateArguments(args: any): void {
    if (!args || typeof args !== 'object') {
      return; // Allow empty or simple arguments
    }

    // Check for excessively large arguments
    const argsStr = JSON.stringify(args);
    if (argsStr.length > 10000) {
      throw new Error('Arguments too large');
    }

    // Validate FEN strings if present
    if (args.fen && typeof args.fen === 'string') {
      this.validateFEN(args.fen);
    }

    // Validate numeric ranges
    if (args.depth !== undefined) {
      if (typeof args.depth !== 'number' || args.depth < 1 || args.depth > 20) {
        throw new Error('Invalid depth parameter');
      }
    }

    if (args.time_limit !== undefined) {
      if (typeof args.time_limit !== 'number' || args.time_limit < 100 || args.time_limit > 30000) {
        throw new Error('Invalid time_limit parameter');
      }
    }
  }

  private validateFEN(fen: string): void {
    // Basic FEN validation
    const parts = fen.split(' ');
    if (parts.length < 4 || parts.length > 6) {
      throw new Error('Invalid FEN format');
    }

    // Validate board position
    const board = parts[0];
    const ranks = board.split('/');
    if (ranks.length !== 8) {
      throw new Error('Invalid FEN board format');
    }

    // Validate side to move
    if (!['w', 'b'].includes(parts[1])) {
      throw new Error('Invalid side to move in FEN');
    }

    // Basic castling rights validation
    if (!/^[KQkq-]+$/.test(parts[2])) {
      throw new Error('Invalid castling rights in FEN');
    }

    // Basic en passant validation
    if (!/^([a-h][36]|-)$/.test(parts[3])) {
      throw new Error('Invalid en passant square in FEN');
    }
  }
}