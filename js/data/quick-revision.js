// ==========================================================================
// Quick Revision Cheatsheet Data
// High-yield definitions, patterns, interview traps, and memory cards
// ==========================================================================

const QUICK_REVISION_DATA = {
  jsGoldenRules: [
    {
      title: 'Event Loop Order',
      rule: 'Synchronous Code (Call Stack) → Microtasks (Promises, queueMicrotask) → Macrotasks (setTimeout, setInterval, setImmediate).',
      trap: 'Thinking setTimeout(fn, 0) runs immediately. It must wait for ALL microtasks to clear first!'
    },
    {
      title: 'this Binding Rules',
      rule: '1. new (fresh object) > 2. call/apply/bind (explicit) > 3. obj.method() (implicit) > 4. global/undefined (default).',
      trap: 'Arrow functions DO NOT have their own this and CANNOT be bound using call/apply/bind!'
    },
    {
      title: 'Closure Retention',
      rule: 'Inner functions retain access to outer variables even after the outer function returns.',
      trap: 'Closures capturing large buffers or request objects in long-lived timers will cause memory leaks.'
    },
    {
      title: 'Equality & Coercion',
      rule: 'Always use strict equality ===. Loose equality == coerces operands silently ([] == ![] is true).',
      trap: 'NaN === NaN is false! Always use Number.isNaN().'
    }
  ],

  nodeGoldenRules: [
    {
      title: 'Libuv 6 Phases Sequence',
      rule: 'Timers → Pending Callbacks → Idle/Prepare → Poll (I/O) → Check (setImmediate) → Close Callbacks.',
      trap: 'Inside an I/O callback, setImmediate is guaranteed to execute BEFORE setTimeout(0).'
    },
    {
      title: 'Libuv Thread Pool Usage',
      rule: 'Thread pool handles only 4 operations: File I/O (fs), Crypto, DNS lookups (dns.lookup), and Compression (zlib).',
      trap: 'Believing network requests use the thread pool. Network sockets use native OS epoll/kqueue!'
    },
    {
      title: 'Streams & Backpressure',
      rule: 'Streams process 16KB chunks. Backpressure pauses the readable stream when the writable buffer fills.',
      trap: 'Using .pipe() instead of stream.pipeline(). Legacy .pipe() leaks file descriptors on errors!'
    },
    {
      title: 'Cluster vs Worker Threads',
      rule: 'Cluster forks multiple processes for I/O network scaling; Worker Threads share memory for CPU computation.',
      trap: 'Spawning a new Worker Thread per HTTP request. Always use a pre-warmed thread pool (e.g. piscina).'
    }
  ],

  frequentTraps: [
    {
      question: 'Is Node.js single-threaded?',
      answer: 'JavaScript execution on the main event loop is single-threaded, but the underlying C++ runtime delegates I/O to OS kernel primitives and CPU tasks to the Libuv thread pool.'
    },
    {
      question: 'Why does Promise.all fail fast?',
      answer: 'Promise.all rejects immediately upon the first rejection. For resilient microservice aggregation, use Promise.allSettled() instead.'
    },
    {
      question: 'How do you prevent Cache Stampede in Redis?',
      answer: 'Use distributed mutex locks (SETNX) so only 1 request queries the DB on a miss, and add random TTL jitter to avoid synchronized expiration.'
    },
    {
      question: 'What is the role of PgBouncer between Node.js and PostgreSQL?',
      answer: 'It acts as a connection pool proxy, multiplexing thousands of ephemeral container requests into a small, optimal pool of physical database connections.'
    }
  ]
};

if (typeof window !== 'undefined') {
  window.QUICK_REVISION_DATA = QUICK_REVISION_DATA;
}
