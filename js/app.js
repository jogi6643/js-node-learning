// ==========================================================================
// Main Application Controller
// Orchestrates Tabs, Searching, Filtering, Visualizers, Practice, and State
// ==========================================================================

import { JS_QUESTIONS } from './data/js-questions.js';
import { NODE_QUESTIONS } from './data/node-questions.js';
import { DashboardState } from './components/dashboard.js';
import { renderQuestionCard } from './components/question-card.js';
import { CodeSandbox } from './components/code-sandbox.js';
import { EventLoopVisualizer } from './visualizers/event-loop.js';
import { SystemDiagramsEngine } from './visualizers/system-diagrams.js';
import { PracticeEngine } from './components/practice-mode.js';

class InterviewApp {
  constructor() {
    this.jsQuestions = JS_QUESTIONS;
    this.nodeQuestions = NODE_QUESTIONS;
    this.dashboardState = new DashboardState();

    this.activeTab = 'js'; // 'js' or 'node'
    this.activeFilter = 'all'; // 'all', 'must-know', 'completed', 'bookmarked', 'weak'
    this.selectedCategory = 'all';
    this.searchQuery = '';
    
    this.eventLoopViz = null;
    this.systemDiagramsEngine = null;
    this.practiceEngine = null;
  }

  init() {
    // Apply saved theme & language
    this.applyTheme(this.dashboardState.getTheme());
    this.updateLanguageUI(this.dashboardState.getLanguage());

    // Initialize visualizers & practice engines
    this.eventLoopViz = new EventLoopVisualizer('event-loop-viz-container');
    this.eventLoopViz.init();

    this.systemDiagramsEngine = new SystemDiagramsEngine('system-diagrams-viz-container');
    this.systemDiagramsEngine.init();

    this.practiceEngine = new PracticeEngine(this);
    this.practiceEngine.init();

    // Attach DOM listeners
    this.attachHeaderEvents();
    this.attachSidebarEvents();
    this.attachHeroEvents();

    // Initial render
    this.renderQuestions();
    this.updateDashboardStats();
    this.renderCategorySidebar();
  }

