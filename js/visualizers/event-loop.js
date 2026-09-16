// ==========================================================================
// Interactive Event Loop Engine & Stepper
// Simulates Call Stack, Microtask Queue (nextTick & Promise), Macrotask Queue,
// Check Queue (setImmediate), and Event Loop Tick Indicator
// ==========================================================================

export const EVENT_LOOP_PRESETS = {
  classic: {
    name: 'Classic Interview Puzzle',
    code: `console.log('1: Sync');
setTimeout(() => console.log('2: Timeout'), 0);
Promise.resolve().then(() => console.log('3: Promise'));
process.nextTick(() => console.log('4: nextTick'));
setImmediate(() => console.log('5: Immediate'));
console.log('6: Sync End');`,
    steps: [
      {
        action: 'Push to Call Stack: console.log("1: Sync")',
        stack: ['console.log("1: Sync")'],
        microtasks: [],
        nextTick: [],
        timers: [],
        check: [],
        output: '1: Sync',
        phase: 'Call Stack (Synchronous)'
      },
      {
        action: 'Schedule setTimeout(..., 0) -> Timers Queue',
        stack: ['setTimeout(...)'],
        microtasks: [],
        nextTick: [],
        timers: ['Timeout Callback'],
        check: [],
        output: null,
        phase: 'Call Stack'
      },
      {
        action: 'Schedule Promise.resolve().then(...) -> Microtask Queue',
        stack: ['Promise.then(...)'],
        microtasks: ['Promise Callback'],
        nextTick: [],
        timers: ['Timeout Callback'],
        check: [],
        output: null,
        phase: 'Call Stack'
      },
      {
        action: 'Schedule process.nextTick(...) -> nextTick VIP Queue',
        stack: ['process.nextTick(...)'],
        microtasks: ['Promise Callback'],
        nextTick: ['nextTick Callback'],
        timers: ['Timeout Callback'],
        check: [],
        output: null,
        phase: 'Call Stack'
      },
      {
        action: 'Schedule setImmediate(...) -> Check Queue',
        stack: ['setImmediate(...)'],
        microtasks: ['Promise Callback'],
        nextTick: ['nextTick Callback'],
        timers: ['Timeout Callback'],
        check: ['Immediate Callback'],
        output: null,
        phase: 'Call Stack'
      },
      {
        action: 'Push to Call Stack: console.log("6: Sync End")',
        stack: ['console.log("6: Sync End")'],
        microtasks: ['Promise Callback'],
        nextTick: ['nextTick Callback'],
        timers: ['Timeout Callback'],
        check: ['Immediate Callback'],
        output: '6: Sync End',
        phase: 'Call Stack (Synchronous)'
      },
      {
        action: 'Call Stack Empty! Draining nextTick queue (highest priority)',
        stack: ['nextTick Callback'],
        microtasks: ['Promise Callback'],
        nextTick: [],
        timers: ['Timeout Callback'],
        check: ['Immediate Callback'],
        output: '4: nextTick',
        phase: 'Microtask Phase (nextTick)'
      },
      {
        action: 'Draining Promise Microtask queue',
        stack: ['Promise Callback'],
        microtasks: [],
        nextTick: [],
        timers: ['Timeout Callback'],
        check: ['Immediate Callback'],
        output: '3: Promise',
        phase: 'Microtask Phase (Promises)'
      },
      {
        action: 'All microtasks drained. Event Loop enters Timers Phase',
        stack: ['Timeout Callback'],
        microtasks: [],
        nextTick: [],
        timers: [],
        check: ['Immediate Callback'],
        output: '2: Timeout',
        phase: 'Timers Phase'
      },
      {
        action: 'Event Loop enters Check Phase (setImmediate)',
        stack: ['Immediate Callback'],
        microtasks: [],
        nextTick: [],
        timers: [],
        check: [],
        output: '5: Immediate',
        phase: 'Check Phase (setImmediate)'
      },
      {
        action: 'Execution Complete. Event Loop idle, waiting for I/O.',
        stack: [],
        microtasks: [],
        nextTick: [],
        timers: [],
        check: [],
        output: null,
        phase: 'Event Loop Idle'
      }
    ]
  },

  starvation: {
    name: 'Recursive Microtask Starvation',
    code: `function loop() {
  process.nextTick(loop); // Infinite nextTick recursion
}
loop();
setTimeout(() => console.log('Timeout'), 0); // NEVER RUNS!`,
    steps: [
      {
        action: 'Invoke loop() and queue process.nextTick(loop)',
        stack: ['loop()'],
        microtasks: [],
        nextTick: ['loop()'],
        timers: ['Timeout Callback'],
        check: [],
        output: null,
        phase: 'Synchronous Execution'
      },
      {
        action: 'Call stack empties. NextTick queue drains by invoking loop()...',
        stack: ['loop()'],
        microtasks: [],
        nextTick: ['loop()'],
        timers: ['Timeout Callback'],
        check: [],
        output: 'WARNING: Event Loop Starved!',
        phase: 'Microtask Queue (Starved)'
      },
      {
        action: 'Event loop remains trapped in microtask drain. Timers queue never runs!',
        stack: ['loop()'],
        microtasks: [],
        nextTick: ['loop()'],
        timers: ['Timeout Callback (Blocked)'],
        check: [],
        output: 'CRITICAL: I/O and HTTP Sockets Starved',
        phase: 'Starvation State'
      }
    ]
  }
};

