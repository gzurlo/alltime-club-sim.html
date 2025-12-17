# 🚀 Quick Start Guide - Modular Football Simulator

**Get up and running in 5 minutes!**

---

## ⚡ IMMEDIATE TESTING (What Works Now)

### **Step 1: Start a Local Server**

```bash
# Navigate to modular directory
cd "/Users/gianlucazurlo/Soccer HTML game/alltime-club-sim.html-1/modular"

# Option A: Python (recommended)
python3 -m http.server 8000

# Option B: Node.js
npx http-server -p 8000

# Option C: PHP
php -S localhost:8000
```

### **Step 2: Open in Browser**

```
http://localhost:8000
```

### **Step 3: Test Core Features**

Open browser console (F12) and verify:

```
✅ 🚀 Initializing Football Simulator...
✅ Error handler initialized
✅ Keyboard shortcuts initialized
✅ Auto-backup enabled (every 5 minutes)
✅ Football Simulator initialized
```

You should also see a green toast: **"Welcome to Football Simulator!"**

---

## 🧪 TEST THE MODULES

### **Test 1: Toast Notifications**

```javascript
// In browser console:
Toast.show('This is a success!', 'success', 3000);
Toast.show('This is an error!', 'error', 3000);
Toast.show('This is a warning!', 'warning', 4000);
Toast.show('This is info!', 'info', 2000);
```

### **Test 2: Progress Tracker**

```javascript
// Show progress bar
ProgressTracker.show('Testing progress...');

// Simulate progress
let progress = 0;
const interval = setInterval(() => {
  progress += 10;
  ProgressTracker.update(progress, `Step ${progress}/100`);
  if (progress >= 100) {
    clearInterval(interval);
    ProgressTracker.hide();
    Toast.show('Progress complete!', 'success', 2000);
  }
}, 200);
```

### **Test 3: Loading Overlay**

```javascript
// Show loading
Loading.show('Loading data...');

// Hide after 2 seconds
setTimeout(() => Loading.hide(), 2000);
```

### **Test 4: Storage System**

```javascript
// Save data
SafeStorage.set('test_key', { value: 123, name: 'Test' });

// Load data
const data = SafeStorage.get('test_key');
console.log(data); // { value: 123, name: 'Test' }

// Check storage usage
const usage = SafeStorage.getUsage();
console.log(`Storage: ${usage.kb} KB`);

// Remove data
SafeStorage.remove('test_key');
```

### **Test 5: Security**

```javascript
// Test XSS prevention
const unsafe = '<script>alert("XSS")</script>';
const safe = Security.sanitize(unsafe);
console.log(safe); // &lt;script&gt;alert("XSS")&lt;/script&gt;

// Test validation
console.log(Security.validate.managerName('John Doe')); // true
console.log(Security.validate.managerName('John@123')); // false
```

### **Test 6: Utilities**

```javascript
// Format numbers
console.log(Utils.formatNumber(1234567)); // "1,234,567"

// Generate ID
console.log(Utils.generateId()); // "id_1702800000_abc123xyz"

// Deep clone
const obj = { nested: { value: 123 } };
const copy = Utils.deepClone(obj);
console.log(copy.nested.value); // 123
```

### **Test 7: Undo/Redo**

```javascript
// Save state
UndoManager.saveState('Test Action', { data: 'original' });
UndoManager.saveState('Another Action', { data: 'modified' });

// Check status
console.log(UndoManager.getStatus());
// { canUndo: true, canRedo: false, undoCount: 2, redoCount: 0 }

// Undo
const prevState = UndoManager.undo();
console.log(prevState); // { data: 'original' }

// Redo
const nextState = UndoManager.redo();
console.log(nextState); // { data: 'modified' }
```

### **Test 8: Keyboard Shortcuts**

Try these keyboard combinations:

- **Ctrl+S** (or Cmd+S on Mac) → Exports data (downloads JSON file)
- **Ctrl+Z** → Undo (shows toast notification)
- **Ctrl+Y** → Redo (shows toast notification)

### **Test 9: Data Export/Import**

```javascript
// Export all data
DataManager.export('full');
// Downloads: football_sim_full_[timestamp].json

// Export specific data
DataManager.export('tournament');
DataManager.export('season');
DataManager.export('teams');

// Import data (opens file picker)
DataManager.import();
```

### **Test 10: Auto-Backup**

```javascript
// Manual backup
DataManager.backup();
// Check console: "✅ Auto-backup created"

// Restore backup
DataManager.restoreBackup();
// Shows confirmation dialog

// Stop auto-backup
DataManager.stopAutoBackup();

// Restart auto-backup
DataManager.startAutoBackup();
```

---

## 📁 WHAT'S INCLUDED

### **✅ Currently Working**

| Module | Status | Features |
|--------|--------|----------|
| **security.js** | ✅ Complete | XSS prevention, sanitization, validation |
| **storage.js** | ✅ Complete | Safe localStorage, compression, quota handling |
| **errors.js** | ✅ Complete | Global error handling, logging |
| **utils.js** | ✅ Complete | Debounce, throttle, virtual scroll, undo/redo |
| **notifications.js** | ✅ Complete | Toast, progress tracker, loading overlay |
| **main.js** | ✅ Complete | App initialization, DataManager, shortcuts |
| **index.html** | ✅ Complete | Minimal structure, module loading |

### **⏳ To Be Extracted (from original file)**

