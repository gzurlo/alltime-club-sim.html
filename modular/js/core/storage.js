/**
 * Storage Module
 * Safe localStorage wrapper with quota handling and compression
 */

/**
 * Safe localStorage wrapper with quota handling
 */
export const SafeStorage = {
  prefix: 'football_sim_',
  quotaExceeded: false,

  /**
   * Get item safely from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Stored value or default
   */
  get(key, defaultValue = null) {
    try {
      const fullKey = this.prefix + key;
      const item = localStorage.getItem(fullKey);

      if (item === null) return defaultValue;

      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.error(`Storage read error (${key}):`, error);
      return defaultValue;
    }
  },

  /**
   * Set item with quota handling
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @param {number} retryCount - Retry attempt count
   * @returns {boolean} Success status
   */
  set(key, value, retryCount = 0) {
    try {
      const fullKey = this.prefix + key;
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);

      localStorage.setItem(fullKey, serialized);
      this.quotaExceeded = false;
      return true;

    } catch (error) {
      if (error.name === 'QuotaExceededError' && retryCount < 3) {
        this.quotaExceeded = true;
        this.cleanup();
        return this.set(key, value, retryCount + 1);
      }

      console.error(`Storage write error (${key}):`, error);

      if (this.quotaExceeded && typeof window.showUtilityMessage === 'function') {
        window.showUtilityMessage('Storage full. Please export and clear old data.', 'error');
      }

      return false;
    }
  },

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      const fullKey = this.prefix + key;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error(`Storage remove error (${key}):`, error);
      return false;
    }
  },

  /**
   * Clear all app data from storage
   * @returns {boolean} Success status
   */
  clear() {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },

  /**
   * Get storage usage statistics
   * @returns {Object} Usage in bytes, KB, MB
   */
  getUsage() {
    let totalSize = 0;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        totalSize += new Blob([localStorage.getItem(key)]).size;
      }
    });
    return {
      bytes: totalSize,
      kb: (totalSize / 1024).toFixed(2),
      mb: (totalSize / 1024 / 1024).toFixed(2)
    };
  },

  /**
   * Clean up largest items when quota exceeded
   */
  cleanup() {
    try {
      const items = [];
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          items.push({
            key,
            size: new Blob([localStorage.getItem(key)]).size
          });
        }
      });

      // Remove largest 20%
      items.sort((a, b) => b.size - a.size);
      const toRemove = Math.ceil(items.length * 0.2);
      for (let i = 0; i < toRemove; i++) {
        localStorage.removeItem(items[i].key);
      }

      console.log(`Cleaned up ${toRemove} items`);
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
};

/**
 * Simple data compression for storage
 */
export const DataCompressor = {
  /**
   * Compress string using base64 encoding
   * @param {string|Object} str - Data to compress
   * @returns {string} Compressed string
   */
  compress(str) {
    try {
      if (typeof str === 'object') {
        str = JSON.stringify(str);
      }
      return btoa(encodeURIComponent(str));
    } catch (error) {
      console.error('Compression failed:', error);
      return str;
    }
  },

  /**
   * Decompress string
   * @param {string} str - Compressed string
   * @returns {string} Decompressed string
   */
  decompress(str) {
    try {
      const decoded = atob(str);
      return decodeURIComponent(decoded);
    } catch (error) {
      console.error('Decompression failed:', error);
      return str;
    }
  },

  /**
   * Get compression ratio
   * @param {string} original - Original string
   * @param {string} compressed - Compressed string
   * @returns {number} Compression ratio percentage
   */
  getRatio(original, compressed) {
    return (compressed.length / original.length * 100).toFixed(2);
  }
};

export default SafeStorage;
