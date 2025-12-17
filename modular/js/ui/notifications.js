/**
 * Notifications Module
 * Toast notifications, progress tracker, and loading overlays
 */

import { Security } from '../core/security.js';

/**
 * Progress tracker for long operations
 */
export const ProgressTracker = {
  progressBar: null,
  progressText: null,

  /**
   * Show progress bar
   * @param {string} message - Progress message
   */
  show(message = 'Processing...') {
    if (!this.progressBar) {
      this._create();
    }

    this.progressText.textContent = message;
    this.progressBar.style.display = 'flex';
    this.update(0);
  },

  /**
   * Update progress
   * @param {number} percent - Progress percentage (0-100)
   * @param {string} message - Optional message
   */
  update(percent, message = null) {
    if (!this.progressBar) return;

    const fill = this.progressBar.querySelector('.progress-fill');
    const percentText = this.progressBar.querySelector('.progress-percent');

    fill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    percentText.textContent = `${Math.round(percent)}%`;

    if (message) {
      this.progressText.textContent = message;
    }
  },

  /**
   * Hide progress bar
   */
  hide() {
    if (!this.progressBar) return;

    setTimeout(() => {
      this.progressBar.style.display = 'none';
    }, 300);
  },

  /**
   * Create progress bar element
   */
  _create() {
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'progress-tracker';
    this.progressBar.innerHTML = `
      <div class="progress-content">
        <div class="progress-text">Processing...</div>
        <div class="progress-bar-container">
          <div class="progress-fill"></div>
        </div>
        <div class="progress-percent">0%</div>
      </div>
    `;

    this.progressBar.style.cssText = `
      position: fixed; top: 20px; right: 20px;
      background: rgba(30, 41, 59, 0.98);
      border: 2px solid #3b82f6; border-radius: 12px;
      padding: 20px; z-index: 9999; display: none;
      min-width: 300px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    `;

    const content = this.progressBar.querySelector('.progress-content');
    content.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';

    this.progressText = this.progressBar.querySelector('.progress-text');
    this.progressText.style.cssText = 'color: #f1f5f9; font-size: 14px; font-weight: 600; text-align: center;';

    const barContainer = this.progressBar.querySelector('.progress-bar-container');
    barContainer.style.cssText = 'width: 100%; height: 8px; background: rgba(51, 65, 85, 0.8); border-radius: 4px; overflow: hidden;';

    const fill = this.progressBar.querySelector('.progress-fill');
    fill.style.cssText = 'height: 100%; width: 0%; background: linear-gradient(90deg, #3b82f6, #10b981); border-radius: 4px; transition: width 0.3s ease;';

    const percentText = this.progressBar.querySelector('.progress-percent');
    percentText.style.cssText = 'color: #94a3b8; font-size: 12px; text-align: center;';

    document.body.appendChild(this.progressBar);
  }
};

/**
 * Toast notification system
 */
