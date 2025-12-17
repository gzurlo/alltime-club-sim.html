/**
 * Utilities Module
 * Common utility functions and helpers
 */

/**
 * Core utility functions
 */
export const Utils = {
  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in ms
   * @returns {Function} Throttled function
   */
  throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Optimize DOM operations with DocumentFragment
   * @param {Array} items - Items to render
   * @param {Function} renderFunc - Render function for each item
   * @returns {DocumentFragment} Fragment with rendered items
   */
  createFragment(items, renderFunc) {
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
      const element = renderFunc(item);
      if (element) fragment.appendChild(element);
    });
    return fragment;
  },

  /**
   * Format numbers with thousand separators
   * @param {number} num - Number to format
   * @returns {string} Formatted number string
   */
  formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString('en-US');
  },

  /**
   * Safe element lookup with error handling
   * @param {string} selector - CSS selector
   * @returns {Element|null} Found element or null
   */
  getElement(selector) {
    try {
      const element = document.querySelector(selector);
      if (!element) {
        console.warn(`Element not found: ${selector}`);
      }
      return element;
    } catch (error) {
      console.error(`Invalid selector: ${selector}`, error);
      return null;
    }
  },

  /**
   * Deep clone objects
   * @param {*} obj - Object to clone
   * @returns {*} Cloned object
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.error('Deep clone failed:', error);
      return obj;
    }
  },

  /**
   * Async wait utility
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} Promise that resolves after ms
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Generate unique IDs
   * @returns {string} Unique ID
   */
  generateId() {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

/**
 * Performance optimization utilities
 */
export const PerformanceOptimizer = {
  domCache: new Map(),

  /**
   * Cached DOM query
   * @param {string} selector - CSS selector
   * @param {boolean} forceRefresh - Force cache refresh
   * @returns {Element|null} Cached or fresh element
   */
  getCached(selector, forceRefresh = false) {
    if (forceRefresh || !this.domCache.has(selector)) {
      const element = document.querySelector(selector);
      this.domCache.set(selector, element);
    }
    return this.domCache.get(selector);
  },

  /**
   * Clear DOM cache
   */
  clearCache() {
    this.domCache.clear();
  },

  /**
   * Virtual scrolling for large lists
   * @param {Array} items - All items
   * @param {Function} renderFunc - Render function
   * @param {Element} container - Container element
   * @param {number} itemHeight - Height of each item
   * @param {number} buffer - Buffer items to render
   * @returns {Object} Update and destroy functions
   */
  virtualScroll(items, renderFunc, container, itemHeight = 50, buffer = 5) {
    const containerHeight = container.clientHeight;
    const visibleItems = Math.ceil(containerHeight / itemHeight);
    let scrollTop = container.scrollTop;

    const render = () => {
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
      const endIndex = Math.min(items.length, startIndex + visibleItems + buffer * 2);

      container.innerHTML = '';

      // Top spacer
      const spacerTop = document.createElement('div');
      spacerTop.style.height = `${startIndex * itemHeight}px`;
      container.appendChild(spacerTop);

      // Visible items
      const fragment = document.createDocumentFragment();
      for (let i = startIndex; i < endIndex; i++) {
        const element = renderFunc(items[i], i);
        if (element) fragment.appendChild(element);
      }
      container.appendChild(fragment);

      // Bottom spacer
      const spacerBottom = document.createElement('div');
      spacerBottom.style.height = `${(items.length - endIndex) * itemHeight}px`;
      container.appendChild(spacerBottom);
    };

    const handleScroll = Utils.throttle(() => {
      scrollTop = container.scrollTop;
      render();
    }, 16);

    container.addEventListener('scroll', handleScroll);
    render();

    return {
      update: () => render(),
      destroy: () => container.removeEventListener('scroll', handleScroll)
    };
  },

  /**
   * Batch DOM updates
   * @param {Function} callback - Function with DOM updates
   */
  batchUpdate(callback) {
    requestAnimationFrame(() => {
      callback();
    });
  },

  /**
   * Lazy load images
   * @param {Element} container - Container with images
   */
  lazyLoadImages(container) {
    const images = container.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => observer.observe(img));
  }
};

/**
 * Undo/Redo manager
 */
export const UndoManager = {
  undoStack: [],
  redoStack: [],
  maxStack: 50,

  /**
   * Save state for undo
   * @param {string} action - Action description
   * @param {Object} state - State to save
   */
  saveState(action, state) {
    this.undoStack.push({
      action,
      state: Utils.deepClone(state),
      timestamp: Date.now()
    });

    this.redoStack = [];

    if (this.undoStack.length > this.maxStack) {
      this.undoStack.shift();
    }

    console.log(`💾 Saved: ${action}`);
  },

  /**
   * Undo last action
   * @returns {Object|null} Previous state
   */
  undo() {
    if (this.undoStack.length === 0) {
      return null;
    }

    const current = this.undoStack.pop();
    this.redoStack.push(current);

    return current.state;
  },

  /**
   * Redo last undone action
   * @returns {Object|null} Next state
   */
  redo() {
    if (this.redoStack.length === 0) {
      return null;
    }

    const next = this.redoStack.pop();
    this.undoStack.push(next);

    return next.state;
  },

  /**
   * Clear all history
   */
  clear() {
    this.undoStack = [];
    this.redoStack = [];
  },

  /**
   * Get undo/redo status
   * @returns {Object} Status object
   */
  getStatus() {
    return {
      canUndo: this.undoStack.length > 0,
      canRedo: this.redoStack.length > 0,
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length
    };
  }
};

/**
 * Keyboard shortcuts manager
 */
export const KeyboardShortcuts = {
  shortcuts: new Map(),
  enabled: true,
  initialized: false,

  /**
   * Register shortcut
   * @param {string} key - Key combination
   * @param {Function} callback - Callback function
   * @param {string} description - Description
   */
  register(key, callback, description = '') {
    this.shortcuts.set(key.toLowerCase(), { callback, description });
  },

  /**
   * Unregister shortcut
   * @param {string} key - Key combination
   */
  unregister(key) {
    this.shortcuts.delete(key.toLowerCase());
  },

  /**
   * Initialize keyboard listener
   */
  init() {
    if (this.initialized) return;

    document.addEventListener('keydown', (e) => {
      if (!this.enabled) return;

      // Don't trigger in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const key = this._getKeyCombo(e);
      const shortcut = this.shortcuts.get(key);

      if (shortcut) {
        e.preventDefault();
        shortcut.callback(e);
      }
    });

    this.initialized = true;
    console.log('✅ Keyboard shortcuts initialized');
  },

  /**
   * Get key combination string
   * @param {KeyboardEvent} e - Keyboard event
   * @returns {string} Key combination
   */
  _getKeyCombo(e) {
    const parts = [];
    if (e.ctrlKey || e.metaKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    parts.push(e.key.toLowerCase());
    return parts.join('+');
  },

  /**
   * Get all shortcuts
   * @returns {Array} Array of shortcuts
   */
  getAll() {
    return Array.from(this.shortcuts.entries()).map(([key, data]) => ({
      key,
      description: data.description
    }));
  },

  /**
   * Enable/disable shortcuts
   * @param {boolean} enabled - Enable status
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }
};

export default Utils;
