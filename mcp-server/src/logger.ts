/**
 * Logger for MCP Chess Server
 * 
 * Provides structured logging for monitoring and debugging
 * the agentic chess API.
 */

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, meta?: any): void {
    this.log('INFO', message, meta);
  }

  error(message: string, meta?: any): void {
    this.log('ERROR', message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log('WARN', message, meta);
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      this.log('DEBUG', message, meta);
    }
  }

  private log(level: string, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      ...(meta && { meta }),
    };

    console.log(JSON.stringify(logEntry));
  }
}