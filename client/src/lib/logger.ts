/**
 * Client-side logger utility
 * - Development: logs to console
 * - Production: silences logs (can be extended to send to monitoring service)
 */

const isDev = import.meta.env.DEV;

export const logger = {
  /**
   * Log informational messages (development only)
   */
  info: (message: string, data?: unknown) => {
    if (isDev) {
      console.log(`[INFO] ${message}`, data !== undefined ? data : '');
    }
  },

  /**
   * Log warning messages (development only)
   */
  warn: (message: string, data?: unknown) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, data !== undefined ? data : '');
    }
  },

  /**
   * Log error messages
   * In production, this could be extended to send errors to Sentry or other monitoring
   */
  error: (message: string, error?: unknown) => {
    if (isDev) {
      console.error(`[ERROR] ${message}`, error || '');
    }
    // TODO: In production, send to error monitoring service (Sentry, etc.)
    // if (!isDev && error instanceof Error) {
    //   Sentry.captureException(error, { extra: { message } });
    // }
  },

  /**
   * Log debug messages (development only)
   */
  debug: (message: string, data?: unknown) => {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, data !== undefined ? data : '');
    }
  },
};
