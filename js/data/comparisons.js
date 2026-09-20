// ==========================================================================
// 10 Core Concept Comparison Matrices
// Technical accuracy, clear criteria, and interview-focused differentiators
// ==========================================================================

const COMPARISONS_DATA = [
  {
    id: 'var-let-const',
    title: 'var vs let vs const',
    description: 'Scope, hoisting, temporal dead zone, and reassignment rules in modern JavaScript.',
    headers: ['Feature / Criteria', 'var', 'let', 'const'],
    rows: [
      ['Scope', 'Function-scoped (or globally scoped)', 'Block-scoped (`{ ... }`)', 'Block-scoped (`{ ... }`)'],
      ['Hoisting Behavior', 'Hoisted & initialized to `undefined`', 'Hoisted but in uninitialized TDZ state', 'Hoisted but in uninitialized TDZ state'],
      ['Temporal Dead Zone (TDZ)', 'No TDZ (returns `undefined` if read early)', 'Yes (throws `ReferenceError` if read early)', 'Yes (throws `ReferenceError` if read early)'],
      ['Reassignment', 'Allowed (`a = 1; a = 2;`)', 'Allowed (`b = 1; b = 2;`)', 'Disallowed (throws `TypeError: Assignment to constant`)'],
      ['Redeclaration in Same Scope', 'Allowed without error', 'Disallowed (SyntaxError)', 'Disallowed (SyntaxError)'],
      ['Global Object Property', 'Attaches to `window`/`globalThis`', 'Does NOT attach to `window`', 'Does NOT attach to `window`'],
      ['Object Mutation', 'N/A', 'N/A', 'Properties of objects remain mutable unless `Object.freeze()` is used']
    ],
    interviewTakeaway: 'Always use `const` by default for immutable bindings, `let` only when values must be reassigned (loops/accumulators), and never use `var` in modern production code to avoid accidental scope leakages and hoisting bugs.'
  },

  {
    id: 'promise-async-await',
    title: 'Promise (.then) vs Async/Await',
    description: 'Syntactic sugar, readability, error handling, and debugging trade-offs in asynchronous workflows.',
    headers: ['Feature / Criteria', 'Promise (.then / .catch)', 'Async / Await'],
    rows: [
      ['Syntax & Style', 'Chaining callbacks (`.then().catch()`)', 'Synchronous-looking flat code with `await`'],
      ['Underlying Mechanism', 'State machine (Pending, Fulfilled, Rejected)', 'Built on top of Promises + ES6 Generator functions'],
      ['Error Handling', 'Handled via `.catch()` callback', 'Handled using standard `try { ... } catch (err) { ... }`'],
      ['Chained Dependencies', 'Can become unwieldy ("Promise waterfall" or nesting)', 'Clean sequential execution without callback nesting'],
      ['Debugging & Stack Traces', 'Stack traces can be disjointed across `.then` callbacks', 'Clean, contiguous stack traces matching synchronous code flow'],
      ['Concurrent Execution', '`Promise.all([p1, p2])`', '`await Promise.all([p1, p2])` (still requires Promise combinator)'],
      ['Return Value', 'Returns a `Promise` instance', 'An `async` function always implicitly wraps return in a `Promise`']
    ],
    interviewTakeaway: '`async/await` is syntactic sugar over Promises that improves code readability and debugging. However, remember to await Promise.all() for independent async tasks rather than awaiting sequentially, which creates artificial waterfalls.'
  },

  {
    id: 'callback-promise',
    title: 'Callback vs Promise',
    description: 'Evolution of asynchronous flow control, inversion of control, and composability.',
    headers: ['Feature / Criteria', 'Callback', 'Promise'],
    rows: [
      ['Definition', 'A function passed into another function to be invoked later', 'An object representing the eventual completion or failure of an async operation'],
      ['Inversion of Control', 'High risk: caller trusts the callee to invoke the callback exactly once', 'Eliminated: Promise guarantees exactly-once resolution (immutable settled state)'],
      ['Readability', 'Prone to "Callback Hell" / "Pyramid of Doom" when deeply nested', 'Linear chaining via `.then()`, flattens async pipelines'],
      ['Error Propagation', 'Must pass `err` as first argument manually (`(err, data) => ...`)', 'Automatic error bubbling down the chain until a `.catch()` is encountered'],
      ['Composition', 'Difficult to compose (manual counters for parallel tasks)', 'Native combinators: `Promise.all`, `allSettled`, `race`, `any`'],
      ['Standardization', 'Node.js convention (error-first callback pattern)', 'ECMAScript official standard (ES6+), native Promises/A+ spec']
    ],
    interviewTakeaway: 'Promises solve the two fundamental flaws of callbacks: Inversion of Control (untrustworthy execution timing/multi-execution) and Callback Hell (uncomposable deeply nested code).'
  },

  {
    id: 'microtask-macrotask',
    title: 'Microtask vs Macrotask (Task)',
    description: 'Execution priority, queue draining mechanics, and event loop timing in JavaScript runtime.',
    headers: ['Feature / Criteria', 'Microtask Queue', 'Macrotask (Task) Queue'],
    rows: [
      ['Examples', '`Promise.then`, `queueMicrotask`, `process.nextTick` (Node.js)', '`setTimeout`, `setInterval`, `setImmediate` (Node.js), I/O, UI rendering'],
      ['Execution Priority', 'High Priority: Drained completely after every call stack frame', 'Lower Priority: Only 1 task dequeued per event loop cycle before checking microtasks again'],
      ['Queue Draining Rule', 'Entire queue is drained to completion, including newly scheduled microtasks', 'Dequeued one-at-a-time (Browser) or phase-by-phase (Node.js Libuv)'],
      ['Starvation Hazard', 'Yes: A recursive microtask loop completely starves I/O and timers', 'Low: Gives breathing room to other queues between loop iterations'],
      ['Rendering Impact (Browser)', 'Executes BEFORE the browser paints/renders frames', 'Executes AFTER render steps in subsequent loop ticks']
    ],
    interviewTakeaway: 'Microtasks always execute before the next macrotask. If a microtask schedules another microtask, both execute in the same tick. Never run CPU-heavy recursive loops inside microtasks.'
  },

  {
    id: 'browser-node-event-loop',
    title: 'Browser Event Loop vs Node.js Event Loop',
    description: 'HTML5 event loop specification vs Libuv multi-phase C++ event loop architecture.',
    headers: ['Feature / Criteria', 'Browser Event Loop', 'Node.js Event Loop (Libuv)'],
    rows: [
      ['Underlying Engine', 'Browser engine implementation (HTML5 Event Loop spec)', 'Libuv C++ cross-platform asynchronous I/O library'],
      ['Phases Structure', 'Simple model: Call Stack -> Microtasks -> 1 Macrotask -> Render', '6 distinct Libuv phases: Timers -> Pending -> Idle -> Poll -> Check -> Close'],
      ['UI Rendering', 'Coordinates rendering, repaint, and reflow ticks with display refresh', 'No UI rendering; focused purely on network sockets, file I/O, and IPC'],
      ['Immediate Scheduling', 'No `setImmediate()`; uses `queueMicrotask` or `requestAnimationFrame`', 'Has dedicated `setImmediate()` that runs in the Check phase after Poll'],
      ['Special Microtask', 'Standard `queueMicrotask` and Promises', 'Has `process.nextTick()` which runs in its own VIP queue before standard Promises'],
      ['I/O Processing', 'Delegated to Web APIs (Fetch, DOM events, Geolocation)', 'Delegated to OS kernel (`epoll`/`kqueue`) or Libuv Thread Pool (fs, crypto)']
    ],
    interviewTakeaway: 'The Browser Event Loop coordinates task execution with UI rendering ticks, whereas the Node.js Event Loop is driven by Libuv with 6 distinct phases optimized for non-blocking network and disk I/O.'
  },

  {
    id: 'cjs-vs-esm',
    title: 'CommonJS (CJS) vs ES Modules (ESM)',
    description: 'Syntax, synchronous vs asynchronous resolution, tree-shaking, and static analysis.',
    headers: ['Feature / Criteria', 'CommonJS (CJS)', 'ES Modules (ESM)'],
    rows: [
      ['Syntax', '`const x = require("./x")` / `module.exports = ...`', '`import x from "./x"` / `export default ...`'],
      ['Loading Mechanism', 'Synchronous loading at runtime', 'Asynchronous loading with static analysis at compile/parse time'],
      ['Tree Shaking', 'Cannot be reliably tree-shaken (dynamic exports)', 'Natively tree-shaken by modern bundlers (Webpack, Vite, Rollup)'],
      ['Top-Level Await', 'Not supported natively (must wrap in async IIFE)', 'Supported natively in modern Node.js and browsers'],
      ['File Extension / Node flag', '`.cjs` or `"type": "commonjs"` in `package.json`', '`.mjs` or `"type": "module"` in `package.json`'],
      ['Built-in Variables', 'Has `__dirname` and `__filename` available', 'No `__dirname`; use `import.meta.url` with `fileURLToPath`'],
      ['Cyclic Dependencies', 'Returns partial/incomplete export copy at moment of loop', 'Handles cycles via live bindings without undefined references']
    ],
    interviewTakeaway: 'ESM is the official ECMAScript standard that enables static analysis and tree-shaking. CJS remains widespread in legacy Node.js codebases, but modern projects standardize on ESM.'
  },

  {
    id: 'process-vs-thread',
    title: 'Process vs Thread',
    description: 'Operating system isolation, memory allocation, context switching, and communication.',
    headers: ['Feature / Criteria', 'Process', 'Thread'],
    rows: [
      ['Memory Space', 'Completely isolated memory; one process cannot touch another process RAM', 'Shares the same memory space and heap with other threads in the same process'],
      ['Creation Overhead', 'Heavy: Requires OS to allocate new virtual address space and PID', 'Lightweight: Reuses parent process address space'],
      ['Crash Isolation', 'High: If one process crashes, other processes remain completely unharmed', 'Low: An uncaught segmentation fault or fatal error crashes the whole process'],
      ['Communication (IPC)', 'Requires Inter-Process Communication (Sockets, Pipes, IPC channels)', 'Fast: Read/write shared memory directly (e.g. `SharedArrayBuffer`)'],
      ['Node.js Primitive', '`child_process` (`fork`, `spawn`) and `cluster` module', '`worker_threads` (`Worker`, `parentPort`, `workerData`)'],
      ['Context Switching Cost', 'High: Involves CPU page table changes and cache invalidation', 'Low: Only registers and stack pointers are switched']
    ],
    interviewTakeaway: 'Processes offer total crash isolation at the cost of higher memory overhead (e.g., Cluster), while Threads share memory for ultra-fast, lightweight data processing (e.g., Worker Threads) but risk shared-state concurrency bugs.'
  },

  {
    id: 'cluster-vs-worker-threads',
    title: 'Cluster vs Worker Threads in Node.js',
    description: 'Multi-core CPU scaling strategy: multi-processing for I/O vs multi-threading for CPU compute.',
    headers: ['Feature / Criteria', 'Cluster Module', 'Worker Threads (`worker_threads`)'],
    rows: [
      ['Core Purpose', 'Scale network throughput across all CPU cores for I/O requests', 'Offload CPU-intensive computation away from the main event loop'],
      ['Architecture', 'Multiple independent Node.js processes sharing server ports', 'Lightweight threads within a single Node.js process sharing process memory'],
      ['Memory Usage', 'High: Each worker process has an isolated ~30MB base V8 heap', 'Low: Shared memory space; can pass zero-copy `SharedArrayBuffer`'],
      ['Port Sharing', 'Master process binds port 3000 and hands off sockets via round-robin', 'Threads do NOT listen on network ports directly; they compute data for main thread'],
      ['Fault Tolerance', 'High: If one worker process crashes, other worker processes keep serving', 'Medium: Unhandled native crash in worker can take down the parent process'],
      ['Best Use Case', 'HTTP APIs, Express/Fastify REST servers, WebSockets gateway', 'Image resizing, crypto hashing, PDF generation, machine learning, sorting big arrays']
    ],
    interviewTakeaway: 'Use Cluster (or Kubernetes replica pods) to scale network I/O concurrency across CPU cores. Use Worker Threads strictly for CPU-intensive mathematical or transform operations that would otherwise block the main event loop.'
  },

  {
    id: 'settimeout-vs-setimmediate',
    title: 'setTimeout(fn, 0) vs setImmediate(fn)',
    description: 'Libuv phase execution, minimum timer thresholds, and determinism inside I/O cycles.',
    headers: ['Feature / Criteria', '`setTimeout(fn, 0)`', '`setImmediate(fn)`'],
    rows: [
      ['Libuv Phase', 'Executed in the **Timers Phase** at the start of the loop', 'Executed in the **Check Phase** immediately following the Poll phase'],
      ['Minimum Delay', 'Clamped internally by Node.js to ~1ms (0ms is invalid per spec)', 'Runs on the very next iteration of the loop without artificial delay'],
      ['Execution Order in Main Module', 'Non-deterministic: Depends on OS timer resolution and system load', 'Non-deterministic when called in top-level synchronous code'],
      ['Execution Order inside I/O Callback', 'Always runs SECOND (must wait for the next tick Timers phase)', 'Always runs FIRST (Poll phase transitions directly into Check phase)'],
      ['Starvation Risk', 'Cannot starve I/O; timers are bounded by thresholds', 'Cannot starve I/O; executes queued immediate callbacks once per tick']
    ],
    interviewTakeaway: 'Inside any I/O cycle (e.g. fs.readFile or HTTP callback), `setImmediate` is guaranteed to execute before `setTimeout(fn, 0)` because the event loop moves from the Poll phase directly to the Check phase.'
  },

  {
    id: 'nexttick-vs-promise',
    title: 'process.nextTick() vs Promise.then()',
    description: 'Node.js microtask priority queues, starvation mechanics, and design patterns.',
    headers: ['Feature / Criteria', '`process.nextTick()`', '`Promise.then()` (Microtask)'],
    rows: [
      ['Queue Ownership', 'Maintained by Node.js runtime directly in a dedicated tick queue', 'Maintained by Google V8 engine in the standard ECMAScript microtask queue'],
      ['Priority Order', 'Highest Priority: Drains BEFORE any Promise microtask', 'Drains immediately after the `process.nextTick` queue is completely empty'],
      ['Environment Support', 'Node.js only (not available in standard browsers)', 'Universal: Supported in all modern browsers and Node.js'],
      ['Starvation Risk', 'Extreme: Recursive `process.nextTick` locks the event loop permanently', 'Extreme: Recursive Promise chaining also locks macrotasks and I/O'],
      ['Recommended Use Case', 'Allowing constructors to emit events after the caller attaches listeners', 'General asynchronous flow control, API calls, and standard business logic']
    ],
    interviewTakeaway: '`process.nextTick` is technically a pre-microtask queue that runs before the Promise microtask queue. It was designed specifically for Node.js event-driven initialization patterns to avoid race conditions.'
  }
];

if (typeof window !== 'undefined') {
  window.COMPARISONS_DATA = COMPARISONS_DATA;
}
