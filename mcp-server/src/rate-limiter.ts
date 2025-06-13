/**
 * Rate Limiter for MCP Chess Server
 * 
 * Implements sophisticated rate limiting to prevent abuse
 * while allowing legitimate AI agents to use chess tools effectively.
 */

import { RateLimiterMemory } from 'rate-limiter-flexible';

interface RateLimitConfig {
  points: number;      // Number of requests
  duration: number;    // Per duration in seconds
  blockDuration: number; // Block duration in seconds
}

export class RateLimiter {
  private limiters: Map<string, RateLimiterMemory>;
  private configs: Map<string, RateLimitConfig>;

  constructor() {
    this.limiters = new Map();
    this.configs = new Map();
    this.initializeRateLimits();
  }

  private initializeRateLimits(): void {
    // Different rate limits for different tool types
    const configs = {
      // Analysis tools - more resource intensive
      'analyze_position': { points: 10, duration: 60, blockDuration: 300 },
      'simulate_game': { points: 5, duration: 60, blockDuration: 600 },
      
      // Quick tools - less resource intensive
      'generate_moves': { points: 30, duration: 60, blockDuration: 60 },
      'evaluate_position': { points: 20, duration: 60, blockDuration: 120 },
      'play_move': { points: 15, duration: 60, blockDuration: 180 },
      'opening_book': { points: 25, duration: 60, blockDuration: 60 },
      
      // Global rate limit per client
      'global': { points: 50, duration: 60, blockDuration: 300 },
    };

    for (const [key, config] of Object.entries(configs)) {
      this.configs.set(key, config);
      this.limiters.set(key, new RateLimiterMemory({
        points: config.points,
        duration: config.duration,
        blockDuration: config.blockDuration,
      }));
    }
  }

  async checkLimit(clientId: string, toolName?: string): Promise<void> {
    const checks = ['global'];
    if (toolName) {
      checks.push(toolName);
    }

    for (const checkType of checks) {
      const limiter = this.limiters.get(checkType);
      if (!limiter) continue;

      try {
        await limiter.consume(clientId);
      } catch (rejRes: any) {
        const config = this.configs.get(checkType);
        const resetTime = new Date(Date.now() + rejRes.msBeforeNext);
        
        throw new Error(
          `Rate limit exceeded for ${checkType}. ` +
          `Limit: ${config?.points} requests per ${config?.duration}s. ` +
          `Reset at: ${resetTime.toISOString()}`
        );
      }
    }
  }

  async getRemainingPoints(clientId: string, toolName?: string): Promise<number> {
    const checkType = toolName || 'global';
    const limiter = this.limiters.get(checkType);
    
    if (!limiter) return 0;

    try {
      const result = await limiter.get(clientId);
      const config = this.configs.get(checkType);
      return config ? config.points - (result?.totalHits || 0) : 0;
    } catch (error) {
      return 0;
    }
  }

  async resetLimits(clientId: string): Promise<void> {
    for (const limiter of this.limiters.values()) {
      try {
        await limiter.delete(clientId);
      } catch (error) {
        // Ignore errors when resetting
      }
    }
  }
}