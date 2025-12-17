/**
 * Main Application Entry Point
 * Initializes all modules and starts the application
 */

// Core modules
import { Security } from './core/security.js';
import { SafeStorage, DataCompressor } from './core/storage.js';
import { ErrorHandler } from './core/errors.js';
import { Utils, PerformanceOptimizer, UndoManager, KeyboardShortcuts } from './core/utils.js';

// UI modules
import { ProgressTracker, Toast, Loading } from './ui/notifications.js';

// Make modules globally available for compatibility
window.Security = Security;
window.SafeStorage = SafeStorage;
window.DataCompressor = DataCompressor;
window.ErrorHandler = ErrorHandler;
window.Utils = Utils;
window.PerformanceOptimizer = PerformanceOptimizer;
window.UndoManager = UndoManager;
window.KeyboardShortcuts = KeyboardShortcuts;
window.ProgressTracker = ProgressTracker;
window.Toast = Toast;
window.Loading = Loading;

/**
 * Data Manager - Export/Import/Backup system
 */
export const DataManager = {
  autoBackupInterval: null,
  lastBackupTime: null,

  /**
   * Export data to JSON file
   * @param {string} type - Export type: full, tournament, season, teams
   * @returns {boolean} Success status
   */
  export(type = 'full') {
    try {
      let data = {};
      const timestamp = new Date().toISOString();

      switch(type) {
        case 'tournament':
          data = {
            type: 'tournament',
            timestamp,
            tournament: SafeStorage.get('currentTournament'),
            manager: SafeStorage.get('managerProfile')
          };
          break;

        case 'season':
          data = {
            type: 'season',
            timestamp,
            season: SafeStorage.get('currentSeason'),
            career: SafeStorage.get('careerMode')
          };
          break;

        case 'teams':
          data = {
            type: 'teams',
            timestamp,
            customTeams: SafeStorage.get('customTeams') || []
          };
          break;

        case 'full':
        default:
          const keys = Object.keys(localStorage).filter(k => k.startsWith('football_sim_'));
          keys.forEach(key => {
            const shortKey = key.replace('football_sim_', '');
            data[shortKey] = SafeStorage.get(shortKey);
          });
          data.type = 'full';
          data.timestamp = timestamp;
          break;
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `football_sim_${type}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      Toast.show(`${type} data exported successfully!`, 'success', 3000);
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      ErrorHandler.log({ type: 'export', message: error.message, stack: error.stack });
      Toast.show('Export failed', 'error', 3000);
      return false;
    }
  },

  /**
   * Import data from JSON file
   * @returns {Promise<boolean>} Success status
   */
  import() {
    return new Promise((resolve, reject) => {
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (!file) {
            reject('No file selected');
            return;
          }

          Loading.show('Importing data...');

          try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!data.type || !data.timestamp) {
              throw new Error('Invalid data format');
            }

            if (data.type === 'full') {
              Object.keys(data).forEach(key => {
                if (key !== 'type' && key !== 'timestamp') {
                  SafeStorage.set(key, data[key]);
                }
              });
            } else {
              Object.keys(data).forEach(key => {
                if (key !== 'type' && key !== 'timestamp') {
                  SafeStorage.set(key, data[key]);
                }
              });
            }

            Loading.hide();
            Toast.show('Data imported successfully! Reloading...', 'success', 2000);

            setTimeout(() => {
              window.location.reload();
            }, 2000);

            resolve(true);
          } catch (error) {
            Loading.hide();
            console.error('Import failed:', error);
            ErrorHandler.log({ type: 'import', message: error.message, stack: error.stack });
            Toast.show('Import failed: Invalid or corrupted file', 'error', 3000);
            reject(error);
          }
        };

        input.click();
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Create backup of current state
   * @returns {boolean} Success status
   */
  backup() {
    try {
      const backupData = {};
      const keys = Object.keys(localStorage).filter(k => k.startsWith('football_sim_'));

      keys.forEach(key => {
        const shortKey = key.replace('football_sim_', '');
        backupData[shortKey] = SafeStorage.get(shortKey);
      });

      backupData.timestamp = new Date().toISOString();
      SafeStorage.set('backup_latest', backupData);
      this.lastBackupTime = Date.now();

      console.log('✅ Auto-backup created');
      return true;
    } catch (error) {
      console.error('Backup failed:', error);
      ErrorHandler.log({ type: 'backup', message: error.message, stack: error.stack });
      return false;
    }
  },

  /**
   * Restore from backup
   * @returns {boolean} Success status
   */
  restoreBackup() {
    try {
      const backup = SafeStorage.get('backup_latest');

      if (!backup || !backup.timestamp) {
        Toast.show('No backup available', 'error', 3000);
        return false;
      }

      const confirmRestore = confirm(
        `Restore backup from ${new Date(backup.timestamp).toLocaleString()}? Current data will be replaced.`
      );

      if (confirmRestore) {
        Loading.show('Restoring backup...');

        Object.keys(backup).forEach(key => {
          if (key !== 'timestamp') {
            SafeStorage.set(key, backup[key]);
          }
        });

        Loading.hide();
        Toast.show('Backup restored! Reloading...', 'success', 2000);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }

      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      ErrorHandler.log({ type: 'restore', message: error.message, stack: error.stack });
      Toast.show('Restore failed', 'error', 3000);
      return false;
    }
  },

  /**
   * Start auto-backup (every 5 minutes)
   */
  startAutoBackup() {
    if (this.autoBackupInterval) {
      clearInterval(this.autoBackupInterval);
    }

    this.autoBackupInterval = setInterval(() => {
      this.backup();
    }, 5 * 60 * 1000);

    console.log('✅ Auto-backup enabled (every 5 minutes)');
  },

  /**
   * Stop auto-backup
   */
  stopAutoBackup() {
    if (this.autoBackupInterval) {
      clearInterval(this.autoBackupInterval);
      this.autoBackupInterval = null;
      console.log('⏹️ Auto-backup stopped');
    }
  }
};

// Make DataManager globally available
window.DataManager = DataManager;

/**
 * Initialize application
 */
function initializeApp() {
  console.log('🚀 Initializing Football Simulator...');

  // Initialize core systems
  ErrorHandler.init();
  KeyboardShortcuts.init();
  DataManager.startAutoBackup();

  // Register default keyboard shortcuts
  KeyboardShortcuts.register('ctrl+s', (e) => {
    DataManager.export('full');
  }, 'Save/Export data');

  KeyboardShortcuts.register('ctrl+z', () => {
    const state = UndoManager.undo();
    if (state) {
      Toast.show('Undo: Action reversed', 'info', 2000);
      // Restore state logic would go here
    }
  }, 'Undo last action');

  KeyboardShortcuts.register('ctrl+y', () => {
    const state = UndoManager.redo();
    if (state) {
      Toast.show('Redo: Action restored', 'info', 2000);
      // Restore state logic would go here
    }
  }, 'Redo action');

  console.log('✅ Football Simulator initialized');
  console.log('✅ Press Ctrl+S to export data');
  console.log('✅ Press Ctrl+Z to undo');
  console.log('✅ Press Ctrl+Y to redo');

  // Initialize the rest of the application
  // This is where you would load teams, initialize UI, etc.
  initializeUI();
}

/**
 * Initialize UI components
 */
function initializeUI() {
  // Create app structure
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <div id="sidebar" class="sidebar">
        <h1>⚽ Football Simulator</h1>
        <nav id="main-nav"></nav>
      </div>
      <div id="main-content" class="main-content">
        <h2>Welcome to All-Time Football Simulator</h2>
        <p>Modular version initialized successfully!</p>
      </div>
    `;
  }

  // Show welcome toast
  Toast.show('Welcome to Football Simulator!', 'success', 3000);
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

export { initializeApp };
