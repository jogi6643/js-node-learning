// ==========================================================================
// Progress Tracker & LocalStorage State Manager
// Tracks Completed Questions, Bookmarks, Weak Topics, and Calculates Stats
// ==========================================================================

const STORAGE_KEY = 'senior_js_node_prep_state_v1';

export class DashboardState {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable or corrupt, using memory state:', e);
    }
    return {
      completed: {},  // { 'js-1': true, 'node-5': true }
      bookmarked: {}, // { 'js-3': true }
      weak: {},       // { 'node-2': true }
      lang: 'en',     // 'en' or 'hinglish'
      theme: 'dark'   // 'dark' or 'light'
    };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  toggleCompleted(id) {
    if (this.state.completed[id]) {
      delete this.state.completed[id];
    } else {
      this.state.completed[id] = true;
    }
    this.save();
    return !!this.state.completed[id];
  }

  isCompleted(id) {
    return !!this.state.completed[id];
  }

  toggleBookmark(id) {
    if (this.state.bookmarked[id]) {
      delete this.state.bookmarked[id];
    } else {
      this.state.bookmarked[id] = true;
    }
    this.save();
    return !!this.state.bookmarked[id];
  }

  isBookmarked(id) {
    return !!this.state.bookmarked[id];
  }

  toggleWeak(id) {
    if (this.state.weak[id]) {
      delete this.state.weak[id];
    } else {
      this.state.weak[id] = true;
    }
    this.save();
    return !!this.state.weak[id];
  }

  isWeak(id) {
    return !!this.state.weak[id];
  }

  setLanguage(lang) {
    this.state.lang = lang;
    this.save();
  }

  getLanguage() {
    return this.state.lang || 'en';
  }

  setTheme(theme) {
    this.state.theme = theme;
    this.save();
  }

  getTheme() {
    return this.state.theme || 'dark';
  }

  getStats(jsQuestions, nodeQuestions) {
    const jsCount = jsQuestions.length;
    const nodeCount = nodeQuestions.length;
    const totalCount = jsCount + nodeCount;

    let jsCompleted = 0;
    let nodeCompleted = 0;

    jsQuestions.forEach(q => {
      if (this.state.completed[q.id]) jsCompleted++;
    });

    nodeQuestions.forEach(q => {
      if (this.state.completed[q.id]) nodeCompleted++;
    });

    const totalCompleted = jsCompleted + nodeCompleted;
    const overallPct = totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 0;
    const jsPct = jsCount > 0 ? Math.round((jsCompleted / jsCount) * 100) : 0;
    const nodePct = nodeCount > 0 ? Math.round((nodeCompleted / nodeCount) * 100) : 0;

    const bookmarkedCount = Object.keys(this.state.bookmarked).length;
    const weakCount = Object.keys(this.state.weak).length;

    return {
      jsCompleted,
      jsCount,
      jsPct,
      nodeCompleted,
      nodeCount,
      nodePct,
      totalCompleted,
      totalCount,
      overallPct,
      bookmarkedCount,
      weakCount
    };
  }
}
