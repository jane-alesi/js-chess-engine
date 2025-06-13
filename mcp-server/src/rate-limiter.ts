/**
 * Rate Limiter for MCP Chess Server
 * 
 * Implements sophisticated rate limiting to prevent abuse
 * while allowing legitimate AI agents to use chess tools effectively.
 */

import { RateLimiterMemory } from 'rate-limiter-flexible';

interface RateLimitConfig {
  points: number;
  duration: number;
  blockDuration: number;
}

export class RateLimiter {
  private readonly limiters: Map<string, RateLimiterMemory>;
  private readonly configs: Map<string, RateLimitConfig>;

  constructor() {
    this.limiters = new Map();
    this.configs = new Map();
    this.initializeConfigs();
  }

  private initializeConfigs(): void {
    // Different rate limits for different types of operations
    this.configs.set('analyze_position', {
      points: 10, // 10 requests
      duration: 60, // per 60 seconds
      blockDuration: 60, // block for 60 seconds if exceeded
    });

    this.configs.set('generate_moves', {
      points: 20, // 20 requests
      duration: 60, // per 60 seconds
      blockDuration: 30, // block for 30 seconds if exceeded
    });

    this.configs.set('play_move', {
      points: 15, // 15 requests
      duration: 60, // per 60 seconds
      blockDuration: 60, // block for 60 seconds if exceeded
    });

    this.configs.set('evaluate_position', {
      points: 30, // 30 requests
      duration: 60, // per 60 seconds
      blockDuration: 30, // block for 30 seconds if exceeded
    });

    this.configs.set('simulate_game', {
      points: 3, // 3 requests (expensive operation)
      duration: 300, // per 5 minutes
      blockDuration: 300, // block for 5 minutes if exceeded
    });

    this.configs.set('opening_book', {
      points: 50, // 50 requests
      duration: 60, // per 60 seconds
      blockDuration: 30, // block for 30 seconds if exceeded
    });

    // Global rate limit per client
    this.configs.set('global', {
      points: 100, // 100 requests total
      duration: 60, // per 60 seconds
      blockDuration: 120, // block for 2 minutes if exceeded
    });

    // Initialize rate limiters
    for (const [key, config] of this.configs) {
      this.limiters.set(key, new RateLimiterMemory({
        points: config.points,
        duration: config.duration,
        blockDuration: config.blockDuration,
      }));
    }
  }

  async checkLimit(clientId: string, toolName?: string): Promise<void> {
    const client = clientId || 'anonymous';

    try {
      // Check global rate limit first
      await this.limiters.get('global')!.consume(client);

      // Check tool-specific rate limit if tool is specified
      if (toolName && this.limiters.has(toolName)) {
        await this.limiters.get(toolName)!.consume(client);
      }

    } catch (rateLimiterRes) {
      if (rateLimiterRes.remainingPoints !== undefined) {
        const secs = Math.round(rateLimiterRes.msBeforeNext / 1000) || 1;
        throw new Error(`Rate limit exceeded. Try again in ${secs} seconds.`);
      }
      throw new Error('Rate limit error');
    }
  }

  async getRemainingPoints(clientId: string, toolName?: string): Promise<number> {
    const client = clientId || 'anonymous';
    
    try {
      const limiter = toolName && this.limiters.has(toolName) 
        ? this.limiters.get(toolName)!
        : this.limiters.get('global')!;
        
      const res = await limiter.get(client);
      return res ? res.remainingPoints : this.configs.get(toolName || 'global')!.points;
    } catch (error) {
      return 0;
    }
  }

  async getResetTime(clientId: string, toolName?: string): Promise<Date | null> {
    const client = clientId || 'anonymous';
    
    try {
      const limiter = toolName && this.limiters.has(toolName) 
        ? this.limiters.get(toolName)!
        : this.limiters.get('global')!;
        
      const res = await limiter.get(client);
      return res ? new Date(Date.now() + res.msBeforeNext) : null;
    } catch (error) {
      return null;
    }
  }

  getConfig(toolName?: string): RateLimitConfig | null {
    return this.configs.get(toolName || 'global') || null;
  }

  // Admin methods for managing rate limits
  async resetLimits(clientId: string): Promise<void> {
    const client = clientId || 'anonymous';
    
    for (const limiter of this.limiters.values()) {
      await limiter.delete(client);
    }
  }

  async blockClient(clientId: string, durationSeconds: number): Promise<void> {
    const client = clientId || 'anonymous';
    const globalLimiter = this.limiters.get('global')!;
    
    // Consume all points to block the client
    const config = this.configs.get('global')!;
    await globalLimiter.penalty(client, config.points, durationSeconds * 1000);
  }

  // Get statistics for monitoring
  async getStats(): Promise<any> {
    const stats = {
      configs: Object.fromEntries(this.configs),
      activeClients: 0,
      totalRequests: 0,
    };

    // Note: RateLimiterMemory doesn't provide built-in stats
    // In production, consider using Redis-based rate limiter for better monitoring
    
    return stats;
  }
}