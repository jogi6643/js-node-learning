# 🚀 Senior JavaScript & Node.js Interview Preparation Platform
### Specially Engineered for 8+ Years Experienced Backend & Node.js Developers (MNC Level)

This interactive platform curates exactly the **Top 100 JavaScript** and **Top 100 Node.js** high-frequency topics and questions asked in Senior, Staff, and Principal Engineer technical rounds across top product companies (Google, Amazon, Microsoft, Uber, Razorpay, Swiggy, Walmart, etc.).

---

## 🌟 Key Features

### 1. Two Dedicated Tabs (100 JS + 100 Node.js Topics)
- **Tab 1: JavaScript (100 Questions)**:
  - V8 Engine & Memory Management (Generational Scavenge, Mark-Sweep-Compact, Hidden Classes, Inline Caches)
  - Scope Chain, TDZ, Execution Context, Variable Environment
  - `this` binding rules & Prototype Delegation
  - Microtasks (`process.nextTick`, Promises) vs Macrotasks (`setTimeout`, I/O, `setImmediate`)
  - Concurrency (Web Workers, SharedArrayBuffer, Atomics)
  - Complex Polyfills (`Array.prototype.reduce`, `Promise.all` with index order preservation)
  - 25+ Output-based trick questions with browser sandboxes

- **Tab 2: Node.js (100 Questions)**:
  - Libuv Event Loop phases (Timers, Pending, Idle/Prepare, Poll, Check, Close)
  - Non-blocking I/O vs Libuv Thread Pool (`UV_THREADPOOL_SIZE`)
  - Streams (Backpressure, `stream.pipeline` vs `.pipe()` leak hazards, `allocUnsafe`)
  - Concurrency: Worker Threads vs Cluster vs Child Process IPC
  - Frameworks: Express 4 unhandled rejections vs Express 5 / Fastify schema optimizations
  - Authentication: RS256 JWTs + Redis Refresh Token Rotation with reuse detection
  - Security: ReDoS, Prototype Pollution, SSRF, Distributed Redis Rate Limiting
  - Databases: Connection pool sizing, pool starvation, deadlocks, Prisma vs raw `pg`
  - Caching: Cache-Aside, Mutex Locks (`SETNX`), TTL Jitter, Redlock
  - Message Queues: Kafka (partitions, consumer lag, rebalance storms) vs RabbitMQ
  - Microservices: Sagas (Orchestration vs Choreography), Circuit Breakers (Opossum), Outbox Pattern
  - Production DevOps: Graceful shutdown (`SIGTERM`, socket draining), Docker multi-stage, dumb-init PID 1

### 2. Standardized Deep Format (All 200 Questions)
Every question includes:
1. **30-Second Interview Pitch**: High-impact elevator pitch.
2. **Deep Architectural Explanation**: Comprehensive internal mechanics.
3. **Hinglish Explanation**: Natural Hindi + English conversational explanation with real-life analogies.
4. **Real-World Production Architecture**: Real payment, scaling, or fault-tolerant scenarios.
5. **Code Snippet & Sandbox**: Runnable directly in-browser with live console output.
6. **Expected Output**: Verified execution output.
7. **Common Mistakes**: Exact pitfalls that cause senior candidate rejection.
8. **Follow-Up Questions**: The exact drill-down questions interviewers ask next.
9. **"How to Answer in an Interview"**: The exact phrasing and strategic positioning.

### 3. Interactive Learning & Visualizers
- **Event Loop Visualizer**: Step-by-step interactive simulator showing Call Stack, Microtasks (nextTick & Promise), Timers, and Check queues with Play, Step, and Reset controls.
- **System Flow Visualizers**:
  - *Libuv Thread Pool Architecture*
  - *Redis Cache-Aside & Stampede Mutex Flow*
  - *Kafka Producer, Partitions & Consumer Group Flow*
  - *JWT Authentication & Refresh Token Rotation Flow*
  - *Microservices Circuit Breaker (Closed -> Open -> Half-Open)*

### 4. Senior Practice Center
- **Mock Interview Simulator**: One question at a time flashcard mode with speech timer and self-assessment (`Mastered` / `Needs Revision`).
- **Senior Technical MCQ Quiz**: Scenario-based MCQs with instant scoring and detailed explanations.
- **Output Questions Lab**: Tricky execution order challenges with in-browser runner.
- **Production Outages Lab**: Real post-mortem triage scenarios (OOM heap exhaustion, ReDoS CPU locks, DB connection pool starvation).

### 5. Progress Dashboard
- LocalStorage persistence tracking:
  - JavaScript: `x / 100`
  - Node.js: `x / 100`
  - Overall Readiness %
  - Must-Know MNC filter
  - Bookmarked Revision list
  - Weak Topics list

---

## 🚀 How to Run & Host

### 1. Host Free on GitHub Pages (1-Click)
1. Push this folder to a GitHub repository (`main` branch).
2. Go to **Settings > Pages > Source** -> Select `Deploy from a branch` (`main` branch, `/ root`).
3. Your site is live instantly at `https://<username>.github.io/<repo-name>/`!

### 2. Run Locally
- **Option A (Direct Double-Click):** Simply open `index.html` in Chrome, Safari, or Brave.
- **Option B (Python Local Server):**
```bash
python3 -m http.server 3000
```
Then open `http://localhost:3000`.
