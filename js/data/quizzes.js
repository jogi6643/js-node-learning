// ==========================================================================
// Senior Practice Center: MCQs, Output Questions & Production Debugging Scenarios
// ==========================================================================

export const MCQS_DATA = [
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

export const OUTPUT_QUESTIONS = [
  {
    id: 'out-1',
    title: 'Event Loop Execution Priority: nextTick vs Promise vs Timer',
    code: `console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

process.nextTick(() => console.log('4'));

console.log('5');`,
    expectedOutput: `1
5
4
3
2`,
    explanation: '1 and 5 execute synchronously on the call stack. Once the stack empties, microtasks execute: process.nextTick has highest priority (4), followed by Promise microtasks (3). Finally, the event loop enters the Timers macrotask phase executing setTimeout (2).'
  },
  {
    id: 'out-2',
    title: 'Closure & Var vs Let inside Asynchronous Loops',
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var:', i), 0);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let:', j), 0);
}`,
    expectedOutput: `var: 3
var: 3
var: 3
let: 0
let: 1
let: 2`,
    explanation: '`var` is function-scoped; by the time the setTimeout callbacks execute, the single shared `i` variable has been incremented to 3. `let` is block-scoped, creating a fresh lexical binding for each loop iteration captured by the closure.'
  },
  {
    id: 'out-3',
    title: 'Async/Await Execution Order with Sequential Microtasks',
    code: `async function async1() {
  console.log('A');
  await async2();
  console.log('B');
}

async function async2() {
  console.log('C');
}

console.log('D');
async1();
console.log('E');`,
    expectedOutput: `D
A
C
E
B`,
    explanation: 'Synchronous "D" logs first. `async1()` is invoked, printing "A". `async2()` is called synchronously, printing "C". The `await` suspends `async1` and queues continuation "B" as a microtask. Main script finishes with "E". Microtask drains, printing "B".'
  }
];

export const SCENARIOS_DATA = [
  {
    id: 'scen-1',
    title: 'Production Outage: Node.js API Pods Crashing with OOM Every 3 Hours',
    symptoms: 'Kubernetes alerts show pods running at 99% memory before being killed by OOMKiller (Exit code 137). Restarting pods temporarily fixes the issue, but memory climbs linearly back to 2GB.',
    investigation: 'Engineers ran `node --inspect` and captured 3 heap snapshots 20 minutes apart during load testing. The comparison view showed that the retainer tree for an internal EventEmitter in a WebSocket tracking service was holding 450,000 disconnected client objects.',
    rootCause: 'Event listeners were registered via `socket.on(\'message\', ...)` but custom telemetry listeners attached to the global event emitter were never removed on socket `disconnect`. Each disconnected socket remained retained by the global emitter root.',
    fix: 'Use `emitter.once()` or explicitly call `emitter.removeListener()` in the socket `disconnect` handler. Alternatively, manage listener cleanup with `AbortSignal` (`{ signal: controller.signal }`).'
  },
  {
    id: 'scen-2',
    title: 'Production Outage: Event Loop Freeze (100% CPU) During JWT Verification Spike',
    symptoms: 'During a flash sale, API latency spiked from 15ms to 12,000ms. CPU usage hit 100% across all 8 cores. Health checks failed, causing Kubernetes to enter a restart cascade.',
    investigation: 'Taking a CPU profile (`node --cpu-prof`) and viewing the flame graph revealed that 85% of CPU time was trapped inside an unoptimized Regular Expression verifying customer email inputs, triggering catastrophic ReDoS backtracking on certain input patterns.',
    rootCause: 'A regex pattern `^([a-zA-Z0-9_.-]+)+@([a-zA-Z0-9_.-]+)+$` contained nested quantifiers, causing exponential backtracking on non-matching strings of 40+ characters.',
    fix: 'Replaced custom regex with `validator.isEmail` and wrapped pattern evaluation with Google’s `re2` engine, which guarantees linear O(N) evaluation time without backtracking.'
  },
  {
    id: 'scen-3',
    title: 'Production Outage: PostgreSQL Connection Pool Starvation Under 400 RPS',
    symptoms: 'API endpoints started throwing `TimeoutError: ResourceRequest timed out` after 30 seconds of high traffic. Database CPU was only at 12%, but the Node.js API could not serve requests.',
    investigation: 'Inspected active pool metrics: `pool.waitingCount` was over 800 while `pool.idleCount` was 0. A review of recent commits revealed a newly added payment reconciliation endpoint.',
    rootCause: 'The new endpoint called `const client = await pool.connect();` followed by several async operations. One of the async HTTP calls threw an error before `client.query(\'COMMIT\')`, and the author forgot a `finally` block with `client.release()`. The connection was permanently leaked.',
    fix: 'Wrapped the database transaction strictly inside `try ... catch ... finally { client.release(); }`. Added alerting on `pool.waitingCount > 20` to detect connection leaks before starvation occurs.'
  }
];
