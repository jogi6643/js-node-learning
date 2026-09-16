// ==========================================================================
// Practice Center & Mock Interview Engine
// 1. Mock Interview Mode (One-at-a-time flashcards + timer + self-rating)
// 2. Senior MCQ Quiz with scoring & explanations
// 3. Output Questions Revealer
// 4. Production Outage Scenarios & Post-Mortem Debugging Lab
// ==========================================================================

import { MCQS_DATA, OUTPUT_QUESTIONS, SCENARIOS_DATA } from '../data/quizzes.js';
import { CodeSandbox } from './code-sandbox.js';

export class PracticeEngine {
  constructor(app) {
    this.app = app;
    this.modal = document.getElementById('practice-modal');
    this.modalTitle = document.getElementById('practice-modal-title');
    this.modalBody = document.getElementById('practice-modal-body');
    
    // Interview mode state
    this.interviewQuestions = [];
    this.interviewIndex = 0;
    this.interviewTimerSeconds = 0;
    this.interviewTimerInterval = null;

    // Quiz state
    this.quizIndex = 0;
    this.quizScore = 0;
    this.selectedAnswer = null;
  }

  init() {
    const btnClose = document.getElementById('btn-close-modal');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.closeModal());
    }
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }
  }

  openModal(title) {
    this.modalTitle.textContent = title;
    this.modal.classList.add('active');
  }

  closeModal() {
    this.modal.classList.remove('active');
    if (this.interviewTimerInterval) {
      clearInterval(this.interviewTimerInterval);
      this.interviewTimerInterval = null;
    }
  }

  // ========================================================================
  // 1. Mock Interview Drill (One question at a time with timer)
  // ========================================================================
  startMockInterview(tab = 'all') {
    const pool = tab === 'js' ? this.app.jsQuestions :
                 tab === 'node' ? this.app.nodeQuestions :
                 [...this.app.jsQuestions, ...this.app.nodeQuestions];

    // Shuffle
    this.interviewQuestions = [...pool].sort(() => Math.random() - 0.5);
    this.interviewIndex = 0;
    this.openModal('🎙️ Senior Mock Interview Simulator');
    this.renderInterviewQuestion();
  }

  renderInterviewQuestion() {
    const q = this.interviewQuestions[this.interviewIndex];
    if (!q) {
      this.modalBody.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <h2>🎉 Mock Interview Round Completed!</h2>
          <p style="color: var(--text-secondary); margin-top: 0.5rem;">You practiced ${this.interviewIndex} senior interview topics.</p>
          <button class="btn-cta btn-cta-primary" style="margin-top: 1.5rem;" onclick="window.app.practiceEngine.closeModal()">Close</button>
        </div>
      `;
      return;
    }

    // Reset & start timer
    if (this.interviewTimerInterval) clearInterval(this.interviewTimerInterval);
    this.interviewTimerSeconds = 0;
    this.interviewTimerInterval = setInterval(() => {
      this.interviewTimerSeconds++;
      const timerEl = document.getElementById('interview-clock');
      if (timerEl) {
        const mins = String(Math.floor(this.interviewTimerSeconds / 60)).padStart(2, '0');
        const secs = String(this.interviewTimerSeconds % 60).padStart(2, '0');
        timerEl.textContent = `${mins}:${secs}`;
      }
    }, 1000);

    const isCurrentHinglish = this.app.dashboardState.getLanguage() === 'hinglish';

    this.modalBody.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
        <div>
          <span class="badge badge-priority-must-know">Question ${this.interviewIndex + 1} of ${this.interviewQuestions.length}</span>
          <span class="badge badge-topic" style="margin-left: 0.5rem;">${q.category}</span>
        </div>
        <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 0.4rem;">
          ⏱️ <span id="interview-clock">00:00</span>
        </div>
      </div>

      <div style="margin: 1.5rem 0;">
        <h2 style="font-size: 1.35rem; line-height: 1.4; color: var(--text-primary);">${q.title}</h2>
        <p style="font-size: 0.86rem; color: var(--text-muted); margin-top: 0.5rem;">
          Take 60–90 seconds to answer out loud as if speaking directly to an Engineering Director or Principal Architect.
        </p>
      </div>

      <div id="interview-answer-drawer" style="display: none; flex-direction: column; gap: 1rem; margin-top: 1.5rem; animation: fadeIn 0.2s ease;">
        
        <div class="short-answer-box">
          <div class="short-answer-label">⚡ 30-Second Interview Pitch</div>
          <div>${q.shortAnswer}</div>
        </div>

        <div class="detail-block">
          <div class="detail-block-title ${isCurrentHinglish ? 'hinglish-title' : 'deep-title'}">
            <span>${isCurrentHinglish ? '🇮🇳 Hinglish Explanation' : '🏛️ Deep Architectural Explanation'}</span>
          </div>
          <div class="detail-text">${isCurrentHinglish ? q.hinglishExplanation : q.deepExplanation}</div>
        </div>

        <div class="detail-block">
          <div class="detail-block-title mistakes-title">
            <span>⚠️ What Senior Candidates Get Wrong</span>
          </div>
          <div class="detail-text">${q.commonMistakes}</div>
        </div>

        <div class="detail-block">
          <div class="detail-block-title interview-title">
            <span>💬 How to Frame Your Answer</span>
          </div>
          <div class="detail-text">${q.interviewStrategy}</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
        <button class="btn-cta btn-cta-secondary" id="btn-reveal-interview-ans" onclick="
          document.getElementById('interview-answer-drawer').style.display = 'flex';
          this.style.display = 'none';
          document.getElementById('rating-group').style.display = 'flex';
        ">
          👁️ Reveal Ideal Answer
        </button>

        <div id="rating-group" style="display: none; gap: 0.6rem; align-items: center;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">Self-Rating:</span>
          <button class="btn-viz-control" style="background: rgba(239, 68, 68, 0.15); color: #fca5a5;" onclick="window.app.practiceEngine.nextInterview(false)">Needs Revision</button>
          <button class="btn-viz-control" style="background: rgba(34, 197, 94, 0.15); color: #86efac;" onclick="window.app.practiceEngine.nextInterview(true)">Mastered ✓</button>
        </div>

        <button class="btn-viz-control" onclick="window.app.practiceEngine.nextInterview(null)">Skip Question ⏭</button>
      </div>
    `;
  }

  nextInterview(isMastered) {
    const q = this.interviewQuestions[this.interviewIndex];
    if (isMastered === true) {
      this.app.dashboardState.state.completed[q.id] = true;
      this.app.dashboardState.save();
    } else if (isMastered === false) {
      this.app.dashboardState.state.weak[q.id] = true;
      this.app.dashboardState.save();
    }
    this.app.updateDashboardStats();
    this.interviewIndex++;
    this.renderInterviewQuestion();
  }

  // ========================================================================
  // 2. Senior MCQ Quiz Mode
  // ========================================================================
  startQuiz() {
    this.quizIndex = 0;
    this.quizScore = 0;
    this.selectedAnswer = null;
    this.openModal('📝 Senior Technical MCQ Quiz');
    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    const q = MCQS_DATA[this.quizIndex];
    if (!q) {
      this.modalBody.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem;">
          <h2 style="font-size: 1.6rem; margin-bottom: 0.5rem;">Quiz Finished! 🎯</h2>
          <div style="font-size: 2.5rem; font-weight: 800; color: #22c55e; margin: 1rem 0;">
            ${this.quizScore} / ${MCQS_DATA.length}
          </div>
          <p style="color: var(--text-secondary);">
            ${this.quizScore === MCQS_DATA.length ? 'Outstanding! Top 1% Senior Technical Mastery.' : 'Great effort! Review the explanations to solidify edge cases.'}
          </p>
          <button class="btn-cta btn-cta-primary" style="margin-top: 1.5rem;" onclick="window.app.practiceEngine.closeModal()">Close Quiz</button>
        </div>
      `;
      return;
    }

    this.modalBody.innerHTML = `
      <div class="quiz-container">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.6rem;">
          <span class="badge badge-priority-high">Question ${this.quizIndex + 1} of ${MCQS_DATA.length}</span>
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">Score: ${this.quizScore}</span>
        </div>

        <div class="quiz-question-box">${q.question}</div>

        <div class="quiz-options-list" id="quiz-options-box">
          ${q.options.map((opt, idx) => `
            <button class="quiz-option-btn" id="opt-btn-${idx}" onclick="window.app.practiceEngine.handleQuizAnswer(${idx})">
              <span><strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}</span>
              <span id="opt-check-${idx}"></span>
            </button>
          `).join('')}
        </div>

        <div class="quiz-feedback-box" id="quiz-feedback" style="display: none;">
          <div style="font-weight: 700; margin-bottom: 0.35rem;" id="feedback-verdict"></div>
          <div id="feedback-exp" style="color: var(--text-secondary);"></div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
          <button class="btn-cta btn-cta-primary" id="btn-next-quiz" style="display: none;" onclick="window.app.practiceEngine.nextQuizQuestion()">
            Next Question →
          </button>
        </div>
      </div>
    `;
  }

  handleQuizAnswer(idx) {
    const q = MCQS_DATA[this.quizIndex];
    if (this.selectedAnswer !== null) return;
    this.selectedAnswer = idx;

    const optButtons = this.modalBody.querySelectorAll('.quiz-option-btn');
    optButtons.forEach(btn => btn.style.pointerEvents = 'none');

    const isCorrect = idx === q.answerIndex;
    if (isCorrect) this.quizScore++;

    const chosenBtn = document.getElementById(`opt-btn-${idx}`);
    const correctBtn = document.getElementById(`opt-btn-${q.answerIndex}`);

    if (isCorrect) {
      chosenBtn.classList.add('selected-correct');
      document.getElementById(`opt-check-${idx}`).textContent = '✓ Correct';
    } else {
      chosenBtn.classList.add('selected-wrong');
      document.getElementById(`opt-check-${idx}`).textContent = '✗ Wrong';
      correctBtn.classList.add('selected-correct');
      document.getElementById(`opt-check-${q.answerIndex}`).textContent = '✓ Correct Answer';
    }

    const feedbackBox = document.getElementById('quiz-feedback');
    const verdict = document.getElementById('feedback-verdict');
    const exp = document.getElementById('feedback-exp');

    verdict.textContent = isCorrect ? '🎉 Correct Answer!' : '❌ Incorrect';
    verdict.style.color = isCorrect ? '#22c55e' : '#ef4444';
    exp.textContent = q.explanation;
    feedbackBox.style.display = 'block';

    document.getElementById('btn-next-quiz').style.display = 'inline-flex';
  }

  nextQuizQuestion() {
    this.selectedAnswer = null;
    this.quizIndex++;
    this.renderQuizQuestion();
  }

  // ========================================================================
  // 3. Output Questions Lab
  // ========================================================================
  startOutputLab() {
    this.openModal('💻 Senior Output-Based & Tricky Snippets');
    this.modalBody.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <p style="font-size: 0.9rem; color: var(--text-secondary);">
          These questions test execution order, V8 microtask scheduling, variable environments, and tricky scope bindings.
        </p>

        ${OUTPUT_QUESTIONS.map((item, idx) => `
          <div class="question-card" style="padding: 1.25rem;">
            <h3 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--text-primary);">
              ${idx + 1}. ${item.title}
            </h3>

            <div class="code-container" style="margin-bottom: 0.75rem;">
              <div class="code-header">
                <span>JavaScript Code</span>
                <button class="btn-code-action btn-run-code" onclick="window.app.practiceEngine.runOutputSnippet(${idx})">▶ Run in Sandbox</button>
              </div>
              <pre class="code-block" style="padding: 0.75rem;"><code id="out-code-${idx}">${item.code}</code></pre>
              <div class="inline-console-output" id="out-console-${idx}"></div>
            </div>

            <button class="btn-viz-control" id="btn-reveal-out-${idx}" onclick="
              document.getElementById('out-exp-${idx}').style.display = 'block';
              this.style.display = 'none';
            ">
              👁️ Reveal Expected Output & Explanation
            </button>

            <div id="out-exp-${idx}" style="display: none; margin-top: 0.85rem;">
              <div class="output-preview-box">
                <div class="output-label">Expected Output</div>
                <pre style="margin: 0; color: #a7f3d0; white-space: pre-wrap; font-family: var(--font-mono);">${item.expectedOutput}</pre>
              </div>
              <div class="detail-block" style="margin-top: 0.75rem;">
                <div class="detail-block-title deep-title">Mechanics & Why</div>
                <div class="detail-text">${item.explanation}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  runOutputSnippet(idx) {
    const code = OUTPUT_QUESTIONS[idx].code;
    const output = CodeSandbox.run(code);
    const box = document.getElementById(`out-console-${idx}`);
    if (box) {
      box.style.display = 'block';
      box.textContent = output;
    }
  }

  // ========================================================================
  // 4. Production Outage & Debugging Scenarios Lab
  // ========================================================================
  startScenarioLab() {
    this.openModal('🚨 Senior Production Outages & Debugging Lab');
    this.modalBody.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <p style="font-size: 0.9rem; color: var(--text-secondary);">
          Principal/MNC interviews heavily test your ability to triage real production crises (OOM crashes, CPU locks, connection pool starvation). Walk through these real-world incident post-mortems:
        </p>

        ${SCENARIOS_DATA.map((scen, idx) => `
          <div class="question-card" style="border-left: 4px solid var(--accent-pink); padding: 1.4rem;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem;">
              <h3 style="font-size: 1.15rem; color: var(--text-primary);">${idx + 1}. ${scen.title}</h3>
              <span class="badge badge-difficulty-advanced">P0 Production Incident</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              <div class="detail-block" style="border-left: 3px solid #ef4444;">
                <div class="detail-block-title" style="color: #ef4444;">🔥 Incident Symptoms & Telemetry</div>
                <div class="detail-text">${scen.symptoms}</div>
              </div>

              <div class="detail-block" style="border-left: 3px solid #38bdf8;">
                <div class="detail-block-title" style="color: #38bdf8;">🔍 Senior Investigation Methodology</div>
                <div class="detail-text">${scen.investigation}</div>
              </div>

              <div class="detail-block" style="border-left: 3px solid #fbbf24;">
                <div class="detail-block-title" style="color: #fbbf24;">🎯 Root Cause Analysis (RCA)</div>
                <div class="detail-text">${scen.rootCause}</div>
              </div>

              <div class="detail-block" style="border-left: 3px solid #22c55e;">
                <div class="detail-block-title" style="color: #22c55e;">🛡️ Permanent Architectural Fix & Prevention</div>
                <div class="detail-text">${scen.fix}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}
