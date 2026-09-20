// ==========================================================================
// Standalone Bundled Script for Senior JS + Node.js Interview Prep
// Zero-dependency, 100% Portable (Runs on file:// and http:// protocols)
// ==========================================================================

(function() {
  'use strict';

  // 1. DIAGRAMS_DATA
  const DIAGRAMS_DATA = {
    'libuv-arch': {
      title: 'Node.js & Libuv Thread Pool Architecture',
      description: 'Understanding how single-threaded V8 coordinates with OS async syscalls (epoll/kqueue) and the internal C++ libuv thread pool (UV_THREADPOOL_SIZE).',
      steps: [
        { id: 'step-1', title: 'Application Call (V8 Engine)', desc: 'Node.js code calls an async function like fs.readFile() or crypto.pbkdf2(). V8 converts the JS function call into Node.js C++ bindings.', activeNodes: ['node-v8', 'node-bindings'] },
        { id: 'step-2', title: 'Libuv Routing Decision', desc: 'Libuv checks operation type. Network sockets (net, http) delegate directly to OS non-blocking kernel mechanisms (epoll/kqueue). File I/O, DNS lookup, and crypto tasks route to Libuv Thread Pool.', activeNodes: ['node-bindings', 'node-libuv'] },
        { id: 'step-3', title: 'Thread Pool Execution (Default: 4 Threads)', desc: 'A worker thread executes the blocking file read or crypto hash. The main event loop remains 100% free to process concurrent HTTP requests.', activeNodes: ['node-libuv', 'node-threadpool'] },
        { id: 'step-4', title: 'Callback Queuing to Event Loop', desc: 'When the thread completes, it notifies Libuv. Libuv places the completion callback onto the Event Loop Poll phase queue.', activeNodes: ['node-threadpool', 'node-eventloop'] },
        { id: 'step-5', title: 'V8 Execution on Main Stack', desc: 'The main thread dequeues the callback and executes the JS user code on the Call Stack.', activeNodes: ['node-eventloop', 'node-v8'] }
      ],
      nodes: [
        { id: 'node-v8', title: 'V8 Engine', desc: 'Single-Threaded JS Stack', icon: '⚡' },
        { id: 'node-bindings', title: 'C++ Bindings', desc: 'V8 to Native Bridge', icon: '🔗' },
        { id: 'node-libuv', title: 'Libuv Core', desc: 'Cross-platform I/O engine', icon: '⚙️' },
        { id: 'node-threadpool', title: 'Thread Pool (4)', desc: 'fs, crypto, dns lookups', icon: '🧵' },
        { id: 'node-eventloop', title: 'Event Loop', desc: 'Phase queues & ticker', icon: '🔄' }
      ]
    },
    'redis-cache': {
      title: 'Redis Cache-Aside & Stampede Mutex Flow',
      description: 'Production Cache-Aside pattern with Distributed Mutex (Redlock/SETNX) to prevent database thundering herd during cache expiry.',
      steps: [
        { id: 'step-1', title: 'Client Request Arrival', desc: 'Incoming HTTP request for GET /api/v1/products/4521 hits Node.js service.', activeNodes: ['node-client', 'node-api'] },
        { id: 'step-2', title: 'Cache Lookup (Redis GET)', desc: 'Node.js queries Redis with key `product:4521`. If Cache HIT, data returns in <1ms directly to client. If Cache MISS, proceeding to Step 3.', activeNodes: ['node-api', 'node-redis'] },
        { id: 'step-3', title: 'Acquire Mutex Lock (SET key val NX EX 5)', desc: 'To prevent 10,000 concurrent requests from hitting PostgreSQL simultaneously, the first request acquires an atomic lock in Redis with a 5s TTL.', activeNodes: ['node-redis', 'node-api'] },
        { id: 'step-4', title: 'Database Query (PostgreSQL / Replica)', desc: 'The single lock owner fetches the product from the database index. All concurrent requests wait/sleep 50ms and retry Redis lookup.', activeNodes: ['node-api', 'node-db'] },
        { id: 'step-5', title: 'Populate Cache & Release Lock', desc: 'Data is written to Redis with a randomized TTL (e.g. 3600s + Math.random()*300s to avoid sync expiration). Mutex lock is deleted. Response sent to client.', activeNodes: ['node-api', 'node-redis', 'node-client'] }
      ],
      nodes: [
        { id: 'node-client', title: 'Client App', desc: 'Mobile / Web Frontend', icon: '📱' },
        { id: 'node-api', title: 'Node.js API', desc: 'Express / Fastify Cluster', icon: '🚀' },
        { id: 'node-redis', title: 'Redis Cluster', desc: 'Sub-millisecond in-memory cache', icon: '🔴' },
        { id: 'node-db', title: 'PostgreSQL DB', desc: 'Primary DB with Connection Pool', icon: '🐘' }
      ]
    },
    'kafka-flow': {
      title: 'Kafka Producer & Consumer Partition / Lag Flow',
      description: 'High-throughput event streaming with partitioned topics, consumer groups, rebalance management, and manual offset commits.',
      steps: [
        { id: 'step-1', title: 'Event Publishing (Producer)', desc: 'Order Service creates an `order_placed` event. It specifies the partition key `customerId` so orders for the same user land in the exact same partition in order.', activeNodes: ['node-producer', 'node-topic'] },
        { id: 'step-2', title: 'Partition Assignment & Append', desc: 'Kafka Broker computes `hash(customerId) % numPartitions` and writes the message to Partition #2 commit log on disk with zero-copy page cache.', activeNodes: ['node-topic', 'node-partition'] },
        { id: 'step-3', title: 'Consumer Group Pull', desc: 'Payment Service Consumer (part of Consumer Group `payment-workers`) polls Partition #2. Heartbeat thread keeps consumer alive to prevent rebalance storm.', activeNodes: ['node-partition', 'node-consumer'] },
        { id: 'step-4', title: 'Business Logic & Manual Offset Commit', desc: 'Payment is charged via Stripe API. After successful DB write, Node.js explicitly commits the offset (`consumer.commitOffsets()`) to ensure at-least-once processing.', activeNodes: ['node-consumer', 'node-db'] }
      ],
      nodes: [
        { id: 'node-producer', title: 'Order Service', desc: 'Node.js Producer (KafkaJS)', icon: '📦' },
        { id: 'node-topic', title: 'Topic: orders', desc: 'Replication Factor: 3', icon: '📨' },
        { id: 'node-partition', title: 'Partition #2', desc: 'Ordered immutable append log', icon: '📑' },
        { id: 'node-consumer', title: 'Consumer Instance', desc: 'Group: payment-workers', icon: '💳' },
        { id: 'node-db', title: 'Order DB', desc: 'Idempotent transaction state', icon: '💾' }
      ]
    },
    'jwt-flow': {
      title: 'JWT Authentication & Refresh Token Rotation Flow',
      description: 'Enterprise security architecture with Short-lived Access Tokens (15 min in memory) + Single-use Refresh Tokens in HttpOnly Cookie with reuse detection.',
      steps: [
        { id: 'step-1', title: 'Login & Token Issuance', desc: 'User logs in with credentials. Node.js issues a short-lived Access Token (RS256 signed, 15m) in response JSON and a cryptographically random Refresh Token (7 days) stored in Redis with user family ID.', activeNodes: ['node-user', 'node-auth'] },
        { id: 'step-2', title: 'Resource Access with Access Token', desc: 'Client sends Access Token in `Authorization: Bearer <token>`. Resource server verifies RS256 signature using public key without DB lookup. Fast & stateless.', activeNodes: ['node-user', 'node-api'] },
        { id: 'step-3', title: 'Access Token Expiry (401 Unauthorized)', desc: 'After 15 minutes, access token expires. Resource API rejects with 401 TOKEN_EXPIRED.', activeNodes: ['node-api', 'node-user'] },
        { id: 'step-4', title: 'Refresh Token Rotation with Reuse Detection', desc: 'Client automatically posts Refresh Token to `/auth/refresh`. Auth server checks Redis. If token was ALREADY used before, an attacker stole it: invalidate ALL tokens for that user immediately! Otherwise, issue new Access Token and new rotated Refresh Token.', activeNodes: ['node-user', 'node-auth', 'node-session-store'] }
      ],
      nodes: [
        { id: 'node-user', title: 'Client App', desc: 'Secure in-memory token holder', icon: '💻' },
        { id: 'node-auth', title: 'Auth Server', desc: 'Issues & rotates token pairs', icon: '🛡️' },
        { id: 'node-api', title: 'Resource Microservice', desc: 'Validates JWT via Public Key', icon: '⚡' },
        { id: 'node-session-store', title: 'Redis Token Family', desc: 'Token revocation & reuse tracker', icon: '🔑' }
      ]
    },
    'circuit-breaker': {
      title: 'Microservices Circuit Breaker (Opossum Pattern)',
      description: 'Protecting cascading system failure during 3rd-party outage using Closed, Open, and Half-Open state machine.',
      steps: [
        { id: 'step-1', title: 'CLOSED State (Normal Operation)', desc: 'All requests to Payment Gateway pass through normally. Circuit breaker tracks success/failure metrics over a sliding window (e.g. 50 requests).', activeNodes: ['node-breaker-closed', 'node-gateway'] },
        { id: 'step-2', title: 'Threshold Breached (e.g., 50% Failures)', desc: 'Downstream gateway starts timing out or returning 503s. The failure threshold is exceeded. Circuit breaker automatically trips to OPEN.', activeNodes: ['node-breaker-closed', 'node-breaker-open'] },
        { id: 'step-3', title: 'OPEN State (Fail-Fast Protection)', desc: '100% of subsequent requests are immediately rejected or routed to a fallback function without touching the failing gateway. Prevents thread/socket pool exhaustion in Node.js.', activeNodes: ['node-breaker-open', 'node-fallback'] },
        { id: 'step-4', title: 'HALF-OPEN State (Trial Probing)', desc: 'After a cooldown resetTimeout (e.g., 30s), breaker transitions to HALF-OPEN. It allows a small sample of canary requests through to check if gateway recovered.', activeNodes: ['node-breaker-half', 'node-gateway'] },
        { id: 'step-5', title: 'Recovery or Trip Back', desc: 'If trial requests succeed, the breaker resets to CLOSED and resumes normal traffic. If they fail, it immediately trips back to OPEN for another cooldown period.', activeNodes: ['node-breaker-half', 'node-breaker-closed'] }
      ],
      nodes: [
        { id: 'node-breaker-closed', title: 'State: CLOSED', desc: 'Normal traffic flow', icon: '🟢' },
        { id: 'node-breaker-open', title: 'State: OPEN', desc: 'Fail fast / fallback', icon: '🔴' },
        { id: 'node-breaker-half', title: 'State: HALF-OPEN', desc: 'Canary probe testing', icon: '🟡' },
        { id: 'node-gateway', title: '3rd-Party Gateway', desc: 'Payment API / External Partner', icon: '🏦' },
        { id: 'node-fallback', title: 'Fallback Queue', desc: 'Dead-letter or delayed retry', icon: '📥' }
      ]
    }
  };

  // 2. QUIZZES DATA
  const MCQS_DATA = [
    {
      id: 'mcq-1',
      question: 'Inside an asynchronous I/O callback (e.g., fs.readFile), which callback executes first between setImmediate and setTimeout(fn, 0)?',
      options: [
        'setTimeout(fn, 0) always executes first',
        'setImmediate() always executes first',
        'The execution order is completely non-deterministic',
        'They execute concurrently on separate threads'
      ],
      answerIndex: 1,
      explanation: 'Within an I/O cycle (libuv Poll phase), I/O events complete and the event loop immediately transitions into the Check phase where setImmediate callbacks reside. The Timers phase (setTimeout) is only reached on the next iteration of the loop.'
    },
    {
      id: 'mcq-2',
      question: 'Which of the following Node.js core operations does NOT use the internal Libuv Worker Thread Pool (UV_THREADPOOL_SIZE)?',
      options: [
        'crypto.pbkdf2() password hashing',
        'fs.readFile() asynchronous file reading',
        'Incoming TCP network socket requests (http.createServer)',
        'dns.lookup() domain resolution'
      ],
      answerIndex: 2,
      explanation: 'Network sockets (http, net, tls) use OS non-blocking system primitives (epoll on Linux, kqueue on macOS) and do NOT consume libuv worker threads. Only fs, crypto, zlib, and dns.lookup use the worker thread pool.'
    },
    {
      id: 'mcq-3',
      question: 'What is the root cause of a "Cache Stampede" (Thundering Herd) in Redis-backed microservices?',
      options: [
        'Redis runs out of memory and crashes with OOM',
        'A hot cache key expires, causing thousands of concurrent requests to hit the database simultaneously',
        'Redis persistence (RDB snapshotting) blocks all incoming reads',
        'Network partition between Redis master and replica'
      ],
      answerIndex: 1,
      explanation: 'When a heavily queried key expires in a Cache-Aside system, every concurrent request experiences a cache miss at the exact same moment and queries the database simultaneously, causing DB CPU/connection exhaustion.'
    },
    {
      id: 'mcq-4',
      question: 'Why does Promise.allSettled() provide better fault tolerance than Promise.all() for dashboard aggregation APIs?',
      options: [
        'Promise.allSettled() executes promises in parallel whereas Promise.all() executes sequentially',
        'Promise.allSettled() never rejects; it waits for all promises to settle, allowing partial success responses even if one service fails',
        'Promise.allSettled() automatically retries failed promises 3 times',
        'Promise.allSettled() runs on a separate worker thread'
      ],
      answerIndex: 1,
      explanation: 'Promise.all fails-fast on the first rejection, throwing away all other results. Promise.allSettled waits for all promises to resolve or reject, returning an array of objects with status ("fulfilled" or "rejected"), enabling graceful partial degradation.'
    },
    {
      id: 'mcq-5',
      question: 'What happens in Node.js when unhandledRejection occurs without a process listener in modern Node.js versions (v15+)?',
      options: [
        'The error is logged silently and execution continues uninterrupted',
        'The Node.js process terminates immediately with an exit code of 1',
        'The rejected promise is pushed back to the end of the event loop',
        'The promise is automatically converted into an uncaughtException'
      ],
      answerIndex: 1,
      explanation: 'In Node.js 15+, unhandledRejection mode was changed to "throw". If an unhandled promise rejection occurs and has no process.on("unhandledRejection") listener, the process crashes immediately with a non-zero exit code (exit code 1).'
    }
  ];

  const OUTPUT_QUESTIONS = [
    {
      id: 'out-1',
      title: 'Event Loop Execution Priority: nextTick vs Promise vs Timer',
      code: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nprocess.nextTick(() => console.log('4'));\nconsole.log('5');`,
      expectedOutput: `1\n5\n4\n3\n2`,
      explanation: '1 and 5 execute synchronously on call stack. Microtasks run next: process.nextTick has highest priority (4), followed by Promise (3). Finally Timers macrotask phase executes setTimeout (2).'
    },
    {
      id: 'out-2',
      title: 'Closure & Var vs Let inside Asynchronous Loops',
      code: `for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log('var:', i), 0);\n}\nfor (let j = 0; j < 3; j++) {\n  setTimeout(() => console.log('let:', j), 0);\n}`,
      expectedOutput: `var: 3\nvar: 3\nvar: 3\nlet: 0\nlet: 1\nlet: 2`,
      explanation: '`var` is function-scoped; by the time timeouts run, `i` is 3. `let` is block-scoped, creating a fresh binding per iteration captured by the closure.'
    },
    {
      id: 'out-3',
      title: 'Async/Await Execution Order with Sequential Microtasks',
      code: `async function async1() {\n  console.log('A');\n  await async2();\n  console.log('B');\n}\nasync function async2() {\n  console.log('C');\n}\nconsole.log('D');\nasync1();\nconsole.log('E');`,
      expectedOutput: `D\nA\nC\nE\nB`,
      explanation: 'Sync "D" prints. `async1()` calls and logs "A". `async2()` logs "C". `await` schedules continuation "B" as a microtask. Sync finishes with "E". Microtask drains, printing "B".'
    }
  ];

  const SCENARIOS_DATA = [
    {
      id: 'scen-1',
      title: 'Production Outage: Node.js API Pods Crashing with OOM Every 3 Hours',
      symptoms: 'Kubernetes pods run at 99% memory before being killed by OOMKiller (Exit code 137). Restarting temporarily fixes, but memory climbs linearly back to 2GB.',
      investigation: 'Captured 3 heap snapshots 20 minutes apart. Retainer tree showed EventEmitter in WebSocket tracking service was holding 450,000 disconnected client objects.',
      rootCause: 'Event listeners registered via `socket.on(\'message\')` but telemetry listeners attached to global emitter were never removed on `disconnect`.',
      fix: 'Use `emitter.once()` or explicitly call `emitter.removeListener()` in the `disconnect` handler. Alternatively, use `AbortSignal` (`{ signal: controller.signal }`).'
    },
    {
      id: 'scen-2',
      title: 'Production Outage: Event Loop Freeze (100% CPU) During JWT Verification Spike',
      symptoms: 'During a sale, API latency spiked from 15ms to 12,000ms. CPU usage hit 100% across all 8 cores. Health checks failed, causing restart cascade.',
      investigation: 'CPU profile (`node --cpu-prof`) and flame graph showed 85% CPU trapped inside an unoptimized Regex verifying email inputs, triggering catastrophic ReDoS backtracking.',
      rootCause: 'Regex pattern `^([a-zA-Z0-9_.-]+)+@([a-zA-Z0-9_.-]+)+$` had nested quantifiers, causing exponential backtracking on non-matching strings of 40+ chars.',
      fix: 'Replaced with `validator.isEmail` and wrapped pattern evaluation with Google’s `re2` engine for guaranteed O(N) linear evaluation.'
    },
    {
      id: 'scen-3',
      title: 'Production Outage: PostgreSQL Connection Pool Starvation Under 400 RPS',
      symptoms: 'API endpoints threw `TimeoutError: ResourceRequest timed out` after 30s. Database CPU was 12%, but Node.js could not serve requests.',
      investigation: 'Inspected pool metrics: `waitingCount` was over 800 while `idleCount` was 0. Found a newly added payment reconciliation endpoint.',
      rootCause: 'Endpoint called `pool.connect()`, but an async call threw before `COMMIT` and author forgot a `finally` block with `client.release()`. Connection permanently leaked.',
      fix: 'Wrapped transaction strictly inside `try ... catch ... finally { client.release(); }`. Added alert on `pool.waitingCount > 20`.'
    }
  ];

  // 3. STORAGE & STATE
  const STORAGE_KEY = 'senior_js_node_prep_state_v1';
  class DashboardState {
    constructor() {
      this.state = this.loadState();
    }
    loadState() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return { completed: {}, bookmarked: {}, weak: {}, lang: 'hinglish', theme: 'dark', mode: 'easy' };
    }
    save() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); } catch (e) {}
    }
    toggleCompleted(id) {
      if (this.state.completed[id]) delete this.state.completed[id];
      else this.state.completed[id] = true;
      this.save();
      return !!this.state.completed[id];
    }
    isCompleted(id) { return !!this.state.completed[id]; }
    toggleBookmark(id) {
      if (this.state.bookmarked[id]) delete this.state.bookmarked[id];
      else this.state.bookmarked[id] = true;
      this.save();
      return !!this.state.bookmarked[id];
    }
    isBookmarked(id) { return !!this.state.bookmarked[id]; }
    toggleWeak(id) {
      if (this.state.weak[id]) delete this.state.weak[id];
      else this.state.weak[id] = true;
      this.save();
      return !!this.state.weak[id];
    }
    isWeak(id) { return !!this.state.weak[id]; }
    setMode(mode) { this.state.mode = mode; this.save(); }
    getMode() { return this.state.mode || 'easy'; }
    setLanguage(lang) { this.state.lang = lang; this.save(); }
    getLanguage() { return this.state.lang || 'hinglish'; }
    setTheme(theme) { this.state.theme = theme; this.save(); }
    getTheme() { return this.state.theme || 'dark'; }
    getStats(jsQuestions, nodeQuestions) {
      const jsCount = jsQuestions.length;
      const nodeCount = nodeQuestions.length;
      const totalCount = jsCount + nodeCount;
      let jsCompleted = 0, nodeCompleted = 0;
      jsQuestions.forEach(q => { if (this.state.completed[q.id]) jsCompleted++; });
      nodeQuestions.forEach(q => { if (this.state.completed[q.id]) nodeCompleted++; });
      const totalCompleted = jsCompleted + nodeCompleted;
      return {
        jsCompleted, jsCount, jsPct: Math.round((jsCompleted / jsCount) * 100),
        nodeCompleted, nodeCount, nodePct: Math.round((nodeCompleted / nodeCount) * 100),
        totalCompleted, totalCount, overallPct: Math.round((totalCompleted / totalCount) * 100),
        bookmarkedCount: Object.keys(this.state.bookmarked).length,
        weakCount: Object.keys(this.state.weak).length
      };
    }
  }

  // 4. CODE SANDBOX
  class CodeSandbox {
    static run(codeString) {
      const logs = [];
      const origLog = console.log;
      const origErr = console.error;
      const origWarn = console.warn;
      try {
        console.log = (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
        console.error = (...args) => logs.push('[Error] ' + args.map(a => String(a)).join(' '));
        console.warn = (...args) => logs.push('[Warn] ' + args.map(a => String(a)).join(' '));
        const cleanCode = codeString.replace(/import\s+.*?from\s+['"].*?['"];?/g, '// import').replace(/export\s+(default\s+)?/g, '');
        const runner = new Function(cleanCode);
        const result = runner();
        if (result !== undefined) logs.push('[Return] ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)));
      } catch (err) {
        logs.push('[Exception] ' + err.name + ': ' + err.message);
      } finally {
        console.log = origLog;
        console.error = origErr;
        console.warn = origWarn;
      }
      return logs.length > 0 ? logs.join('\n') : '// Code executed with no console output';
    }
  }

  // 5. EVENT LOOP PRESETS & VISUALIZER
  const EVENT_LOOP_PRESETS = {
    classic: {
      name: 'Classic Priority',
      code: `console.log('1: Sync');\nsetTimeout(() => console.log('2: Timeout'), 0);\nPromise.resolve().then(() => console.log('3: Promise'));\nprocess.nextTick(() => console.log('4: nextTick'));\nsetImmediate(() => console.log('5: Immediate'));\nconsole.log('6: Sync End');`,
      steps: [
        { action: 'Push to Call Stack: console.log("1: Sync")', stack: ['console.log("1: Sync")'], microtasks: [], nextTick: [], timers: [], check: [], output: '1: Sync', phase: 'Call Stack (Synchronous)' },
        { action: 'Schedule setTimeout(..., 0) -> Timers Queue', stack: ['setTimeout(...)'], microtasks: [], nextTick: [], timers: ['Timeout Callback'], check: [], output: null, phase: 'Call Stack' },
        { action: 'Schedule Promise.resolve().then(...) -> Microtask Queue', stack: ['Promise.then(...)'], microtasks: ['Promise Callback'], nextTick: [], timers: ['Timeout Callback'], check: [], output: null, phase: 'Call Stack' },
        { action: 'Schedule process.nextTick(...) -> nextTick VIP Queue', stack: ['process.nextTick(...)'], microtasks: ['Promise Callback'], nextTick: ['nextTick Callback'], timers: ['Timeout Callback'], check: [], output: null, phase: 'Call Stack' },
        { action: 'Schedule setImmediate(...) -> Check Queue', stack: ['setImmediate(...)'], microtasks: ['Promise Callback'], nextTick: ['nextTick Callback'], timers: ['Timeout Callback'], check: ['Immediate Callback'], output: null, phase: 'Call Stack' },
        { action: 'Push to Call Stack: console.log("6: Sync End")', stack: ['console.log("6: Sync End")'], microtasks: ['Promise Callback'], nextTick: ['nextTick Callback'], timers: ['Timeout Callback'], check: ['Immediate Callback'], output: '6: Sync End', phase: 'Call Stack (Synchronous)' },
        { action: 'Call Stack Empty! Draining nextTick queue (highest priority)', stack: ['nextTick Callback'], microtasks: ['Promise Callback'], nextTick: [], timers: ['Timeout Callback'], check: ['Immediate Callback'], output: '4: nextTick', phase: 'Microtask Phase (nextTick)' },
        { action: 'Draining Promise Microtask queue', stack: ['Promise Callback'], microtasks: [], nextTick: [], timers: ['Timeout Callback'], check: ['Immediate Callback'], output: '3: Promise', phase: 'Microtask Phase (Promises)' },
        { action: 'All microtasks drained. Event Loop enters Timers Phase', stack: ['Timeout Callback'], microtasks: [], nextTick: [], timers: [], check: ['Immediate Callback'], output: '2: Timeout', phase: 'Timers Phase' },
        { action: 'Event Loop enters Check Phase (setImmediate)', stack: ['Immediate Callback'], microtasks: [], nextTick: [], timers: [], check: [], output: '5: Immediate', phase: 'Check Phase (setImmediate)' },
        { action: 'Execution Complete. Event Loop idle, waiting for I/O.', stack: [], microtasks: [], nextTick: [], timers: [], check: [], output: null, phase: 'Event Loop Idle' }
      ]
    },
    starvation: {
      name: 'Recursive Starvation',
      code: `function loop() {\n  process.nextTick(loop);\n}\nloop();\nsetTimeout(() => console.log('Timeout'), 0); // Starved!`,
      steps: [
        { action: 'Invoke loop() and queue process.nextTick(loop)', stack: ['loop()'], microtasks: [], nextTick: ['loop()'], timers: ['Timeout Callback'], check: [], output: null, phase: 'Synchronous Execution' },
        { action: 'NextTick queue drains by invoking loop()... loops forever', stack: ['loop()'], microtasks: [], nextTick: ['loop()'], timers: ['Timeout Callback'], check: [], output: 'WARNING: Event Loop Starved!', phase: 'Microtask Queue (Starved)' },
        { action: 'Event loop trapped in microtask drain. Timers queue never runs!', stack: ['loop()'], microtasks: [], nextTick: ['loop()'], timers: ['Timeout Callback (Blocked)'], check: [], output: 'CRITICAL: I/O and HTTP Sockets Starved', phase: 'Starvation State' }
      ]
    }
  };

  class EventLoopVisualizer {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.currentPresetKey = 'classic';
      this.currentStepIndex = 0;
      this.timer = null;
      this.outputs = [];
    }
    init() { if (this.container) { this.render(); this.attachEvents(); } }
    render() {
      const preset = EVENT_LOOP_PRESETS[this.currentPresetKey];
      this.container.innerHTML = `
        <div class="visualizer-section">
          <div class="visualizer-header">
            <div class="visualizer-title"><span>⚡ Interactive Event Loop Visualizer</span></div>
            <div class="visualizer-selector-tabs">
              <button class="viz-tab-btn ${this.currentPresetKey === 'classic' ? 'active' : ''}" data-preset="classic">Classic Priority</button>
              <button class="viz-tab-btn ${this.currentPresetKey === 'starvation' ? 'active' : ''}" data-preset="starvation">Starvation Trap</button>
            </div>
          </div>
          <div class="event-loop-board">
            <div class="loop-code-panel">
              <div class="code-container" style="margin: 0;">
                <div class="code-header"><span>Code Simulation</span></div>
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
            <div>
              <div class="loop-queues-panel">
                <div class="queue-column">
                  <div class="queue-header callstack"><span>Call Stack</span><span id="q-count-stack">0</span></div>
                  <div class="queue-items-box" id="box-stack"></div>
                </div>
                <div class="queue-column">
                  <div class="queue-header microtasks"><span>Microtasks (nextTick / Promise)</span><span id="q-count-micro">0</span></div>
                  <div class="queue-items-box" id="box-micro"></div>
                </div>
                <div class="queue-column">
                  <div class="queue-header timers"><span>Timers (setTimeout)</span><span id="q-count-timers">0</span></div>
                  <div class="queue-items-box" id="box-timers"></div>
                </div>
                <div class="queue-column">
                  <div class="queue-header check"><span>Check (setImmediate)</span><span id="q-count-check">0</span></div>
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
          if (this.timer) { this.stopAutoPlay(); }
          else {
            btnPlay.textContent = '⏸ Pause';
            this.timer = setInterval(() => {
              const preset = EVENT_LOOP_PRESETS[this.currentPresetKey];
              if (this.currentStepIndex < preset.steps.length - 1) this.stepForward();
              else this.stopAutoPlay();
            }, 1100);
          }
        });
      }
      if (btnStep) btnStep.addEventListener('click', () => { this.stopAutoPlay(); this.stepForward(); });
      if (btnReset) btnReset.addEventListener('click', () => { this.stopAutoPlay(); this.currentStepIndex = 0; this.outputs = []; this.updateState(); });
    }
    stopAutoPlay() {
      if (this.timer) { clearInterval(this.timer); this.timer = null; const p = this.container.querySelector('#viz-btn-play'); if (p) p.textContent = '▶ Play'; }
    }
    stepForward() {
      const preset = EVENT_LOOP_PRESETS[this.currentPresetKey];
      if (this.currentStepIndex < preset.steps.length - 1) { this.currentStepIndex++; this.updateState(); }
    }
    updateState() {
      const preset = EVENT_LOOP_PRESETS[this.currentPresetKey];
      const step = preset.steps[this.currentStepIndex] || preset.steps[0];
      if (step.output && !this.outputs.includes(step.output + ' (step ' + this.currentStepIndex + ')')) {
        this.outputs.push(step.output);
      }
      const outBox = this.container.querySelector('#viz-console-out');
      if (outBox) outBox.textContent = this.outputs.join('\n');
      const phaseLabel = this.container.querySelector('#viz-phase-label');
      const descLabel = this.container.querySelector('#viz-step-desc');
      if (phaseLabel) phaseLabel.textContent = step.phase;
      if (descLabel) descLabel.textContent = step.action;
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

  // 6. SYSTEM DIAGRAMS ENGINE
  class SystemDiagramsEngine {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.currentDiagramKey = 'libuv-arch';
      this.currentStepIdx = 0;
    }
    init() { if (this.container) { this.render(); } }
    render() {
      const diag = DIAGRAMS_DATA[this.currentDiagramKey];
      const currentStep = diag.steps[this.currentStepIdx] || diag.steps[0];
      this.container.innerHTML = `
        <div class="visualizer-section">
          <div class="visualizer-header">
            <div class="visualizer-title"><span>🏗️ ${diag.title}</span></div>
            <div class="visualizer-selector-tabs">
              <button class="viz-tab-btn ${this.currentDiagramKey === 'libuv-arch' ? 'active' : ''}" data-key="libuv-arch">Libuv Thread Pool</button>
              <button class="viz-tab-btn ${this.currentDiagramKey === 'redis-cache' ? 'active' : ''}" data-key="redis-cache">Redis Cache-Aside</button>
              <button class="viz-tab-btn ${this.currentDiagramKey === 'kafka-flow' ? 'active' : ''}" data-key="kafka-flow">Kafka Partitions</button>
              <button class="viz-tab-btn ${this.currentDiagramKey === 'jwt-flow' ? 'active' : ''}" data-key="jwt-flow">JWT Rotation</button>
              <button class="viz-tab-btn ${this.currentDiagramKey === 'circuit-breaker' ? 'active' : ''}" data-key="circuit-breaker">Circuit Breaker</button>
            </div>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem;">${diag.description}</p>
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
          <div class="diagram-explanation-box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <div class="diagram-step-title">Step ${this.currentStepIdx + 1} of ${diag.steps.length}: ${currentStep.title}</div>
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
      if (btnPrev) btnPrev.addEventListener('click', () => { if (this.currentStepIdx > 0) { this.currentStepIdx--; this.render(); } });
      if (btnNext) btnNext.addEventListener('click', () => { const diag = DIAGRAMS_DATA[this.currentDiagramKey]; if (this.currentStepIdx < diag.steps.length - 1) { this.currentStepIdx++; this.render(); } });
    }
  }

  // 7. PRACTICE ENGINE
  class PracticeEngine {
    constructor(app) {
      this.app = app;
      this.modal = document.getElementById('practice-modal');
      this.modalTitle = document.getElementById('practice-modal-title');
      this.modalBody = document.getElementById('practice-modal-body');
      this.interviewQuestions = [];
      this.interviewIndex = 0;
      this.interviewTimerSeconds = 0;
      this.interviewTimerInterval = null;
      this.quizIndex = 0;
      this.quizScore = 0;
      this.selectedAnswer = null;
    }
    init() {
      const btnClose = document.getElementById('btn-close-modal');
      if (btnClose) btnClose.addEventListener('click', () => this.closeModal());
      if (this.modal) this.modal.addEventListener('click', (e) => { if (e.target === this.modal) this.closeModal(); });
    }
    openModal(title) {
      this.modalTitle.textContent = title;
      this.modal.classList.add('active');
    }
    closeModal() {
      this.modal.classList.remove('active');
      if (this.interviewTimerInterval) { clearInterval(this.interviewTimerInterval); this.interviewTimerInterval = null; }
    }
    startMockInterview(tab = 'all') {
      const pool = tab === 'js' ? this.app.jsQuestions : tab === 'node' ? this.app.nodeQuestions : [...this.app.jsQuestions, ...this.app.nodeQuestions];
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
          <p style="font-size: 0.86rem; color: var(--text-muted); margin-top: 0.5rem;">Take 60–90 seconds to answer out loud as if speaking directly to an Engineering Director.</p>
        </div>
        <div id="interview-answer-drawer" style="display: none; flex-direction: column; gap: 1rem; margin-top: 1.5rem; animation: fadeIn 0.2s ease;">
          <div class="short-answer-box"><div class="short-answer-label">⚡ 30-Second Interview Pitch</div><div>${q.shortAnswer}</div></div>
          <div class="detail-block"><div class="detail-block-title ${isCurrentHinglish ? 'hinglish-title' : 'deep-title'}"><span>${isCurrentHinglish ? '🇮🇳 Hinglish Explanation' : '🏛️ Deep Architectural Explanation'}</span></div><div class="detail-text">${isCurrentHinglish ? q.hinglishExplanation : q.deepExplanation}</div></div>
          <div class="detail-block"><div class="detail-block-title mistakes-title"><span>⚠️ What Senior Candidates Get Wrong</span></div><div class="detail-text">${q.commonMistakes}</div></div>
          <div class="detail-block"><div class="detail-block-title interview-title"><span>💬 How to Frame Your Answer</span></div><div class="detail-text">${q.interviewStrategy}</div></div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
          <button class="btn-cta btn-cta-secondary" id="btn-reveal-interview-ans" onclick="document.getElementById('interview-answer-drawer').style.display = 'flex'; this.style.display = 'none'; document.getElementById('rating-group').style.display = 'flex';">👁️ Reveal Ideal Answer</button>
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
      if (isMastered === true) { this.app.dashboardState.state.completed[q.id] = true; this.app.dashboardState.save(); }
      else if (isMastered === false) { this.app.dashboardState.state.weak[q.id] = true; this.app.dashboardState.save(); }
      this.app.updateDashboardStats();
      this.interviewIndex++;
      this.renderInterviewQuestion();
    }
    startQuiz() {
      this.quizIndex = 0; this.quizScore = 0; this.selectedAnswer = null;
      this.openModal('📝 Senior Technical MCQ Quiz');
      this.renderQuizQuestion();
    }
    renderQuizQuestion() {
      const q = MCQS_DATA[this.quizIndex];
      if (!q) {
        this.modalBody.innerHTML = `
          <div style="text-align: center; padding: 2.5rem 1rem;">
            <h2 style="font-size: 1.6rem; margin-bottom: 0.5rem;">Quiz Finished! 🎯</h2>
            <div style="font-size: 2.5rem; font-weight: 800; color: #22c55e; margin: 1rem 0;">${this.quizScore} / ${MCQS_DATA.length}</div>
            <p style="color: var(--text-secondary);">${this.quizScore === MCQS_DATA.length ? 'Outstanding! Top 1% Senior Technical Mastery.' : 'Great effort! Review the explanations to solidify edge cases.'}</p>
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
          <div class="quiz-options-list">
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
            <button class="btn-cta btn-cta-primary" id="btn-next-quiz" style="display: none;" onclick="window.app.practiceEngine.nextQuizQuestion()">Next Question →</button>
          </div>
        </div>
      `;
    }
    handleQuizAnswer(idx) {
      const q = MCQS_DATA[this.quizIndex];
      if (this.selectedAnswer !== null) return;
      this.selectedAnswer = idx;
      this.modalBody.querySelectorAll('.quiz-option-btn').forEach(btn => btn.style.pointerEvents = 'none');
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
    startOutputLab() {
      this.openModal('💻 Senior Output-Based & Tricky Snippets');
      this.modalBody.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <p style="font-size: 0.9rem; color: var(--text-secondary);">These questions test execution order, V8 microtasks, variable environments, and tricky scopes.</p>
          ${OUTPUT_QUESTIONS.map((item, idx) => `
            <div class="question-card" style="padding: 1.25rem;">
              <h3 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--text-primary);">${idx + 1}. ${item.title}</h3>
              <div class="code-container" style="margin-bottom: 0.75rem;">
                <div class="code-header">
                  <span>JavaScript Code</span>
                  <button class="btn-code-action btn-run-code" onclick="window.app.practiceEngine.runOutputSnippet(${idx})">▶ Run in Sandbox</button>
                </div>
                <pre class="code-block" style="padding: 0.75rem;"><code id="out-code-${idx}">${escapeHtml(item.code)}</code></pre>
                <div class="inline-console-output" id="out-console-${idx}"></div>
              </div>
              <button class="btn-viz-control" id="btn-reveal-out-${idx}" onclick="document.getElementById('out-exp-${idx}').style.display = 'block'; this.style.display = 'none';">👁️ Reveal Expected Output & Explanation</button>
              <div id="out-exp-${idx}" style="display: none; margin-top: 0.85rem;">
                <div class="output-preview-box">
                  <div class="output-label">Expected Output</div>
                  <pre style="margin: 0; color: #a7f3d0; white-space: pre-wrap; font-family: var(--font-mono);">${escapeHtml(item.expectedOutput)}</pre>
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
      if (box) { box.style.display = 'block'; box.textContent = output; }
    }
    startScenarioLab() {
      this.openModal('🚨 Senior Production Outages & Debugging Lab');
      this.modalBody.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <p style="font-size: 0.9rem; color: var(--text-secondary);">MNC interviews test your ability to triage real production crises (OOM crashes, CPU locks, connection pool starvation):</p>
          ${SCENARIOS_DATA.map((scen, idx) => `
            <div class="question-card" style="border-left: 4px solid var(--accent-pink); padding: 1.4rem;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem;">
                <h3 style="font-size: 1.15rem; color: var(--text-primary);">${idx + 1}. ${scen.title}</h3>
                <span class="badge badge-difficulty-advanced">P0 Production Incident</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                <div class="detail-block" style="border-left: 3px solid #ef4444;"><div class="detail-block-title" style="color: #ef4444;">🔥 Incident Symptoms & Telemetry</div><div class="detail-text">${scen.symptoms}</div></div>
                <div class="detail-block" style="border-left: 3px solid #38bdf8;"><div class="detail-block-title" style="color: #38bdf8;">🔍 Senior Investigation Methodology</div><div class="detail-text">${scen.investigation}</div></div>
                <div class="detail-block" style="border-left: 3px solid #fbbf24;"><div class="detail-block-title" style="color: #fbbf24;">🎯 Root Cause Analysis (RCA)</div><div class="detail-text">${scen.rootCause}</div></div>
                <div class="detail-block" style="border-left: 3px solid #22c55e;"><div class="detail-block-title" style="color: #22c55e;">🛡️ Permanent Architectural Fix & Prevention</div><div class="detail-text">${scen.fix}</div></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderQuestionCard(q, state, currentLang) {
    const isDone = state.isCompleted(q.id);
    const isBookmarked = state.isBookmarked(q.id);
    const isWeak = state.isWeak(q.id);
    const mode = state.getMode ? state.getMode() : 'easy';
    const priorityBadgeClass = q.priority === 'Must Know' ? 'badge-priority-must-know' : 'badge-priority-high';
    const diffBadgeClass = q.difficulty === 'Advanced' ? 'badge-difficulty-advanced' : 'badge-difficulty-intermediate';

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

  // 8. MASTER APP CONTROLLER (Streamlined & Easy Navigation Engine)
  class InterviewApp {
    constructor() {
      this.dashboardState = new DashboardState();
      this.currentView = 'js-handbook'; // 'js-handbook' | 'node-handbook' | 'questions' | 'comparisons' | 'scenarios' | 'revision'
      this.readingMode = 'single'; // 'single' (focused chapter reader) | 'all' (scroll all)
      this.activeTopicId = 'js-1-fundamentals';
      this.activeQuestionsTab = 'js';
      this.activeFilter = 'all';
      this.selectedCategory = 'all';
      this.searchQuery = '';
      this.eventLoopViz = null;
      this.systemDiagramsEngine = null;
      this.practiceEngine = null;
    }

    get jsQuestions() {
      return window.JS_QUESTIONS || [];
    }

    get nodeQuestions() {
      return window.NODE_QUESTIONS || [];
    }

    get handbookTopics() {
      return window.HANDBOOK_TOPICS || { js: [], node: [] };
    }

    get comparisonsData() {
      return window.COMPARISONS_DATA || [];
    }

    get seniorScenarios() {
      return window.SENIOR_SCENARIOS || [];
    }

    get quickRevisionData() {
      return window.QUICK_REVISION_DATA || {};
    }

    init() {
      this.applyTheme(this.dashboardState.getTheme());
      this.updateLanguageUI(this.dashboardState.getLanguage());

      this.eventLoopViz = new EventLoopVisualizer('event-loop-viz-container');
      this.eventLoopViz.init();

      this.systemDiagramsEngine = new SystemDiagramsEngine('system-diagrams-viz-container');
      this.systemDiagramsEngine.init();

      this.practiceEngine = new PracticeEngine(this);
      this.practiceEngine.init();

      this.attachHeaderEvents();
      this.attachSidebarEvents();
      this.attachHeroEvents();
      this.attachChapterNavEvents();
      this.attachKeyboardNav();

      this.updateModeUI(this.dashboardState.getMode());
      this.switchView('js-handbook');
      this.updateDashboardStats();
    }

    attachHeaderEvents() {
      // Main navigation tabs
      const navTabs = [
        { id: 'tab-btn-js', view: 'js-handbook' },
        { id: 'tab-btn-node', view: 'node-handbook' },
        { id: 'tab-btn-questions', view: 'questions' },
        { id: 'tab-btn-comparisons', view: 'comparisons' },
        { id: 'tab-btn-scenarios', view: 'scenarios' },
        { id: 'tab-btn-revision', view: 'revision' }
      ];

      navTabs.forEach(item => {
        const el = document.getElementById(item.id);
        if (el) {
          el.addEventListener('click', () => this.switchView(item.view));
        }
      });

      // Easy Mode vs Deep Mode
      const btnModeEasy = document.getElementById('btn-mode-easy');
      const btnModeDeep = document.getElementById('btn-mode-deep');
      if (btnModeEasy) {
        btnModeEasy.addEventListener('click', () => {
          this.dashboardState.setMode('easy');
          this.updateModeUI('easy');
          this.renderCurrentView();
        });
      }
      if (btnModeDeep) {
        btnModeDeep.addEventListener('click', () => {
          this.dashboardState.setMode('deep');
          this.updateModeUI('deep');
          this.renderCurrentView();
        });
      }

      // Language switcher (English <-> Hinglish)
      const langBtn = document.getElementById('btn-lang-toggle');
      if (langBtn) {
        langBtn.addEventListener('click', () => {
          const next = this.dashboardState.getLanguage() === 'en' ? 'hinglish' : 'en';
          this.dashboardState.setLanguage(next);
          this.updateLanguageUI(next);
          this.renderCurrentView();
        });
      }

      // Theme toggle
      const themeBtn = document.getElementById('btn-theme-toggle');
      if (themeBtn) {
        themeBtn.addEventListener('click', () => {
          const next = this.dashboardState.getTheme() === 'dark' ? 'light' : 'dark';
          this.dashboardState.setTheme(next);
          this.applyTheme(next);
        });
      }

      // Practice shortcuts
      const btnMock = document.getElementById('btn-nav-mock');
      if (btnMock) btnMock.addEventListener('click', () => this.practiceEngine.startMockInterview(this.currentView.includes('node') ? 'node' : 'js'));

      const btnQuiz = document.getElementById('btn-nav-quiz');
      if (btnQuiz) btnQuiz.addEventListener('click', () => this.practiceEngine.startQuiz());

      // Mobile sidebar toggle
      const btnMobileMenu = document.getElementById('btn-mobile-menu');
      const btnCloseSidebar = document.getElementById('btn-close-sidebar');
      const sidebar = document.getElementById('app-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');

      const openSidebar = () => {
        if (sidebar) sidebar.classList.add('open');
        if (backdrop) backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      };

      const closeSidebar = () => {
        if (sidebar) sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('active');
        document.body.style.overflow = '';
      };

      if (btnMobileMenu) btnMobileMenu.addEventListener('click', openSidebar);
      if (btnCloseSidebar) btnCloseSidebar.addEventListener('click', closeSidebar);
      if (backdrop) backdrop.addEventListener('click', closeSidebar);
      this.closeMobileSidebar = closeSidebar;
    }

    attachKeyboardNav() {
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (this.currentView === 'js-handbook' || this.currentView === 'node-handbook') {
          if (e.key === 'ArrowRight') {
            const list = this.getFilteredHandbook(this.currentView === 'js-handbook' ? 'js' : 'node');
            const idx = list.findIndex(t => t.id === this.activeTopicId);
            if (idx >= 0 && idx < list.length - 1) {
              this.selectTopic(list[idx + 1].id);
            }
          } else if (e.key === 'ArrowLeft') {
            const list = this.getFilteredHandbook(this.currentView === 'js-handbook' ? 'js' : 'node');
            const idx = list.findIndex(t => t.id === this.activeTopicId);
            if (idx > 0) {
              this.selectTopic(list[idx - 1].id);
            }
          }
        }
      });
    }

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      const themeIcon = document.getElementById('theme-icon');
      if (themeIcon) themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    updateModeUI(mode) {
      const btnModeEasy = document.getElementById('btn-mode-easy');
      const btnModeDeep = document.getElementById('btn-mode-deep');
      if (btnModeEasy && btnModeDeep) {
        if (mode === 'easy') {
          btnModeEasy.className = 'mode-btn active-easy';
          btnModeDeep.className = 'mode-btn';
        } else {
          btnModeEasy.className = 'mode-btn';
          btnModeDeep.className = 'mode-btn active-deep';
        }
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

    switchView(viewName) {
      this.currentView = viewName;
      this.selectedCategory = 'all';
      this.searchQuery = '';

      if (viewName === 'js-handbook') {
        if (!this.activeTopicId.startsWith('js-')) this.activeTopicId = 'js-1-fundamentals';
      } else if (viewName === 'node-handbook') {
        if (!this.activeTopicId.startsWith('node-')) this.activeTopicId = 'node-1-architecture';
      }

      const searchInput = document.getElementById('sidebar-search-input');
      const mainSearchInput = document.getElementById('main-search-input');
      if (searchInput) searchInput.value = '';
      if (mainSearchInput) mainSearchInput.value = '';

      // Update active nav button
      const navMap = {
        'js-handbook': 'tab-btn-js',
        'node-handbook': 'tab-btn-node',
        'questions': 'tab-btn-questions',
        'comparisons': 'tab-btn-comparisons',
        'scenarios': 'tab-btn-scenarios',
        'revision': 'tab-btn-revision'
      };

      Object.entries(navMap).forEach(([view, id]) => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('active', view === viewName);
      });

      // Update hero banner texts and controls visibility
      const heroTitle = document.getElementById('hero-main-title');
      const heroDesc = document.getElementById('hero-main-desc');
      const viewModeToggle = document.getElementById('view-mode-toggle-group');
      const btnToggleViz = document.getElementById('hero-btn-toggle-viz');
      const collapsibleViz = document.getElementById('collapsible-viz-container');

      if (collapsibleViz) collapsibleViz.style.display = 'none';

      if (viewName === 'js-handbook') {
        if (!this.activeTopicId || !this.activeTopicId.startsWith('js-')) {
          this.activeTopicId = 'js-fundamentals';
        }
        if (heroTitle) heroTitle.textContent = '⚡ JavaScript Core Handbook (24 Topics)';
        if (heroDesc) heroDesc.textContent = 'Har concept ka seedha matlab, real-life kahani, runnable code sandbox aur MNC interview answers.';
        if (viewModeToggle) viewModeToggle.style.display = 'inline-flex';
        if (btnToggleViz) btnToggleViz.style.display = 'inline-flex';
      } else if (viewName === 'node-handbook') {
        if (!this.activeTopicId || !this.activeTopicId.startsWith('node-')) {
          this.activeTopicId = 'node-architecture';
        }
        if (heroTitle) heroTitle.textContent = '🟢 Node.js Core Handbook (35 Topics)';
        if (heroDesc) heroDesc.textContent = 'Libuv internals, streams, clustering, memory leaks aur production scaling patterns.';
        if (viewModeToggle) viewModeToggle.style.display = 'inline-flex';
        if (btnToggleViz) btnToggleViz.style.display = 'inline-flex';
      } else if (viewName === 'comparisons') {
        if (heroTitle) heroTitle.textContent = '⚖️ 10 Concept Comparison Matrices';
        if (heroDesc) heroDesc.textContent = 'Side-by-side criteria tables, memory trade-offs aur senior interview takeaways.';
        if (viewModeToggle) viewModeToggle.style.display = 'none';
        if (btnToggleViz) btnToggleViz.style.display = 'none';
      } else if (viewName === 'scenarios') {
        if (heroTitle) heroTitle.textContent = '🚨 Senior 8+ Years Production Outages Lab';
        if (heroDesc) heroDesc.textContent = 'Real-world P0 latency spikes, OOM leaks, cache stampede aur graceful shutdown triage playbooks.';
        if (viewModeToggle) viewModeToggle.style.display = 'none';
        if (btnToggleViz) btnToggleViz.style.display = 'none';
      } else if (viewName === 'revision') {
        if (heroTitle) heroTitle.textContent = '⚡ High-Yield Quick Revision Cheatsheet';
        if (heroDesc) heroDesc.textContent = 'Last-minute golden rules, memory cards, aur tricky interview traps.';
        if (viewModeToggle) viewModeToggle.style.display = 'none';
        if (btnToggleViz) btnToggleViz.style.display = 'none';
      } else if (viewName === 'questions') {
        if (heroTitle) heroTitle.textContent = '🎯 200 Questions Interview Bank';
        if (heroDesc) heroDesc.textContent = '100 JavaScript + 100 Node.js questions categorized with difficulty and runnable sandboxes.';
        if (viewModeToggle) viewModeToggle.style.display = 'none';
        if (btnToggleViz) btnToggleViz.style.display = 'none';
      }

      this.renderSidebar();
      this.renderCurrentView();
      this.updateChapterNavUI();
    }

    switchTab(tab) {
      if (tab === 'js') this.switchView('js-handbook');
      else this.switchView('node-handbook');
    }

    renderCurrentView() {
      const heading = document.getElementById('content-heading-title');
      const countTag = document.getElementById('content-count-tag');
      const container = document.getElementById('questions-list-container');
      if (!container) return;

      const lang = this.dashboardState.getLanguage();

      if (this.currentView === 'js-handbook') {
        const list = this.getFilteredHandbook('js');
        if (heading) heading.textContent = this.readingMode === 'single' ? '⚡ JavaScript Reading Chapter' : '⚡ All JavaScript Topics';
        if (countTag) countTag.textContent = `${list.length} Topics`;
        container.innerHTML = this.renderHandbookList(list, 'js', lang);
      } else if (this.currentView === 'node-handbook') {
        const list = this.getFilteredHandbook('node');
        if (heading) heading.textContent = this.readingMode === 'single' ? '🟢 Node.js Reading Chapter' : '🟢 All Node.js Topics';
        if (countTag) countTag.textContent = `${list.length} Topics`;
        container.innerHTML = this.renderHandbookList(list, 'node', lang);
      } else if (this.currentView === 'questions') {
        const isJs = this.activeQuestionsTab === 'js';
        if (heading) heading.textContent = `🎯 100 ${isJs ? 'JavaScript' : 'Node.js'} Questions`;
        this.renderQuestions();
      } else if (this.currentView === 'comparisons') {
        if (heading) heading.textContent = '⚖️ 10 Concept Comparison Matrices';
        const list = this.getFilteredComparisons();
        if (countTag) countTag.textContent = `${list.length} Comparisons`;
        container.innerHTML = this.renderComparisonsList(list);
      } else if (this.currentView === 'scenarios') {
        if (heading) heading.textContent = '🚨 Senior Outage Triage Playbooks';
        const list = this.getFilteredScenarios();
        if (countTag) countTag.textContent = `${list.length} Scenarios`;
        container.innerHTML = this.renderScenariosList(list);
      } else if (this.currentView === 'revision') {
        if (heading) heading.textContent = '⚡ High-Yield Revision Cheatsheet';
        if (countTag) countTag.textContent = 'Golden Rules & Traps';
        container.innerHTML = this.renderRevisionList();
      }

      this.updateChapterNavUI();
    }

    getFilteredHandbook(type) {
      const raw = type === 'js' ? this.handbookTopics.js : this.handbookTopics.node;
      return (raw || []).filter(t => {
        if (this.searchQuery) {
          const q = this.searchQuery;
          const match = t.title.toLowerCase().includes(q) ||
                        t.category.toLowerCase().includes(q) ||
                        t.whatIsIt.toLowerCase().includes(q) ||
                        (t.whatIsItHi && t.whatIsItHi.toLowerCase().includes(q)) ||
                        t.analogy.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      });
    }

    getFilteredComparisons() {
      return (this.comparisonsData || []).filter(c => {
        if (this.searchQuery) {
          const q = this.searchQuery;
          const match = c.title.toLowerCase().includes(q) ||
                        c.description.toLowerCase().includes(q) ||
                        c.interviewTakeaway.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      });
    }

    getFilteredScenarios() {
      return (this.seniorScenarios || []).filter(s => {
        if (this.searchQuery) {
          const q = this.searchQuery;
          const match = s.title.toLowerCase().includes(q) ||
                        s.problemStatement.toLowerCase().includes(q) ||
                        s.tags.some(t => t.toLowerCase().includes(q));
          if (!match) return false;
        }
        return true;
      });
    }

    renderHandbookList(list, type, lang) {
      if (!list.length) {
        return `
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <div class="empty-state-text">No topics match "${escapeHtml(this.searchQuery)}"</div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem;">Try clearing your search query.</p>
          </div>
        `;
      }

      // Single Topic Focus Mode (Easy, clean, chapter-by-chapter reading)
      if (this.readingMode === 'single') {
        const activeIdx = list.findIndex(t => t.id === this.activeTopicId);
        const currentIdx = activeIdx >= 0 ? activeIdx : 0;
        const currentTopic = list[currentIdx];
        if (!currentTopic) return '';
        this.activeTopicId = currentTopic.id;
        const prev = currentIdx > 0 ? list[currentIdx - 1] : null;
        const next = currentIdx < list.length - 1 ? list[currentIdx + 1] : null;
        return this.renderConceptCard(currentTopic, lang, currentIdx, list.length, type, prev, next);
      }

      // View All Mode (Continuous scroll)
      return list.map((topic, idx) => {
        const prev = idx > 0 ? list[idx - 1] : null;
        const next = idx < list.length - 1 ? list[idx + 1] : null;
        return this.renderConceptCard(topic, lang, idx, list.length, type, prev, next);
      }).join('');
    }

    selectTopic(id) {
      this.activeTopicId = id;
      this.renderSidebar();
      this.renderCurrentView();
      this.updateChapterNavUI();

      const card = document.getElementById(`topic-${id}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        card.style.outline = '2px solid #38bdf8';
        setTimeout(() => card.style.outline = 'none', 1800);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      if (window.innerWidth <= 1024 && this.closeMobileSidebar) {
        this.closeMobileSidebar();
      }
    }

    renderConceptCard(topic, lang, idx, total, type, prev, next) {
      const what = lang === 'hinglish' ? (topic.whatIsItHi || topic.whatIsIt) : topic.whatIsIt;
      const why = lang === 'hinglish' ? (topic.whyNeedHi || topic.whyNeed) : topic.whyNeed;
      const how = lang === 'hinglish' ? (topic.howItWorksHi || topic.howItWorks) : topic.howItWorks;
      const analogy = lang === 'hinglish' ? (topic.analogyHi || topic.analogy) : topic.analogy;

      return `
        <article class="concept-page-container question-card" id="topic-${topic.id}">
          <!-- Breadcrumb & Top Bar -->
          <div class="concept-breadcrumb">
            <span>${type === 'js' ? '⚡ JavaScript' : '🟢 Node.js'} Handbook</span>
            <span>/</span>
            <span>${topic.category}</span>
            <span>/</span>
            <span style="color: var(--text-primary); font-weight: 700;">Topic #${topic.num}</span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
            <h2 class="q-title" style="font-size: 1.45rem; cursor: default;">
              #${topic.num}. ${topic.title}
            </h2>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span class="badge badge-topic">${topic.category}</span>
              <button class="btn-card-action" title="Copy Deep Link" onclick="window.app.copyTopicLink('${topic.id}')">🔗</button>
            </div>
          </div>

          <!-- Part 1: What is it? -->
          <div class="concept-part-card">
            <div class="concept-part-title">
              <span class="part-number-badge">1</span> What is it? (2–4 Lines Concise Definition)
            </div>
            <div class="concept-part-body" style="font-size: 1.05rem; line-height: 1.6; color: var(--text-primary); font-weight: 500;">
              ${what}
            </div>
          </div>

          <!-- Part 2: Why do we need it? -->
          <div class="concept-part-card">
            <div class="concept-part-title">
              <span class="part-number-badge">2</span> Why do we need it? (Real Problem It Solves)
            </div>
            <div class="concept-part-body">
              ${why}
            </div>
          </div>

          <!-- Part 3: How does it work internally? -->
          <div class="concept-part-card">
            <div class="concept-part-title">
              <span class="part-number-badge">3</span> How does it work internally? (Step-by-Step Mechanics)
            </div>
            <div class="concept-part-body">
              ${how}
            </div>
          </div>

          <!-- Part 4: Important Components -->
          ${topic.components && topic.components.length ? `
            <div class="concept-part-card">
              <div class="concept-part-title">
                <span class="part-number-badge">4</span> Important Components Involved
              </div>
              <div class="components-tags-grid">
                ${topic.components.map(comp => `<div class="component-tag-pill">⚙️ ${comp}</div>`).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Part 5: Real-Life Analogy -->
          <div class="concept-analogy-box">
            <div class="analogy-header-badge">
              <span>🍕 Easy Real-Life Analogy (Everyday Story Connected to Code)</span>
            </div>
            <div class="analogy-text-content">
              ${analogy}
            </div>
          </div>

          <!-- Part 6: Practical Code Example -->
          <div class="concept-part-card">
            <div class="concept-part-title">
              <span class="part-number-badge">6</span> Practical Backend Code Example
            </div>
            <div class="code-container" style="margin-top: 0.65rem;">
              <div class="code-header">
                <span>Code Example (${topic.title})</span>
                <div class="code-header-actions">
                  <button class="btn-code-action" onclick="window.app.copyCode('${topic.id}')">Copy</button>
                  <button class="btn-code-action btn-run-code" onclick="window.app.runSandboxCode('${topic.id}')">▶ Run in Sandbox</button>
                </div>
              </div>
              <pre class="code-block"><code id="code-${topic.id}">${escapeHtml(topic.code)}</code></pre>
              <div class="inline-console-output" id="output-${topic.id}"></div>
            </div>
          </div>

          <!-- Part 7: Expected Output -->
          <div class="output-preview-box">
            <div class="output-label">7. Expected Console Output</div>
            <pre class="output-preview-text">${escapeHtml(topic.output)}</pre>
          </div>

          <!-- Part 8: Step-by-Step Execution -->
          <div class="concept-part-card">
            <div class="concept-part-title">
              <span class="part-number-badge">8</span> Step-by-Step Execution (Why this output appears)
            </div>
            <div class="execution-step-list">
              ${(topic.stepByStep || '').split('\n').filter(s => s.trim()).map(step => `
                <div class="execution-step-item">
                  <span class="step-badge-num">✓</span>
                  <div>${escapeHtml(step)}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Interview Answer Section -->
          ${topic.interview ? `
            <div class="interview-answer-box" style="margin-top: 1.25rem;">
              <div class="interview-section-header">
                <span>🗣️ What to Say in an MNC Technical Interview</span>
              </div>
              
              <div class="interview-pitch-speech">
                "${topic.interview.pitch}"
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
                <div class="detail-block">
                  <div class="detail-block-title interview-title"><span>📌 Short Answer (10–15 Seconds)</span></div>
                  <div class="detail-text">${topic.interview.shortAnswer}</div>
                </div>
                <div class="detail-block">
                  <div class="detail-block-title deep-title"><span>🔬 Detailed Architectural Explanation</span></div>
                  <div class="detail-text">${topic.interview.detailedAnswer}</div>
                </div>
              </div>

              ${topic.interview.followUps && topic.interview.followUps.length ? `
                <div class="detail-block" style="margin-top: 1rem;">
                  <div class="detail-block-title followup-title"><span>🎯 Common Follow-Ups Asked by Interviewers</span></div>
                  <ul style="padding-left: 1.25rem; margin-top: 0.4rem; color: var(--text-secondary); line-height: 1.6;">
                    ${topic.interview.followUps.map(f => `<li><strong>${escapeHtml(f)}</strong></li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Previous / Next Navigation Bar -->
          <div class="prev-next-nav">
            ${prev ? `<button class="btn-nav-topic" onclick="window.app.selectTopic('${prev.id}')">← #${prev.num} ${prev.title}</button>` : '<div></div>'}
            <span style="font-size: 0.8rem; color: var(--text-muted);">Topic ${topic.num} of ${total}</span>
            ${next ? `<button class="btn-nav-topic" onclick="window.app.selectTopic('${next.id}')">#${next.num} ${next.title} →</button>` : '<div></div>'}
          </div>
        </article>
      `;
    }

    renderComparisonsList(list) {
      if (!list.length) return `<div class="empty-state">No comparison tables match your search.</div>`;
      return list.map(comp => `
        <article class="question-card" id="comp-${comp.id}" style="padding: 1.6rem; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
            <h3 style="font-size: 1.35rem; color: var(--text-primary); font-weight: 800;">${comp.title}</h3>
            <span class="badge badge-topic">Concept Comparison Matrix</span>
          </div>
          <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.55; margin-bottom: 1rem;">${comp.description}</p>
          
          <div class="comparison-table-wrapper">
            <table class="comparison-table">
              <thead>
                <tr>
                  ${comp.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${comp.rows.map(r => `
                  <tr>
                    ${r.map((cell, idx) => `<td style="${idx === 0 ? 'font-weight: 700; color: var(--text-primary);' : ''}">${cell}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="margin-top: 1.25rem; background: rgba(56, 189, 248, 0.08); border-left: 3px solid #38bdf8; border-radius: 6px; padding: 0.85rem 1rem;">
            <div style="font-weight: 800; font-size: 0.84rem; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.25rem;">
              🎯 Senior Interview Takeaway
            </div>
            <div style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.55;">
              ${comp.interviewTakeaway}
            </div>
          </div>
        </article>
      `).join('');
    }

    renderScenariosList(list) {
      if (!list.length) return `<div class="empty-state">No outage scenarios match your search.</div>`;
      return list.map((scen, idx) => `
        <article class="question-card" id="scen-${scen.id}" style="border-left: 4px solid #f43f5e; padding: 1.6rem; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
            <h3 style="font-size: 1.25rem; color: var(--text-primary); font-weight: 800;">${idx + 1}. ${scen.title}</h3>
            <span class="badge badge-difficulty-advanced">P0 Production Incident</span>
          </div>

          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem;">
            ${scen.tags.map(t => `<span class="badge badge-topic">${t}</span>`).join('')}
          </div>

          <div class="detail-block" style="border-left: 3px solid #ef4444; margin-bottom: 1rem;">
            <div class="detail-block-title" style="color: #ef4444;">🔥 Incident Symptoms & Problem Statement</div>
            <div class="detail-text" style="font-size: 0.95rem; line-height: 1.6;">${scen.problemStatement}</div>
          </div>

          <div class="concept-part-title" style="margin: 1.25rem 0 0.5rem 0;">🔍 Step-by-Step Investigation & Telemetry Procedure</div>
          <div class="execution-step-list">
            ${scen.investigationSteps.map(step => `
              <div class="execution-step-item" style="flex-direction: column; gap: 0.35rem;">
                <div style="font-weight: 700; color: #38bdf8;">${step.step}</div>
                <div style="white-space: pre-wrap; font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary);">${step.detail}</div>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 1.25rem; background: rgba(34, 197, 94, 0.08); border-left: 3px solid #22c55e; border-radius: 6px; padding: 0.85rem 1rem;">
            <div style="font-weight: 800; font-size: 0.84rem; color: #22c55e; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.25rem;">
              🗣️ How to Pitch This in an 8+ Years MNC Interview
            </div>
            <div style="font-size: 0.95rem; color: #e2e8f0; line-height: 1.6; font-style: italic;">
              "${scen.interviewPitch}"
            </div>
          </div>
        </article>
      `).join('');
    }

    renderRevisionList() {
      const data = this.quickRevisionData;
      return `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- JavaScript Golden Rules -->
          <div class="question-card" style="padding: 1.6rem; border-left: 4px solid #f59e0b;">
            <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>⚡ JavaScript Core Golden Rules & Traps</span>
            </h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${(data.jsGoldenRules || []).map(r => `
                <div style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-subtle);">
                  <div style="font-weight: 800; color: #fbbf24; font-size: 1rem; margin-bottom: 0.35rem;">✓ ${r.title}</div>
                  <div style="color: var(--text-primary); font-size: 0.92rem; line-height: 1.55; margin-bottom: 0.5rem;">${r.rule}</div>
                  <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 0.4rem 0.65rem; border-radius: 4px; font-size: 0.86rem; color: #fca5a5;">
                    <strong>⚠️ Common Interview Trap:</strong> ${r.trap}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Node.js Golden Rules -->
          <div class="question-card" style="padding: 1.6rem; border-left: 4px solid #10b981;">
            <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>🟢 Node.js Core Golden Rules & Traps</span>
            </h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${(data.nodeGoldenRules || []).map(r => `
                <div style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-subtle);">
                  <div style="font-weight: 800; color: #34d399; font-size: 1rem; margin-bottom: 0.35rem;">✓ ${r.title}</div>
                  <div style="color: var(--text-primary); font-size: 0.92rem; line-height: 1.55; margin-bottom: 0.5rem;">${r.rule}</div>
                  <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 0.4rem 0.65rem; border-radius: 4px; font-size: 0.86rem; color: #fca5a5;">
                    <strong>⚠️ Common Interview Trap:</strong> ${r.trap}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Frequent Traps Memory Cards -->
          <div class="question-card" style="padding: 1.6rem; border-left: 4px solid #38bdf8;">
            <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>🎯 High-Frequency Senior Interview Trap Cards</span>
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
              ${(data.frequentTraps || []).map(t => `
                <div style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-subtle);">
                  <div style="font-weight: 700; color: #38bdf8; font-size: 0.95rem; margin-bottom: 0.45rem;">❓ ${t.question}</div>
                  <div style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.55;">${t.answer}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    renderSidebar() {
      const listEl = document.getElementById('sidebar-category-list');
      const sectionTitle = document.getElementById('sidebar-section-title');
      if (!listEl) return;

      if (this.currentView === 'js-handbook' || this.currentView === 'node-handbook') {
        const type = this.currentView === 'js-handbook' ? 'js' : 'node';
        const topics = this.getFilteredHandbook(type);
        if (sectionTitle) sectionTitle.textContent = type === 'js' ? '⚡ JS Topics (24)' : '🟢 Node.js Topics (35)';

        listEl.innerHTML = topics.map(t => {
          const isActive = t.id === this.activeTopicId;
          const isDone = this.dashboardState.isCompleted(t.id);
          return `
            <div class="sidebar-topic-item ${isActive ? 'active' : ''}" onclick="window.app.selectTopic('${t.id}')">
              <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden;">
                <span class="topic-num-badge">${t.num}</span>
                <span class="topic-title-text" title="${escapeHtml(t.title)}">${escapeHtml(t.title)}</span>
              </div>
              ${isDone ? '<span style="color: #22c55e; font-size: 0.85rem; font-weight: 800;">✓</span>' : ''}
            </div>
          `;
        }).join('');
      } else if (this.currentView === 'questions') {
        if (sectionTitle) sectionTitle.textContent = 'Categories';
        this.renderCategorySidebar();
      } else if (this.currentView === 'comparisons') {
        if (sectionTitle) sectionTitle.textContent = '⚖️ Comparisons (10)';
        listEl.innerHTML = this.getFilteredComparisons().map((c, i) => `
          <div class="sidebar-topic-item" onclick="window.app.jumpToTopic('comp-${c.id}')">
            <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden;">
              <span class="topic-num-badge">${i + 1}</span>
              <span class="topic-title-text" title="${escapeHtml(c.title)}">${escapeHtml(c.title)}</span>
            </div>
          </div>
        `).join('');
      } else if (this.currentView === 'scenarios') {
        if (sectionTitle) sectionTitle.textContent = '🚨 Outages Lab (6)';
        listEl.innerHTML = this.getFilteredScenarios().map((s, i) => `
          <div class="sidebar-topic-item" onclick="window.app.jumpToTopic('scen-${s.id}')">
            <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden;">
              <span class="topic-num-badge">${i + 1}</span>
              <span class="topic-title-text" title="${escapeHtml(s.title)}">${escapeHtml(s.title)}</span>
            </div>
          </div>
        `).join('');
      } else if (this.currentView === 'revision') {
        if (sectionTitle) sectionTitle.textContent = '⚡ Quick Revision';
        listEl.innerHTML = `
          <div class="sidebar-topic-item active" onclick="window.app.renderCurrentView()">
            <span class="topic-title-text">⚡ JavaScript Golden Rules</span>
          </div>
          <div class="sidebar-topic-item" onclick="window.app.renderCurrentView()">
            <span class="topic-title-text">🟢 Node.js Golden Rules</span>
          </div>
          <div class="sidebar-topic-item" onclick="window.app.renderCurrentView()">
            <span class="topic-title-text">🎯 High-Frequency Traps</span>
          </div>
        `;
      }
    }

    renderCategorySidebar() {
      const listEl = document.getElementById('sidebar-category-list');
      if (!listEl) return;
      const questions = this.activeQuestionsTab === 'js' ? this.jsQuestions : this.nodeQuestions;
      const categoryMap = {};
      questions.forEach(q => { categoryMap[q.category] = (categoryMap[q.category] || 0) + 1; });

      let html = `
        <div class="category-nav-item ${this.selectedCategory === 'all' ? 'active' : ''}" onclick="window.app.selectCategory('all')">
          <span>All Questions</span>
          <span class="category-count">${questions.length}</span>
        </div>
      `;
      Object.entries(categoryMap).forEach(([cat, count]) => {
        const isAct = this.selectedCategory === cat ? 'active' : '';
        html += `
          <div class="category-nav-item ${isAct}" onclick="window.app.selectCategory('${cat.replace(/'/g, "\\'")}')">
            <span>${cat}</span>
            <span class="category-count">${count}</span>
          </div>
        `;
      });
      listEl.innerHTML = html;
    }

    selectCategory(cat) {
      this.selectedCategory = cat;
      this.renderSidebar();
      this.renderCurrentView();
      if (window.innerWidth <= 1024 && this.closeMobileSidebar) {
        this.closeMobileSidebar();
      }
    }

    attachSidebarEvents() {
      const searchInput = document.getElementById('sidebar-search-input');
      const mainSearchInput = document.getElementById('main-search-input');

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          if (mainSearchInput) mainSearchInput.value = e.target.value;
          this.renderSidebar();
          this.renderCurrentView();
        });
      }

      if (mainSearchInput) {
        mainSearchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          if (searchInput) searchInput.value = e.target.value;
          this.renderSidebar();
          this.renderCurrentView();
        });
      }

      document.querySelectorAll('.quick-filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          document.querySelectorAll('.quick-filter-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.activeFilter = chip.getAttribute('data-filter');
          this.renderCurrentView();
        });
      });
    }

    attachHeroEvents() {
      // Reading mode toggle (Single Topic Focus vs View All)
      const btnSingle = document.getElementById('btn-mode-single');
      const btnAll = document.getElementById('btn-mode-all');
      if (btnSingle) {
        btnSingle.addEventListener('click', () => {
          this.readingMode = 'single';
          btnSingle.classList.add('active');
          if (btnAll) btnAll.classList.remove('active');
          this.renderCurrentView();
        });
      }
      if (btnAll) {
        btnAll.addEventListener('click', () => {
          this.readingMode = 'all';
          btnAll.classList.add('active');
          if (btnSingle) btnSingle.classList.remove('active');
          this.renderCurrentView();
        });
      }

      // Event Loop collapsible visualizer button
      const btnToggleViz = document.getElementById('hero-btn-toggle-viz');
      const vizContainer = document.getElementById('collapsible-viz-container');
      const vizHeader = document.getElementById('collapsible-viz-header');

      if (btnToggleViz && vizContainer) {
        btnToggleViz.addEventListener('click', () => {
          const isHidden = vizContainer.style.display === 'none';
          vizContainer.style.display = isHidden ? 'block' : 'none';
          vizContainer.classList.toggle('open', isHidden);
          if (isHidden) {
            vizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }

      if (vizHeader && vizContainer) {
        vizHeader.addEventListener('click', () => {
          vizContainer.style.display = 'none';
          vizContainer.classList.remove('open');
        });
      }

      const btnRandom = document.getElementById('hero-btn-random');
      if (btnRandom) btnRandom.addEventListener('click', () => this.scrollToRandomQuestion());
    }

    attachChapterNavEvents() {
      const dropdown = document.getElementById('chapter-dropdown-select');
      if (dropdown) {
        dropdown.addEventListener('change', (e) => {
          const val = e.target.value;
          if (this.currentView === 'js-handbook' || this.currentView === 'node-handbook') {
            this.selectTopic(val);
          } else {
            this.jumpToTopic(val);
          }
        });
      }

      const mobileToc = document.getElementById('mobile-btn-toc');
      if (mobileToc) {
        mobileToc.addEventListener('click', () => {
          const sidebar = document.getElementById('app-sidebar');
          const backdrop = document.getElementById('sidebar-backdrop');
          if (sidebar) sidebar.classList.add('open');
          if (backdrop) backdrop.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
      }
    }

    updateChapterNavUI() {
      const dropdown = document.getElementById('chapter-dropdown-select');
      const prevBtn = document.getElementById('nav-btn-prev');
      const nextBtn = document.getElementById('nav-btn-next');
      const counterPill = document.getElementById('chapter-counter-pill');
      const mobilePrev = document.getElementById('mobile-btn-prev');
      const mobileNext = document.getElementById('mobile-btn-next');
      const mobileToc = document.getElementById('mobile-toc-label');
      const navBar = document.getElementById('chapter-nav-bar');
      const mobileBar = document.getElementById('mobile-bottom-nav');

      if (!dropdown) return;

      if (this.currentView === 'js-handbook' || this.currentView === 'node-handbook') {
        const type = this.currentView === 'js-handbook' ? 'js' : 'node';
        const list = this.getFilteredHandbook(type);
        if (navBar) navBar.style.display = 'flex';
        if (mobileBar) mobileBar.style.display = 'flex';

        dropdown.innerHTML = list.map(t => `<option value="${t.id}">#${t.num}. ${escapeHtml(t.title)}</option>`).join('');
        dropdown.value = this.activeTopicId;

        const activeIdx = list.findIndex(t => t.id === this.activeTopicId);
        const curIdx = activeIdx >= 0 ? activeIdx : 0;
        const currentTopic = list[curIdx];

        if (counterPill && currentTopic) {
          counterPill.textContent = `Topic ${currentTopic.num} of ${list.length}`;
        }
        if (mobileToc && currentTopic) {
          mobileToc.textContent = `📖 Topic ${currentTopic.num} of ${list.length}`;
        }

        const hasPrev = curIdx > 0;
        const hasNext = curIdx < list.length - 1;

        if (prevBtn) {
          prevBtn.disabled = !hasPrev;
          prevBtn.onclick = () => { if (hasPrev) this.selectTopic(list[curIdx - 1].id); };
        }
        if (nextBtn) {
          nextBtn.disabled = !hasNext;
          nextBtn.onclick = () => { if (hasNext) this.selectTopic(list[curIdx + 1].id); };
        }
        if (mobilePrev) {
          mobilePrev.disabled = !hasPrev;
          mobilePrev.onclick = () => { if (hasPrev) this.selectTopic(list[curIdx - 1].id); };
        }
        if (mobileNext) {
          mobileNext.disabled = !hasNext;
          mobileNext.onclick = () => { if (hasNext) this.selectTopic(list[curIdx + 1].id); };
        }
      } else if (this.currentView === 'comparisons') {
        const list = this.getFilteredComparisons();
        if (navBar) navBar.style.display = 'flex';
        if (mobileBar) mobileBar.style.display = 'none';
        dropdown.innerHTML = list.map((c, i) => `<option value="comp-${c.id}">#${i + 1}. ${escapeHtml(c.title)}</option>`).join('');
        if (counterPill) counterPill.textContent = `${list.length} Comparisons`;
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
      } else if (this.currentView === 'scenarios') {
        const list = this.getFilteredScenarios();
        if (navBar) navBar.style.display = 'flex';
        if (mobileBar) mobileBar.style.display = 'none';
        dropdown.innerHTML = list.map((s, i) => `<option value="scen-${s.id}">#${i + 1}. ${escapeHtml(s.title)}</option>`).join('');
        if (counterPill) counterPill.textContent = `${list.length} Scenarios`;
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
      } else {
        if (navBar) navBar.style.display = 'flex';
        if (mobileBar) mobileBar.style.display = 'none';
        if (counterPill) counterPill.textContent = this.currentView === 'questions' ? '200 Questions' : 'Quick Revision';
        if (dropdown) {
          dropdown.innerHTML = this.currentView === 'questions' ?
            `<option value="js">⚡ JavaScript (100)</option><option value="node">🟢 Node.js (100)</option>` :
            `<option value="rules">⚡ Golden Rules & Traps</option>`;
        }
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
      }
    }

    getFilteredQuestions() {
      const rawList = this.activeQuestionsTab === 'js' ? this.jsQuestions : this.nodeQuestions;
      return rawList.filter(q => {
        if (this.selectedCategory !== 'all' && q.category !== this.selectedCategory) return false;
        if (this.activeFilter === 'must-know' && q.priority !== 'Must Know') return false;
        if (this.activeFilter === 'completed' && !this.dashboardState.isCompleted(q.id)) return false;
        if (this.activeFilter === 'bookmarked' && !this.dashboardState.isBookmarked(q.id)) return false;
        if (this.activeFilter === 'weak' && !this.dashboardState.isWeak(q.id)) return false;
        if (this.searchQuery) {
          const match = q.title.toLowerCase().includes(this.searchQuery) ||
                        q.shortAnswer.toLowerCase().includes(this.searchQuery) ||
                        q.category.toLowerCase().includes(this.searchQuery) ||
                        q.deepExplanation.toLowerCase().includes(this.searchQuery);
          if (!match) return false;
        }
        return true;
      });
    }

    renderQuestions() {
      const container = document.getElementById('questions-list-container');
      const countTag = document.getElementById('content-count-tag');
      if (!container) return;
      const filtered = this.getFilteredQuestions();
      if (countTag) countTag.textContent = `${filtered.length} Questions`;
      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <div class="empty-state-text">No questions found matching your criteria</div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem;">Try clearing your search query or selecting "All Topics".</p>
          </div>
        `;
        return;
      }
      const currentLang = this.dashboardState.getLanguage();
      container.innerHTML = `
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
          <button class="mode-btn ${this.activeQuestionsTab === 'js' ? 'active-easy' : ''}" onclick="window.app.setQuestionsTab('js')">⚡ JavaScript (100)</button>
          <button class="mode-btn ${this.activeQuestionsTab === 'node' ? 'active-deep' : ''}" onclick="window.app.setQuestionsTab('node')">🟢 Node.js (100)</button>
        </div>
      ` + filtered.map(q => renderQuestionCard(q, this.dashboardState, currentLang)).join('');
    }

    setQuestionsTab(tab) {
      this.activeQuestionsTab = tab;
      this.selectedCategory = 'all';
      this.renderSidebar();
      this.renderQuestions();
    }

    jumpToTopic(id) {
      const targetId = id.startsWith('topic-') || id.startsWith('comp-') || id.startsWith('scen-') ? id : `topic-${id}`;
      const cleanId = id.replace(/^(topic-|comp-|scen-)/, '');

      if (id.startsWith('node-') && this.currentView !== 'node-handbook') this.switchView('node-handbook');
      else if (id.startsWith('js-') && this.currentView !== 'js-handbook') this.switchView('js-handbook');
      else if (id.startsWith('comp-') && this.currentView !== 'comparisons') this.switchView('comparisons');
      else if (id.startsWith('scen-') && this.currentView !== 'scenarios') this.switchView('scenarios');

      if (this.readingMode === 'single' && (this.currentView === 'js-handbook' || this.currentView === 'node-handbook')) {
        this.selectTopic(cleanId);
        return;
      }

      setTimeout(() => {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          targetEl.style.outline = '2px solid #38bdf8';
          setTimeout(() => targetEl.style.outline = 'none', 2000);
        }
      }, 100);
    }

    copyTopicLink(id) {
      const url = window.location.href.split('#')[0] + '#' + id;
      navigator.clipboard.writeText(url).then(() => alert(`Topic link copied: #${id}`));
    }

    toggleCardDetails(id) {
      const details = document.getElementById(`details-${id}`);
      const icon = document.getElementById(`icon-toggle-${id}`);
      if (details) {
        const isExp = details.classList.contains('expanded');
        details.classList.toggle('expanded', !isExp);
        if (icon) icon.textContent = isExp ? '▶' : '▼';
      }
    }

    toggleCompleted(id) {
      this.dashboardState.toggleCompleted(id);
      this.updateDashboardStats();
      this.renderSidebar();
      const card = document.getElementById(`card-${id}`);
      if (card) {
        const isDone = this.dashboardState.isCompleted(id);
        card.classList.toggle('status-completed', isDone);
        const btn = card.querySelector('.btn-card-action[title*="Completed"]');
        if (btn) { btn.classList.toggle('active-check', isDone); btn.textContent = isDone ? '✓' : '○'; }
      }
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
        outEl.textContent = CodeSandbox.run(codeEl.textContent);
      }, 50);
    }

    copyCode(id) {
      const codeEl = document.getElementById(`code-${id}`);
      if (codeEl) {
        navigator.clipboard.writeText(codeEl.textContent).then(() => alert('Code snippet copied to clipboard!'));
      }
    }

    scrollToRandomQuestion() {
      if (this.currentView === 'js-handbook') {
        const list = this.handbookTopics.js;
        const item = list[Math.floor(Math.random() * list.length)];
        this.selectTopic(item.id);
      } else if (this.currentView === 'node-handbook') {
        const list = this.handbookTopics.node;
        const item = list[Math.floor(Math.random() * list.length)];
        this.selectTopic(item.id);
      } else {
        const pool = this.activeQuestionsTab === 'js' ? this.jsQuestions : this.nodeQuestions;
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        this.searchQuery = '';
        this.selectedCategory = 'all';
        this.activeFilter = 'all';
        const searchInput = document.getElementById('sidebar-search-input');
        if (searchInput) searchInput.value = '';
        document.querySelectorAll('.quick-filter-chip').forEach(c => c.classList.toggle('active', c.getAttribute('data-filter') === 'all'));
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
    }

    updateDashboardStats() {
      const stats = this.dashboardState.getStats(this.jsQuestions, this.nodeQuestions);
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

      const badgeJs = document.getElementById('tab-badge-js');
      const badgeNode = document.getElementById('tab-badge-node');
      if (badgeJs) badgeJs.textContent = '24';
      if (badgeNode) badgeNode.textContent = '35';
    }
  }

  // Export to window for standalone compatibility
  window.InterviewApp = InterviewApp;
})();
