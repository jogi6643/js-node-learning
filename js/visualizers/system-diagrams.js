// ==========================================================================
// Interactive System Architecture Diagrams Engine
// Libuv Thread Pool, Redis Caching, Kafka, JWT Rotation, Circuit Breaker
// ==========================================================================

import { DIAGRAMS_DATA } from '../data/diagrams-data.js';

export class SystemDiagramsEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentDiagramKey = 'libuv-arch';
    this.currentStepIdx = 0;
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    const diag = DIAGRAMS_DATA[this.currentDiagramKey];
    const currentStep = diag.steps[this.currentStepIdx] || diag.steps[0];

    this.container.innerHTML = `
      <div class="visualizer-section">
        <div class="visualizer-header">
          <div class="visualizer-title">
            <span>🏗️ ${diag.title}</span>
          </div>
          <div class="visualizer-selector-tabs">
            <button class="viz-tab-btn ${this.currentDiagramKey === 'libuv-arch' ? 'active' : ''}" data-key="libuv-arch">Libuv Thread Pool</button>
            <button class="viz-tab-btn ${this.currentDiagramKey === 'redis-cache' ? 'active' : ''}" data-key="redis-cache">Redis Cache-Aside</button>
            <button class="viz-tab-btn ${this.currentDiagramKey === 'kafka-flow' ? 'active' : ''}" data-key="kafka-flow">Kafka Partitions</button>
            <button class="viz-tab-btn ${this.currentDiagramKey === 'jwt-flow' ? 'active' : ''}" data-key="jwt-flow">JWT Rotation</button>
            <button class="viz-tab-btn ${this.currentDiagramKey === 'circuit-breaker' ? 'active' : ''}" data-key="circuit-breaker">Circuit Breaker</button>
          </div>
        </div>

        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
          ${diag.description}
        </p>

        <!-- Diagram Canvas -->
        <div class="system-diagram-container">
          <div class="diagram-stage-grid">
            ${diag.nodes.map((node, index) => {
              const isActive = currentStep.activeNodes.includes(node.id);
              return `
                <div class="flow-node ${isActive ? 'active-stage' : ''}" id="${node.id}">
                  <div class="flow-node-icon">${node.icon}</div>
                  <div class="flow-node-title">${node.title}</div>
                  <div class="flow-node-desc">${node.desc}</div>
                </div>
                ${index < diag.nodes.length - 1 ? `
                  <div class="flow-connector">
                    <div class="flow-packet"></div>
                    <span class="flow-label">Step ${this.currentStepIdx + 1}</span>
                  </div>
                ` : ''}
              `;
            }).join('')}
          </div>
        </div>

        <!-- Step Controls & Explanation -->
        <div class="diagram-explanation-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div class="diagram-step-title">
              Step ${this.currentStepIdx + 1} of ${diag.steps.length}: ${currentStep.title}
            </div>
            <div style="display: flex; gap: 0.4rem;">
              <button class="btn-viz-control" id="diag-btn-prev" ${this.currentStepIdx === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>← Previous</button>
              <button class="btn-viz-control btn-viz-primary" id="diag-btn-next" ${this.currentStepIdx === diag.steps.length - 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>Next Step →</button>
            </div>
          </div>
          <div>${currentStep.desc}</div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelectorAll('.viz-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentDiagramKey = e.target.getAttribute('data-key');
        this.currentStepIdx = 0;
        this.render();
      });
    });

    const btnPrev = this.container.querySelector('#diag-btn-prev');
    const btnNext = this.container.querySelector('#diag-btn-next');

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.currentStepIdx > 0) {
          this.currentStepIdx--;
          this.render();
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        const diag = DIAGRAMS_DATA[this.currentDiagramKey];
        if (this.currentStepIdx < diag.steps.length - 1) {
          this.currentStepIdx++;
          this.render();
        }
      });
    }
  }
}