| Module | Status | What to Extract |
|--------|--------|-----------------|
| **teams.js** | ⏳ TODO | TEAMS array, team database |
| **state.js** | ⏳ TODO | MANAGER_STATE, TOURNAMENT_STATE |
| **engine.js** | ⏳ TODO | simulateMatch(), Poisson distribution |
| **tournaments.js** | ⏳ TODO | generateTournament(), bracket logic |
| **statistics.js** | ⏳ TODO | calculateStats(), player stats |
| **modals.js** | ⏳ TODO | showModal(), modal system |
| **renderer.js** | ⏳ TODO | displayTeams(), renderMatch() |
| **navigation.js** | ⏳ TODO | tabs, sidebar, keyboard nav |
| **styles.css** | ⏳ TODO | All CSS from `<style>` tags |

---

## 📊 ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────┐
│         index.html (50 lines)       │
│  Loads: main.js + styles.css        │
└─────────────────┬───────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │    main.js     │ ◄── Entry point
         │  (350 lines)   │
         └────────┬───────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌────────┐   ┌────────┐   ┌────────┐
│  Core  │   │   UI   │   │  Data  │
│Modules │   │Modules │   │Modules │
└────────┘   └────────┘   └────────┘
    │             │             │
    └─────────────┼─────────────┘
                  │
                  ▼
           ┌──────────────┐
           │  Simulation  │
           │   Modules    │
           └──────────────┘
```

**Load Order:**
1. index.html loads main.js
2. main.js imports all core modules
3. Core modules are independent
4. UI/Data/Simulation depend on core
5. Everything is wired together in main.js

---

## 🎯 NEXT STEPS TO COMPLETE

### **Phase 1: Extract Teams Data** (30 minutes)

1. Open original `alltime-club-sim.html`
2. Find: `const TEAMS = [...]` (around line 8000-15000)
3. Copy to: `js/data/teams.js`
4. Add exports:
   ```javascript
   export const TEAMS = [
     // ... all team data
   ];

   export function getTeamById(id) {
     return TEAMS.find(t => t.id === id);
   }
   ```

### **Phase 2: Extract State** (15 minutes)

1. Find: `let MANAGER_STATE = {...}`
2. Find: `let TOURNAMENT_STATE = {...}`
3. Copy to: `js/data/state.js`
4. Export all state objects

### **Phase 3: Extract Match Engine** (45 minutes)

1. Find: `function simulateMatch(...)`
2. Find: Poisson distribution code
3. Find: Goal generation logic
4. Copy to: `js/simulation/engine.js`
5. Export all functions

### **Phase 4: Extract CSS** (20 minutes)

1. Find all `<style>` tags
2. Copy content to: `css/styles.css`
3. Remove from index.html

### **Phase 5: Extract UI** (60 minutes)

1. Find modal functions
2. Find display functions
3. Find navigation code
4. Split into modals.js, renderer.js, navigation.js

---

## 🐛 TROUBLESHOOTING

### **Problem: Modules not loading**

```
Failed to load module script: Expected a JavaScript module script
```

**Solution:**
- Use a local server (can't open file:// directly)
- Check file paths are correct
- Verify `type="module"` in script tags

### **Problem: CORS errors**

```
Access to script blocked by CORS policy
```

**Solution:**
- Must use a local server
- Try: `python3 -m http.server 8000`
- Or: VS Code "Live Server" extension

### **Problem: Functions not defined**

```
Uncaught ReferenceError: Toast is not defined
```

**Solution:**
- Check if module is imported in main.js
- Verify module is exposed to window
- Check browser console for import errors

### **Problem: Keyboard shortcuts not working**

**Solution:**
- Check if focus is not in input field
- Verify KeyboardShortcuts.init() was called
- Try: `KeyboardShortcuts.setEnabled(true)`

---

## 📖 API QUICK REFERENCE

### **Toast**
```javascript
Toast.show(message, type, duration);
// Types: 'success', 'error', 'warning', 'info'
```

### **Progress**
```javascript
ProgressTracker.show(message);
ProgressTracker.update(percent, message);
ProgressTracker.hide();
```

### **Loading**
```javascript
Loading.show(message);
Loading.hide();
```

### **Storage**
```javascript
SafeStorage.set(key, value);
SafeStorage.get(key, default);
SafeStorage.remove(key);
```

### **Security**
```javascript
Security.sanitize(html);
Security.validate.managerName(name);
```

### **Utils**
```javascript
Utils.formatNumber(num);
Utils.deepClone(obj);
Utils.sleep(ms);
```

### **Data Manager**
```javascript
DataManager.export('full');
DataManager.import();
DataManager.backup();
```

---

## 🎉 SUCCESS CHECKLIST

After following this guide, you should be able to:

- [x] Run modular app on local server
- [x] See initialization messages in console
- [x] See welcome toast notification
- [x] Use keyboard shortcuts (Ctrl+S, Ctrl+Z, Ctrl+Y)
- [x] Show toast notifications
- [x] Display progress bars
- [x] Save/load data with SafeStorage
- [x] Export/import data as JSON
- [x] Use undo/redo system

**All working? You're ready to extract the rest of the modules!** 🚀

---

## 💡 TIPS

1. **Use browser DevTools:** Network tab shows which modules loaded
2. **Check console:** All modules log initialization messages
3. **Test incrementally:** Extract one module at a time
4. **Keep original:** Don't delete original file until done
5. **Git commits:** Commit after each working module

---

## 📞 NEED HELP?

**Check these first:**
1. Browser console for errors
2. Network tab for failed module loads
3. File paths are correct
4. Local server is running

**Common mistakes:**
- Forgetting `type="module"` in script tag
- Wrong file paths (case-sensitive!)
- Not using local server
- Missing export/import statements

---

**Ready to complete the extraction? See MODULAR_ARCHITECTURE.md for full guide!**