export class EventLoopVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentPresetKey = 'classic';
    this.currentStepIndex = 0;
    this.timer = null;
    this.outputs = [];
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    const preset = EVENT_LOOP_PRESETS[this.currentPresetKey];
    this.container.innerHTML = `
      <div class="visualizer-section">
        <div class="visualizer-header">
          <div class="visualizer-title">
            <span>⚡ Interactive Event Loop Visualizer</span>
          </div>
          <div class="visualizer-selector-tabs">
            <button class="viz-tab-btn ${this.currentPresetKey === 'classic' ? 'active' : ''}" data-preset="classic">Classic Priority</button>
            <button class="viz-tab-btn ${this.currentPresetKey === 'starvation' ? 'active' : ''}" data-preset="starvation">Starvation Trap</button>
          </div>
        </div>

        <div class="event-loop-board">
          <!-- Left: Code & Controls -->
          <div class="loop-code-panel">
            <div class="code-container" style="margin: 0;">
              <div class="code-header">
                <span>Code Simulation</span>
              </div>
              <pre class="code-block" style="font-size: 0.78rem; padding: 0.75rem;"><code>${preset.code}</code></pre>
            </div>

            <div class="loop-controls">
              <button class="btn-viz-control btn-viz-primary" id="viz-btn-play">▶ Play</button>
              <button class="btn-viz-control" id="viz-btn-step">⏭ Step Forward</button>
              <button class="btn-viz-control" id="viz-btn-reset">↺ Reset</button>
            </div>

            <div class="output-preview-box" style="margin-top: 0.5rem; min-height: 85px;">
              <div class="output-label">Console Output Stream</div>
              <div id="viz-console-out" style="white-space: pre-wrap; font-size: 0.8rem; color: #38bdf8;"></div>
            </div>
          </div>

          <!-- Right: Queues Grid -->
          <div>
            <div class="loop-queues-panel">
              <div class="queue-column">
                <div class="queue-header callstack">
                  <span>Call Stack</span>
                  <span id="q-count-stack">0</span>
                </div>
                <div class="queue-items-box" id="box-stack"></div>
              </div>

              <div class="queue-column">
                <div class="queue-header microtasks">
                  <span>Microtasks (nextTick / Promise)</span>
                  <span id="q-count-micro">0</span>
                </div>
                <div class="queue-items-box" id="box-micro"></div>
              </div>

              <div class="queue-column">
                <div class="queue-header timers">
                  <span>Timers (setTimeout)</span>
                  <span id="q-count-timers">0</span>
                </div>
                <div class="queue-items-box" id="box-timers"></div>
              </div>

              <div class="queue-column">
                <div class="queue-header check">
                  <span>Check (setImmediate)</span>
                  <span id="q-count-check">0</span>
                </div>
                <div class="queue-items-box" id="box-check"></div>
              </div>
            </div>

            <div class="event-loop-ticker">
              <div>Current Phase: <strong id="viz-phase-label" style="color: #38bdf8;">Call Stack</strong></div>
              <div class="ticker-step-desc" id="viz-step-desc">Ready. Click Play or Step Forward.</div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.updateState();
  }

  attachEvents() {
    this.container.querySelectorAll('.viz-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.stopAutoPlay();
        this.currentPresetKey = e.target.getAttribute('data-preset');
        this.currentStepIndex = 0;
        this.outputs = [];
        this.render();
        this.attachEvents();
      });
    });

    const btnPlay = this.container.querySelector('#viz-btn-play');
    const btnStep = this.container.querySelector('#viz-btn-step');
    const btnReset = this.container.querySelector('#viz-btn-reset');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        if (this.timer) {
          this.stopAutoPlay();
        } else {
          btnPlay.textContent = '⏸ Pause';
          this.timer = setInterval(() => {
            const preset = EVENT_LOOP_PRESETS[this.currentPresetKey];
            if (this.currentStepIndex < preset.steps.length - 1) {
              this.stepForward();
            } else {
              this.stopAutoPlay();
            }
          }, 1100);
        }
      });
    }

    if (btnStep) {
      btnStep.addEventListener('click', () => {
        this.stopAutoPlay();
        this.stepForward();
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.stopAutoPlay();
        this.currentStepIndex = 0;
        this.outputs = [];
        this.updateState();
      });
    }
  }

  stopAutoPlay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      const btnPlay = this.container.querySelector('#viz-btn-play');
      if (btnPlay) btnPlay.textContent = '▶ Play';
    }
  }

  stepForward() {
    const preset = EVENT_LOOP_PRESETS[this.currentPresetKey];
    if (this.currentStepIndex < preset.steps.length - 1) {
      this.currentStepIndex++;
      this.updateState();
    }
  }

  updateState() {
    const preset = EVENT_LOOP_PRESETS[this.currentPresetKey];
    const step = preset.steps[this.currentStepIndex] || preset.steps[0];

    // Update Console Output
    if (step.output && !this.outputs.includes(step.output + ' (step ' + this.currentStepIndex + ')')) {
      this.outputs.push(step.output);
    }
    const outBox = this.container.querySelector('#viz-console-out');
    if (outBox) outBox.textContent = this.outputs.join('\n');

    // Update Phase and Description
    const phaseLabel = this.container.querySelector('#viz-phase-label');
    const descLabel = this.container.querySelector('#viz-step-desc');
    if (phaseLabel) phaseLabel.textContent = step.phase;
    if (descLabel) descLabel.textContent = step.action;

    // Render Box items helper
    const renderBox = (boxId, countId, items, isExecuting = false) => {
      const box = this.container.querySelector(boxId);
      const counter = this.container.querySelector(countId);
      if (!box || !counter) return;
      counter.textContent = items.length;
      box.innerHTML = items.map(item => `
        <div class="queue-item ${isExecuting ? 'active-executing' : ''}">
          <span>${item}</span>
        </div>
      `).join('');
    };

    renderBox('#box-stack', '#q-count-stack', step.stack, true);
    const combinedMicro = [...step.nextTick.map(x => `[nextTick] ${x}`), ...step.microtasks.map(x => `[Promise] ${x}`)];
    renderBox('#box-micro', '#q-count-micro', combinedMicro);
    renderBox('#box-timers', '#q-count-timers', step.timers);
    renderBox('#box-check', '#q-count-check', step.check);
  }
}
