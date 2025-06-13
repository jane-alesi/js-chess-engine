/**
 * Logger for MCP Chess Server
 * 
 * Provides structured logging with different levels and contexts
 * for monitoring and debugging the agentic chess API.
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  timestamp: string;
  level: string;
  context: string;
  message: string;
  data?: any;
  requestId?: string;
}

export class Logger {
  private context: string;
  private level: LogLevel;
  private requestId?: string;

  constructor(context: string = 'ChessMCP', level: LogLevel = LogLevel.INFO) {
    this.context = context;
    this.level = level;
  }

  setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  error(message: string, data?: any): void {
    if (this.level >= LogLevel.ERROR) {
      this.log(LogLevel.ERROR, message, data);
    }
  }

  warn(message: string, data?: any): void {
    if (this.level >= LogLevel.WARN) {
      this.log(LogLevel.WARN, message, data);
    }
  }

  info(message: string, data?: any): void {
    if (this.level >= LogLevel.INFO) {
      this.log(LogLevel.INFO, message, data);
    }
  }

  debug(message: string, data?: any): void {
    if (this.level >= LogLevel.DEBUG) {
      this.log(LogLevel.DEBUG, message, data);
    }
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      context: this.context,
      message,
      requestId: this.requestId,
    };

    if (data !== undefined) {
      entry.data = this.sanitizeData(data);
    }

    // Format output based on environment
    if (process.env.NODE_ENV === 'production') {
      // JSON format for production logging
      console.log(JSON.stringify(entry));
    } else {
      // Human-readable format for development
      const timestamp = entry.timestamp.substring(11, 19); // HH:MM:SS
      const levelStr = `[${entry.level}]`.padEnd(7);
      const contextStr = `[${entry.context}]`.padEnd(12);
      const requestStr = entry.requestId ? `[${entry.requestId}]` : '';
      
      let output = `${timestamp} ${levelStr} ${contextStr} ${requestStr} ${message}`;
      
      if (data !== undefined) {
        output += '\n' + JSON.stringify(entry.data, null, 2);
      }
      
      // Color coding for different log levels
      switch (level) {
        case LogLevel.ERROR:
          console.error('\x1b[31m%s\x1b[0m', output); // Red
          break;
        case LogLevel.WARN:
          console.warn('\x1b[33m%s\x1b[0m', output); // Yellow
          break;
        case LogLevel.INFO:
          console.info('\x1b[36m%s\x1b[0m', output); // Cyan
          break;
        case LogLevel.DEBUG:
          console.debug('\x1b[90m%s\x1b[0m', output); // Gray
          break;
      }
    }
  }

  private sanitizeData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      // Truncate very long strings
      return data.length > 1000 ? data.substring(0, 1000) + '...' : data;
    }

    if (typeof data === 'object') {
      try {
        const sanitized = { ...data };
        
        // Remove sensitive fields
        const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'key'];
        for (const field of sensitiveFields) {
          if (field in sanitized) {
            sanitized[field] = '[REDACTED]';
          }
        }

        // Truncate large objects
        const jsonStr = JSON.stringify(sanitized);
        if (jsonStr.length > 2000) {
          return { ...sanitized, _truncated: true, _originalSize: jsonStr.length };
        }

        return sanitized;
      } catch (error) {
        return '[Circular or non-serializable object]';
      }
    }

    return data;
  }

  // Create child logger with additional context
  child(additionalContext: string): Logger {
    const childLogger = new Logger(`${this.context}:${additionalContext}`, this.level);
    childLogger.requestId = this.requestId;
    return childLogger;
  }

  // Performance logging helpers
  time(label: string): void {
    console.time(`${this.context}:${label}`);
  }

  timeEnd(label: string): void {
    console.timeEnd(`${this.context}:${label}`);
  }

  // Metrics logging
  metric(name: string, value: number, unit: string = '', tags?: Record<string, string>): void {
    this.info(`Metric: ${name}`, {
      metric: name,
      value,
      unit,
      tags,
      timestamp: Date.now(),
    });
  }

  // Request/response logging
  request(method: string, tool: string, args: any): void {
    this.info(`Request: ${method} ${tool}`, {
      method,
      tool,
      args: this.sanitizeData(args),
    });
  }

  response(tool: string, success: boolean, duration: number, error?: string): void {
    const level = success ? LogLevel.INFO : LogLevel.ERROR;
    const message = `Response: ${tool} ${success ? 'SUCCESS' : 'ERROR'} (${duration}ms)`;
    
    this.log(level, message, {
      tool,
      success,
      duration,
      error,
    });
  }

  // Chess-specific logging
  analysis(fen: string, depth: number, evaluation: number, nodes: number, timeMs: number): void {
    this.info('Chess Analysis', {
      fen: fen.substring(0, 50) + (fen.length > 50 ? '...' : ''),
      depth,
      evaluation,
      nodes,
      timeMs,
      nps: Math.round(nodes / (timeMs / 1000)),
    });
  }

  gameSimulation(moves: number, result: string, termination: string): void {
    this.info('Game Simulation Complete', {
      moves,
      result,
      termination,
    });
  }

  // Security logging
  securityEvent(event: string, clientId: string, details?: any): void {
    this.warn(`Security Event: ${event}`, {
      event,
      clientId,
      details: this.sanitizeData(details),
    });
  }

  rateLimitHit(clientId: string, tool: string, resetTime: Date): void {
    this.warn('Rate Limit Hit', {
      clientId,
      tool,
      resetTime: resetTime.toISOString(),
    });
  }
}