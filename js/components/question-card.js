// ==========================================================================
// Question Card Component
// Full rendering with English + Hinglish, Code Runner, Mistakes, Followups
// ==========================================================================

import { CodeSandbox } from './code-sandbox.js';

export function renderQuestionCard(q, state, currentLang) {
  const isDone = state.isCompleted(q.id);
  const isBookmarked = state.isBookmarked(q.id);
  const isWeak = state.isWeak(q.id);

  const priorityBadgeClass = q.priority === 'Must Know' 
    ? 'badge-priority-must-know' 
    : 'badge-priority-high';

  const diffBadgeClass = q.difficulty === 'Advanced'
    ? 'badge-difficulty-advanced'
    : 'badge-difficulty-intermediate';

  return `
    <div class="question-card ${isDone ? 'status-completed' : ''} ${q.priority === 'Must Know' ? 'priority-must-know' : ''}" id="card-${q.id}" data-id="${q.id}">
      <div class="card-top-row">
        <div class="card-title-group">
          <span class="q-number">#${q.num}</span>
          <h3 class="q-title" onclick="window.app.toggleCardDetails('${q.id}')">${q.title}</h3>
        </div>
        <div class="card-actions">
          <button class="btn-card-action ${isDone ? 'active-check' : ''}" title="${isDone ? 'Completed' : 'Mark as Completed'}" onclick="window.app.toggleCompleted('${q.id}')">
            ${isDone ? '✓' : '○'}
          </button>
          <button class="btn-card-action ${isBookmarked ? 'active-bookmark' : ''}" title="Bookmark for Revision" onclick="window.app.toggleBookmark('${q.id}')">
            ★
          </button>
          <button class="btn-card-action ${isWeak ? 'active-flag' : ''}" title="Flag as Weak Topic" onclick="window.app.toggleWeak('${q.id}')">
            🚩
          </button>
        </div>
      </div>

      <div class="card-badges">
        <span class="badge ${priorityBadgeClass}">★ ${q.priority}</span>
        <span class="badge ${diffBadgeClass}">${q.difficulty}</span>
        <span class="badge badge-topic">${q.category}</span>
      </div>

      <!-- Short 30s Interview Pitch -->
      <div class="short-answer-box">
        <div class="short-answer-label">
          <span>⚡ 30-Second Interview Pitch</span>
        </div>
        <div>${q.shortAnswer}</div>
      </div>

      <!-- Collapsible Deep Dive Button -->
      <div class="deep-dive-container">
        <button class="deep-dive-toggle-btn" id="btn-toggle-${q.id}" onclick="window.app.toggleCardDetails('${q.id}')">
          <span id="icon-toggle-${q.id}">▶</span> Deep Architectural Breakdown, Hinglish, Code & Interview Strategy
        </button>

        <div class="deep-dive-content" id="details-${q.id}">
          
          <!-- English Deep Explanation -->
          <div class="detail-block" style="${currentLang === 'hinglish' ? 'display: none;' : ''}">
            <div class="detail-block-title deep-title">
              <span>🏛️ Deep Architectural Explanation</span>
            </div>
            <div class="detail-text">${q.deepExplanation}</div>
          </div>

          <!-- Hinglish Explanation -->
          <div class="detail-block" style="${currentLang === 'en' ? 'display: none;' : ''}">
            <div class="detail-block-title hinglish-title">
              <span>🇮🇳 Hinglish Explanation (Analogy & Real Life Concept)</span>
            </div>
            <div class="detail-text">${q.hinglishExplanation}</div>
          </div>

          <!-- Real World Production Example -->
          <div class="detail-block">
            <div class="detail-block-title production-title">
              <span>🚀 Real-World Production Architecture</span>
            </div>
            <div class="detail-text">${q.productionExample}</div>
          </div>

          <!-- Code Snippet & Live Sandbox -->
          ${q.code ? `
            <div class="code-container">
              <div class="code-header">
                <span>Code Example (${q.category})</span>
                <div class="code-header-actions">
                  <button class="btn-code-action" onclick="window.app.copyCode('${q.id}')">Copy</button>
                  <button class="btn-code-action btn-run-code" onclick="window.app.runSandboxCode('${q.id}')">▶ Run Sandbox</button>
                </div>
              </div>
              <pre class="code-block"><code id="code-${q.id}">${escapeHtml(q.code)}</code></pre>
              <div class="inline-console-output" id="output-${q.id}"></div>
            </div>
          ` : ''}

          <!-- Expected Output -->
          ${q.output ? `
            <div class="output-preview-box">
              <div class="output-label">Expected Output</div>
              <pre style="margin: 0; font-family: var(--font-mono); font-size: 0.82rem; color: #a7f3d0; white-space: pre-wrap;">${escapeHtml(q.output)}</pre>
            </div>
          ` : ''}

          <!-- Common Mistakes (What fails candidates) -->
          <div class="detail-block">
            <div class="detail-block-title mistakes-title">
              <span>⚠️ Common Mistakes (Why Senior Candidates Get Rejected)</span>
            </div>
            <div class="detail-text">${q.commonMistakes}</div>
          </div>

          <!-- Follow-up Questions -->
          <div class="detail-block">
            <div class="detail-block-title followup-title">
              <span>🎯 Common Follow-Up Questions Asked by Interviewers</span>
            </div>
            <div class="detail-text"><strong>${q.followUpQuestions}</strong></div>
          </div>

          <!-- How to Answer in an Interview -->
          <div class="detail-block">
            <div class="detail-block-title interview-title">
              <span>💬 "How to Answer in an Interview" (Strategy & Pitch)</span>
            </div>
            <div class="detail-text">${q.interviewStrategy}</div>
          </div>

        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
