/**
 * Structured Logger for UGLI App
 * 
 * Features:
 * - Log levels (debug, info, warn, error)
 * - Timestamps with consistent formatting
 * - Source/context tagging
 * - Production-safe (no sensitive data exposure)
 * - JSON format option for log aggregation
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  source?: string;
  userId?: string;
  requestId?: string;
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const getMinLogLevel = (): LogLevel => {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
  if (envLevel && LOG_LEVELS[envLevel] !== undefined) {
    return envLevel;
  }
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
};

const useJsonFormat = (): boolean => {
  return process.env.LOG_FORMAT === 'json';
};

const sanitize = (data: unknown): unknown => {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    return data
      .replace(/password["\s:=]+["']?[^"'\s,}]+["']?/gi, 'password: [REDACTED]')
      .replace(/token["\s:=]+["']?[^"'\s,}]+["']?/gi, 'token: [REDACTED]')
      .replace(/secret["\s:=]+["']?[^"'\s,}]+["']?/gi, 'secret: [REDACTED]')
      .replace(/api[_-]?key["\s:=]+["']?[^"'\s,}]+["']?/gi, 'apiKey: [REDACTED]')
      .replace(/authorization["\s:=]+["']?[^"'\s,}]+["']?/gi, 'authorization: [REDACTED]');
  }

  if (Array.isArray(data)) {
    return data.map(sanitize);
  }

  if (typeof data === 'object') {
    const sanitized: Record<string, unknown> = {};
    const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'authorization', 'credential', 'creditCard'];
    
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitize(value);
      }
    }
    return sanitized;
  }

  return data;
};

const formatTimestamp = (): string => {
  return new Date().toISOString();
};

const formatConsoleTimestamp = (): string => {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

const logMessage = (
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error
): void => {
  const minLevel = getMinLogLevel();
  
  if (LOG_LEVELS[level] < LOG_LEVELS[minLevel]) {
    return;
  }

  const timestamp = formatTimestamp();
  const source = context?.source || 'app';
  const sanitizedContext = context ? sanitize(context) as LogContext : undefined;

  if (useJsonFormat()) {
    const logEntry = {
      timestamp,
      level,
      message,
      source,
      ...sanitizedContext,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
        },
      }),
    };
    
    delete (logEntry as Record<string, unknown>).source;
    
    console.log(JSON.stringify(logEntry));
  } else {
    const consoleTime = formatConsoleTimestamp();
    const levelTag = level.toUpperCase().padEnd(5);
    const contextStr = sanitizedContext 
      ? ` ${JSON.stringify(sanitizedContext)}` 
      : '';
    
    const logLine = `${consoleTime} [${levelTag}] [${source}] ${message}${contextStr}`;
    
    switch (level) {
      case 'debug':
        console.debug(logLine);
        break;
      case 'info':
        console.info(logLine);
        break;
      case 'warn':
        console.warn(logLine);
        break;
      case 'error':
        console.error(logLine);
        if (error && process.env.NODE_ENV !== 'production') {
          console.error(error.stack);
        }
        break;
    }
  }
};

export const logger = {
  debug: (message: string, context?: LogContext) => {
    logMessage('debug', message, context);
  },

  info: (message: string, context?: LogContext) => {
    logMessage('info', message, context);
  },

  warn: (message: string, context?: LogContext) => {
    logMessage('warn', message, context);
  },

  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    const err = error instanceof Error ? error : undefined;
    const ctx = error instanceof Error ? context : (error as LogContext);
    logMessage('error', message, ctx, err);
  },

  child: (defaultContext: LogContext) => ({
    debug: (message: string, context?: LogContext) => {
      logMessage('debug', message, { ...defaultContext, ...context });
    },
    info: (message: string, context?: LogContext) => {
      logMessage('info', message, { ...defaultContext, ...context });
    },
    warn: (message: string, context?: LogContext) => {
      logMessage('warn', message, { ...defaultContext, ...context });
    },
    error: (message: string, error?: Error | unknown, context?: LogContext) => {
      const err = error instanceof Error ? error : undefined;
      const ctx = error instanceof Error ? context : (error as LogContext);
      logMessage('error', message, { ...defaultContext, ...ctx }, err);
    },
  }),

  http: (method: string, path: string, statusCode: number, durationMs: number, context?: LogContext) => {
    const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    logMessage(level, `${method} ${path} ${statusCode} in ${durationMs}ms`, { 
      source: 'http',
      ...context 
    });
  },
};

export default logger;