  // ========================================================================
  // Header & Theme / Language
  // ========================================================================
  attachHeaderEvents() {
    // Tab switching (JS vs Node)
    const tabJs = document.getElementById('tab-btn-js');
    const tabNode = document.getElementById('tab-btn-node');

    if (tabJs) {
      tabJs.addEventListener('click', () => this.switchTab('js'));
    }
    if (tabNode) {
      tabNode.addEventListener('click', () => this.switchTab('node'));
    }

    // Global Language Toggle (English <-> Hinglish)
    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        const current = this.dashboardState.getLanguage();
        const next = current === 'en' ? 'hinglish' : 'en';
        this.dashboardState.setLanguage(next);
        this.updateLanguageUI(next);
        this.renderQuestions();
      });
    }

    // Theme Toggle (Dark <-> Light)
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = this.dashboardState.getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        this.dashboardState.setTheme(next);
        this.applyTheme(next);
      });
    }

    // Quick Practice Launch Buttons in Header
    const btnMock = document.getElementById('btn-nav-mock');
    if (btnMock) {
      btnMock.addEventListener('click', () => this.practiceEngine.startMockInterview(this.activeTab));
    }

    const btnQuiz = document.getElementById('btn-nav-quiz');
    if (btnQuiz) {
      btnQuiz.addEventListener('click', () => this.practiceEngine.startQuiz());
    }

    // Mobile Sidebar Toggle
    const btnMobileMenu = document.getElementById('btn-mobile-menu');
    const sidebar = document.getElementById('app-sidebar');
    if (btnMobileMenu && sidebar) {
      btnMobileMenu.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  updateLanguageUI(lang) {
    const enTag = document.getElementById('lang-tag-en');
    const hiTag = document.getElementById('lang-tag-hi');
    if (enTag && hiTag) {
      if (lang === 'hinglish') {
        hiTag.className = 'lang-tag active';
        enTag.className = 'lang-tag inactive';
      } else {
        enTag.className = 'lang-tag active';
        hiTag.className = 'lang-tag inactive';
      }
    }
  }

  switchTab(tab) {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.selectedCategory = 'all';
    this.searchQuery = '';
    const searchInput = document.getElementById('sidebar-search-input');
    if (searchInput) searchInput.value = '';

    const tabJs = document.getElementById('tab-btn-js');
    const tabNode = document.getElementById('tab-btn-node');

    if (tab === 'js') {
      tabJs.classList.add('active');
      tabNode.classList.remove('active');
      document.getElementById('content-heading-title').textContent = 'JavaScript Senior Interview Questions';
    } else {
      tabNode.classList.add('active');
      tabJs.classList.remove('active');
      document.getElementById('content-heading-title').textContent = 'Node.js Senior Interview Questions';
    }

    this.renderCategorySidebar();
    this.renderQuestions();
  }

  // ========================================================================
  // Sidebar Search & Filtering
  // ========================================================================
  attachSidebarEvents() {
    const searchInput = document.getElementById('sidebar-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderQuestions();
      });
    }

    // Quick filter chips (All, Must-Know, Completed, Bookmarked, Weak)
    const chips = document.querySelectorAll('.quick-filter-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        chips.forEach(c => c.classList.remove('active'));
        const filter = chip.getAttribute('data-filter');
        chip.classList.add('active');
        this.activeFilter = filter;
        this.renderQuestions();
      });
    });
  }

  attachHeroEvents() {
    const btnRandom = document.getElementById('hero-btn-random');
    if (btnRandom) {
      btnRandom.addEventListener('click', () => this.scrollToRandomQuestion());
    }

    const btnMock = document.getElementById('hero-btn-mock');
    if (btnMock) {
      btnMock.addEventListener('click', () => this.practiceEngine.startMockInterview(this.activeTab));
    }

    const btnScen = document.getElementById('hero-btn-scenarios');
    if (btnScen) {
      btnScen.addEventListener('click', () => this.practiceEngine.startScenarioLab());
    }

    const btnOutput = document.getElementById('hero-btn-output');
    if (btnOutput) {
      btnOutput.addEventListener('click', () => this.practiceEngine.startOutputLab());
    }
  }

  renderCategorySidebar() {
    const listEl = document.getElementById('sidebar-category-list');
    if (!listEl) return;

    const questions = this.activeTab === 'js' ? this.jsQuestions : this.nodeQuestions;
    const categoryMap = {};
    questions.forEach(q => {
      categoryMap[q.category] = (categoryMap[q.category] || 0) + 1;
    });

    let html = `
      <div class="category-nav-item ${this.selectedCategory === 'all' ? 'active' : ''}" onclick="window.app.selectCategory('all')">
        <span>All Topics</span>
        <span class="category-count">${questions.length}</span>
      </div>
    `;

    Object.entries(categoryMap).forEach(([cat, count]) => {
      const isAct = this.selectedCategory === cat ? 'active' : '';
      html += `
        <div class="category-nav-item ${isAct}" onclick="window.app.selectCategory('${escapeQuotes(cat)}')">
          <span>${cat}</span>
          <span class="category-count">${count}</span>
        </div>
      `;
    });

    listEl.innerHTML = html;
  }

  selectCategory(cat) {
    this.selectedCategory = cat;
    this.renderCategorySidebar();
    this.renderQuestions();
  }

  // ========================================================================
  // Questions Rendering & Filtering
  // ========================================================================
  getFilteredQuestions() {
    const rawList = this.activeTab === 'js' ? this.jsQuestions : this.nodeQuestions;

    return rawList.filter(q => {
      // Category filter
      if (this.selectedCategory !== 'all' && q.category !== this.selectedCategory) {
        return false;
      }

      // Quick filter
      if (this.activeFilter === 'must-know' && q.priority !== 'Must Know') {
        return false;
      }
      if (this.activeFilter === 'completed' && !this.dashboardState.isCompleted(q.id)) {
        return false;
      }
      if (this.activeFilter === 'bookmarked' && !this.dashboardState.isBookmarked(q.id)) {
        return false;
      }
      if (this.activeFilter === 'weak' && !this.dashboardState.isWeak(q.id)) {
        return false;
      }

      // Search Query
      if (this.searchQuery) {
        const titleMatch = q.title.toLowerCase().includes(this.searchQuery);
        const shortMatch = q.shortAnswer.toLowerCase().includes(this.searchQuery);
        const catMatch = q.category.toLowerCase().includes(this.searchQuery);
        const deepMatch = q.deepExplanation.toLowerCase().includes(this.searchQuery);
        if (!titleMatch && !shortMatch && !catMatch && !deepMatch) return false;
      }

      return true;
    });
  }

  renderQuestions() {
    const container = document.getElementById('questions-list-container');
    const countTag = document.getElementById('content-count-tag');
    if (!container) return;

    const filtered = this.getFilteredQuestions();
    if (countTag) {
      countTag.textContent = `${filtered.length} Questions`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-text">No questions found matching your criteria</div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem;">
            Try clearing your search query or selecting "All Topics" in the sidebar.
          </p>
        </div>
      `;
      return;
    }

    const currentLang = this.dashboardState.getLanguage();
    container.innerHTML = filtered.map(q => renderQuestionCard(q, this.dashboardState, currentLang)).join('');
  }

  // ========================================================================
  // Card Interactivity Actions
  // ========================================================================
  toggleCardDetails(id) {
    const details = document.getElementById(`details-${id}`);
    const icon = document.getElementById(`icon-toggle-${id}`);
    if (details) {
      const isExpanded = details.classList.contains('expanded');
      if (isExpanded) {
        details.classList.remove('expanded');
        if (icon) icon.textContent = '▶';
      } else {
        details.classList.add('expanded');
        if (icon) icon.textContent = '▼';
      }
    }
  }

  toggleCompleted(id) {
    this.dashboardState.toggleCompleted(id);
    this.updateDashboardStats();
    const card = document.getElementById(`card-${id}`);
    if (card) {
      const isDone = this.dashboardState.isCompleted(id);
      card.classList.toggle('status-completed', isDone);
      const btn = card.querySelector('.btn-card-action[title*="Completed"]');
      if (btn) {
        btn.classList.toggle('active-check', isDone);
        btn.textContent = isDone ? '✓' : '○';
        btn.title = isDone ? 'Completed' : 'Mark as Completed';
      }
    }
    // If filtering by completed, refresh list
    if (this.activeFilter === 'completed') this.renderQuestions();
  }

  toggleBookmark(id) {
    this.dashboardState.toggleBookmark(id);
    this.updateDashboardStats();
    const card = document.getElementById(`card-${id}`);
    if (card) {
      const isBookmarked = this.dashboardState.isBookmarked(id);
      const btn = card.querySelector('.btn-card-action[title*="Bookmark"]');
      if (btn) btn.classList.toggle('active-bookmark', isBookmarked);
    }
    if (this.activeFilter === 'bookmarked') this.renderQuestions();
  }

  toggleWeak(id) {
    this.dashboardState.toggleWeak(id);
    this.updateDashboardStats();
    const card = document.getElementById(`card-${id}`);
    if (card) {
      const isWeak = this.dashboardState.isWeak(id);
      const btn = card.querySelector('.btn-card-action[title*="Weak"]');
      if (btn) btn.classList.toggle('active-flag', isWeak);
    }
    if (this.activeFilter === 'weak') this.renderQuestions();
  }

  runSandboxCode(id) {
    const codeEl = document.getElementById(`code-${id}`);
    const outEl = document.getElementById(`output-${id}`);
    if (!codeEl || !outEl) return;

    outEl.style.display = 'block';
    outEl.textContent = 'Executing snippet in browser sandbox...';
    
    setTimeout(() => {
      const result = CodeSandbox.run(codeEl.textContent);
      outEl.textContent = result;
    }, 50);
  }

  copyCode(id) {
    const codeEl = document.getElementById(`code-${id}`);
    if (codeEl) {
      navigator.clipboard.writeText(codeEl.textContent).then(() => {
        alert('Code snippet copied to clipboard!');
      });
    }
  }

  scrollToRandomQuestion() {
    const pool = this.activeTab === 'js' ? this.jsQuestions : this.nodeQuestions;
    const randomItem = pool[Math.floor(Math.random() * pool.length)];
    
    // Clear search and reset filter to ensure item is visible
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.activeFilter = 'all';
    const searchInput = document.getElementById('sidebar-search-input');
    if (searchInput) searchInput.value = '';
    
    document.querySelectorAll('.quick-filter-chip').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-filter') === 'all');
    });

    this.renderCategorySidebar();
    this.renderQuestions();

    setTimeout(() => {
      const targetCard = document.getElementById(`card-${randomItem.id}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.toggleCardDetails(randomItem.id);
        targetCard.style.outline = '2px solid #38bdf8';
        setTimeout(() => targetCard.style.outline = 'none', 3000);
      }
    }, 100);
  }

  // ========================================================================
  // Dashboard & Statistics Updates
  // ========================================================================
  updateDashboardStats() {
    const stats = this.dashboardState.getStats(this.jsQuestions, this.nodeQuestions);

    // Hero Stats
    const valJs = document.getElementById('stat-val-js');
    const valNode = document.getElementById('stat-val-node');
    const valOverall = document.getElementById('stat-val-overall');
    const valRevision = document.getElementById('stat-val-revision');

    const fillJs = document.getElementById('fill-js');
    const fillNode = document.getElementById('fill-node');
    const fillOverall = document.getElementById('fill-overall');

    if (valJs) valJs.textContent = `${stats.jsCompleted} / ${stats.jsCount}`;
    if (valNode) valNode.textContent = `${stats.nodeCompleted} / ${stats.nodeCount}`;
    if (valOverall) valOverall.textContent = `${stats.overallPct}%`;
    if (valRevision) valRevision.textContent = `${stats.bookmarkedCount} Saved (${stats.weakCount} Weak)`;

    if (fillJs) fillJs.style.width = `${stats.jsPct}%`;
    if (fillNode) fillNode.style.width = `${stats.nodePct}%`;
    if (fillOverall) fillOverall.style.width = `${stats.overallPct}%`;

    // Tab badges
    const badgeJs = document.getElementById('tab-badge-js');
    const badgeNode = document.getElementById('tab-badge-node');
    if (badgeJs) badgeJs.textContent = `${stats.jsCompleted}/100`;
    if (badgeNode) badgeNode.textContent = `${stats.nodeCompleted}/100`;
  }
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'");
}

// Instantiate and bind to window for inline onclick handlers
window.addEventListener('DOMContentLoaded', () => {
  window.app = new InterviewApp();
  window.app.init();
});