export const Toast = {
  container: null,
  toasts: [],

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - Type: success, error, warning, info
   * @param {number} duration - Duration in ms (0 = no auto-dismiss)
   * @returns {Element} Toast element
   */
  show(message, type = 'info', duration = 3000) {
    if (!this.container) {
      this._createContainer();
    }

    const toast = this._createToast(message, type);
    this.container.appendChild(toast);
    this.toasts.push(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 10);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast);
      }, duration);
    }

    if (this.toasts.length > 5) {
      this.dismiss(this.toasts[0]);
    }

    return toast;
  },

  /**
   * Dismiss toast
   * @param {Element} toast - Toast element
   */
  dismiss(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(400px)';

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      this.toasts = this.toasts.filter(t => t !== toast);
    }, 300);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll() {
    this.toasts.forEach(toast => this.dismiss(toast));
  },

  /**
   * Create toast container
   */
  _createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    this.container.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 99999;
      display: flex; flex-direction: column; gap: 12px; pointer-events: none;
    `;
    document.body.appendChild(this.container);
  },

  /**
   * Create toast element
   * @param {string} message - Message
   * @param {string} type - Toast type
   * @returns {Element} Toast element
   */
  _createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const colors = {
      success: { bg: '#10b981', icon: '✓' },
      error: { bg: '#ef4444', icon: '✕' },
      warning: { bg: '#f59e0b', icon: '⚠' },
      info: { bg: '#3b82f6', icon: 'ⓘ' }
    };

    const color = colors[type] || colors.info;

    toast.innerHTML = `
      <div class="toast-icon">${color.icon}</div>
      <div class="toast-message">${Security.sanitize(message)}</div>
      <button class="toast-close">×</button>
    `;

    toast.style.cssText = `
      background: rgba(30, 41, 59, 0.98); border-left: 4px solid ${color.bg};
      border-radius: 8px; padding: 16px; min-width: 300px; max-width: 400px;
      display: flex; align-items: center; gap: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      opacity: 0; transform: translateX(400px);
      transition: all 0.3s ease; pointer-events: all;
    `;

    const icon = toast.querySelector('.toast-icon');
    icon.style.cssText = `
      width: 24px; height: 24px; background: ${color.bg}; color: white;
      border-radius: 50%; display: flex; align-items: center;
      justify-content: center; font-weight: bold; flex-shrink: 0;
    `;

    const messageEl = toast.querySelector('.toast-message');
    messageEl.style.cssText = 'color: #f1f5f9; font-size: 14px; flex: 1; word-break: break-word;';

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.style.cssText = `
      background: none; border: none; color: #94a3b8;
      font-size: 24px; cursor: pointer; padding: 0;
      width: 24px; height: 24px; display: flex;
      align-items: center; justify-content: center;
      transition: color 0.2s; flex-shrink: 0;
    `;

    closeBtn.onmouseover = () => closeBtn.style.color = '#f1f5f9';
    closeBtn.onmouseout = () => closeBtn.style.color = '#94a3b8';
    closeBtn.onclick = () => this.dismiss(toast);

    return toast;
  }
};

/**
 * Loading overlay manager
 */
export const Loading = {
  overlay: null,
  isVisible: false,

  /**
   * Show loading overlay
   * @param {string} message - Loading message
   */
  show(message = 'Loading...') {
    if (!this.overlay) {
      this._create();
    }

    const messageEl = this.overlay.querySelector('.loading-message');
    if (messageEl) {
      messageEl.textContent = message;
    }

    this.overlay.style.display = 'flex';
    setTimeout(() => {
      this.overlay.style.opacity = '1';
    }, 10);

    this.isVisible = true;
  },

  /**
   * Update loading message
   * @param {string} message - New message
   */
  update(message) {
    if (!this.overlay) return;
    const messageEl = this.overlay.querySelector('.loading-message');
    if (messageEl) {
      messageEl.textContent = message;
    }
  },

  /**
   * Hide loading overlay
   */
  hide() {
    if (!this.overlay) return;

    this.overlay.style.opacity = '0';
    setTimeout(() => {
      this.overlay.style.display = 'none';
      this.isVisible = false;
    }, 300);
  },

  /**
   * Create loading overlay element
   */
  _create() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'loading-overlay';
    this.overlay.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <div class="loading-message">Loading...</div>
    `;

    this.overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15, 23, 42, 0.95); display: none;
      justify-content: center; align-items: center; flex-direction: column;
      z-index: 10000; opacity: 0; transition: opacity 0.3s ease;
    `;

    const spinner = this.overlay.querySelector('.loading-spinner');
    spinner.style.cssText = 'position: relative; width: 80px; height: 80px; margin-bottom: 20px;';

    const rings = this.overlay.querySelectorAll('.spinner-ring');
    rings.forEach((ring, i) => {
      ring.style.cssText = `
        position: absolute; width: 64px; height: 64px; margin: 8px;
        border: 4px solid transparent;
        border-top-color: ${['#10b981', '#3b82f6', '#f59e0b'][i]};
        border-radius: 50%; animation: spin ${1.2 + i * 0.3}s linear infinite;
      `;
    });

    const message = this.overlay.querySelector('.loading-message');
    message.style.cssText = 'color: #f1f5f9; font-size: 18px; font-weight: 600; text-align: center;';

    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(this.overlay);
  }
};

export default { ProgressTracker, Toast, Loading };
