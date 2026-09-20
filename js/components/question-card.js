// ==========================================================================
// Question Card Component
// Full rendering with Easy Explanations, Analogies, Code Runner & Deep Dive
// ==========================================================================

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderQuestionCard(q, state, currentLang) {
  const isDone = state.isCompleted(q.id);
  const isBookmarked = state.isBookmarked(q.id);
  const isWeak = state.isWeak(q.id);
  const mode = state.getMode ? state.getMode() : 'easy';

  const priorityBadgeClass = q.priority === 'Must Know' 
    ? 'badge-priority-must-know' 
    : 'badge-priority-high';

  const diffBadgeClass = q.difficulty === 'Advanced'
    ? 'badge-difficulty-advanced'
    : 'badge-difficulty-intermediate';

  const easyDef = q.easyDefinition;
  const whatText = easyDef ? (currentLang === 'hinglish' ? (easyDef.whatIsItHi || easyDef.whatIsIt) : easyDef.whatIsIt) : q.shortAnswer;

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

      ${easyDef ? `
        <!-- 💡 Easy Explanation Box (Asaan Bhasha & Analogy) -->
        <div class="easy-explanation-box">
          <div class="easy-header-badge">
            <span>💡 Asaan Bhasha Mein Samjhein</span>
          </div>
          
          <div class="easy-what-text">
            ${whatText}
          </div>

          ${easyDef.analogy ? `
            <div class="easy-analogy-card">
              <div class="easy-analogy-label">
                <span>🍕 Real-Life Example / Kahani</span>
              </div>
              <div class="easy-analogy-text">${easyDef.analogy}</div>
            </div>
          ` : ''}

          ${easyDef.keyPoints && easyDef.keyPoints.length ? `
            <div class="easy-points-card">
              <div class="easy-points-label">
                <span>🔑 3 Yaad Rakhne Wali Baatein (Key Points)</span>
              </div>
              <ul class="easy-points-list">
                ${easyDef.keyPoints.map(pt => `<li>${pt}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${easyDef.interviewLine ? `
            <div class="easy-interview-card">
              <div class="easy-interview-label">
                <span>🗣️ Interview Answer (Speak Confidently)</span>
              </div>
              <div class="easy-interview-quote">"${easyDef.interviewLine}"</div>
            </div>
          ` : ''}
        </div>
      ` : `
        <div class="short-answer-box">
          <div class="short-answer-label"><span>⚡ 30-Second Interview Pitch</span></div>
          <div>${q.shortAnswer}</div>
        </div>
      `}

      ${q.code ? `
        <div class="code-container" style="margin-top: 0.85rem; margin-bottom: 0.85rem;">
          <div class="code-header">
            <span>💻 Chhota Code Example (${q.category})</span>
            <div class="code-header-actions">
              <button class="btn-code-action" onclick="window.app.copyCode('${q.id}')">Copy</button>
              <button class="btn-code-action btn-run-code" onclick="window.app.runSandboxCode('${q.id}')">▶ Run Sandbox</button>
            </div>
          </div>
          <pre class="code-block"><code id="code-${q.id}">${escapeHtml(q.code)}</code></pre>
          <div class="inline-console-output" id="output-${q.id}"></div>
        </div>
      ` : ''}

      <div class="deep-dive-container">
        <button class="deep-dive-toggle-btn" id="btn-toggle-${q.id}" onclick="window.app.toggleCardDetails('${q.id}')">
          <span id="icon-toggle-${q.id}">▶</span> 🔬 Want Senior MNC Deep Dive? (Architecture, Mistakes & Pro Pitch)
        </button>

        <div class="deep-dive-content" id="details-${q.id}">
          <div class="detail-block" style="${currentLang === 'hinglish' ? 'display: none;' : ''}">
            <div class="detail-block-title deep-title"><span>🏛️ Deep Architectural Explanation</span></div>
            <div class="detail-text">${q.deepExplanation}</div>
          </div>

          <div class="detail-block" style="${currentLang === 'en' ? 'display: none;' : ''}">
            <div class="detail-block-title hinglish-title"><span>🇮🇳 Hinglish Deep Mechanics</span></div>
            <div class="detail-text">${q.hinglishExplanation}</div>
          </div>

          <div class="detail-block">
            <div class="detail-block-title production-title"><span>🚀 Real-World Production Architecture</span></div>
            <div class="detail-text">${q.productionExample}</div>
          </div>

          ${q.output ? `
            <div class="output-preview-box">
              <div class="output-label">Expected Output</div>
              <pre style="margin: 0; font-family: var(--font-mono); font-size: 0.82rem; color: #a7f3d0; white-space: pre-wrap;">${escapeHtml(q.output)}</pre>
            </div>
          ` : ''}

          <div class="detail-block">
            <div class="detail-block-title mistakes-title"><span>⚠️ Common Mistakes (Why Candidates Get Rejected)</span></div>
            <div class="detail-text">${q.commonMistakes}</div>
          </div>

          <div class="detail-block">
            <div class="detail-block-title followup-title"><span>🎯 Common Follow-Up Questions Asked by Interviewers</span></div>
            <div class="detail-text"><strong>${q.followUpQuestions}</strong></div>
          </div>

          <div class="detail-block">
            <div class="detail-block-title interview-title"><span>💬 How to Answer in an Interview (MNC Strategy)</span></div>
            <div class="detail-text">${q.interviewStrategy}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
