/**
 * Error Handling Module
 * Global error handler and logging system
 */

import { SafeStorage } from './storage.js';

/**
 * Global error handler
 */
export const ErrorHandler = {
  errors: [],
  maxErrors: 100,
  initialized: false,

  /**
   * Initialize error handlers
   */
  init() {
    if (this.initialized) return;

    // Catch runtime errors
    window.addEventListener('error', (event) => {
      this.log({
        type: 'runtime',
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack
      });
    });

    // Catch promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.log({
        type: 'promise',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack
      });
    });

    this.initialized = true;
    console.log('✅ Error handler initialized');
  },

  /**
   * Log error with context
   * @param {Object} errorInfo - Error information
   */
  log(errorInfo) {
    const error = {
      ...errorInfo,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    this.errors.push(error);

    // Keep last 100 errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log in development
    if (window.location.hostname === 'localhost') {
      console.error('❌ Error caught:', error);
    }

    // Save to storage for debugging
    SafeStorage.set('last_error', error);
  },

  /**
   * Get all logged errors
   * @returns {Array} Array of error objects
   */
  getErrors() {
    return this.errors;
  },

  /**
   * Clear all errors
   */
  clearErrors() {
    this.errors = [];
  }
};

export default ErrorHandler;
