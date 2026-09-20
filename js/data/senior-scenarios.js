// ==========================================================================
// Senior-Level (8+ Years Experience) Production Scenarios & Architecture Lab
// Real-world debugging, triage playbooks, system design, and fault recovery
// ==========================================================================

const SENIOR_SCENARIOS = [
  {
    id: 'scenario-latency-spike',
    title: 'API Response Time Suddenly Spiked from 30ms to 8,000ms. How do you investigate?',
    tags: ['Performance', 'Event Loop', 'CPU Profiling', 'Flame Graphs'],
    difficulty: '🔴 Advanced',
    problemStatement: 'In production, your payment checkout microservice normally serves requests in 30ms (p99: 80ms). During a flash sale, latency jumps to 8,000ms across all instances while database CPU remains at 15%. What is your systematic investigation procedure?',
    investigationSteps: [
      {
        step: '1. Check Event Loop Lag & CPU Usage',
        detail: 'Look at Prometheus/Datadog metrics for `nodejs_eventloop_lag_seconds`. If lag is high (e.g. >500ms) and host CPU is 100%, code on the main thread is blocking synchronously.'
      },
      {
        step: '2. Capture CPU Profile & Flame Graph',
        detail: 'Run `node --cpu-prof` or trigger an on-demand v8 CPU profile via Chrome DevTools protocol. Inspect the Flame Graph to identify the widest tower (the function consuming 80%+ execution time).'
      },
      {
        step: '3. Common Root Causes to Validate',
        detail: 'A. Catastrophic ReDoS in user input validation (nested regex quantifiers).\nB. Giant `JSON.parse()` or `JSON.stringify()` on 50MB payloads.\nC. Synchronous cryptographic operations (e.g. `bcrypt.hashSync`).\nD. Massive unpaginated DB query loading 200,000 rows into JS memory at once.'
      },
      {
        step: '4. Triage & Mitigation',
        detail: 'If ReDoS, replace pattern with Google `re2` engine or linear validation. If CPU computation, offload to a pre-warmed Worker Thread pool (`piscina`). Add upstream rate limiting.'
      }
    ],
    interviewPitch: 'I check Event Loop Lag first. If event loop lag is high, it is a synchronous CPU block—I capture a CPU profile and flame graph to locate the offending function (typically ReDoS or heavy JSON parsing). If event loop lag is low but latency is high, the bottleneck is downstream I/O (database lock contention or network socket saturation).'
  },

  {
    id: 'scenario-memory-leak',
    title: 'Node.js Process Memory Keeps Increasing (OOM Kills). How do you debug it?',
    tags: ['Memory Leaks', 'V8 Heap', 'Heap Snapshots', 'Garbage Collection'],
    difficulty: '🔴 Advanced',
    problemStatement: 'Your Kubernetes pods start with 150MB RSS memory, but climb steadily by 50MB/hour until reaching the 2GB container limit and getting killed by OOMKiller (Exit 137). How do you pinpoint the exact memory leak?',
    investigationSteps: [
      {
        step: '1. Capture Differential Heap Snapshots',
        detail: 'Expose Node inspector (`--inspect`) or use `v8.writeHeapSnapshot()`. Take Snapshot #1 after deployment, Snapshot #2 30 minutes later, and Snapshot #3 60 minutes later under steady synthetic traffic.'
      },
      {
        step: '2. Compare Snapshots in Chrome DevTools',
        detail: 'Load both snapshots into Chrome DevTools Memory tab. Switch the perspective to "Comparison" and sort by "Size Delta" and "# Delta". Look for object types whose count grows monotonically.'
      },
      {
        step: '3. Inspect the Retainer Tree',
        detail: 'Click on the growing object constructor. Look at the "Retainers" panel to see WHO is holding the reference and preventing Garbage Collection. Tracing up the root will lead to the GC root.'
      },
      {
        step: '4. Usual Production Culprits',
        detail: 'A. Forgotten EventEmitter listeners (attached on every request without `removeListener`).\nB. Unbounded in-memory cache objects (`const cache = {}` without LRU expiration).\nC. Closures capturing `req` and `res` in long-lived background timers.'
      }
    ],
    interviewPitch: 'I capture 3 heap snapshots over time, compare them in Chrome DevTools to find monotonically growing constructors, and inspect the Retainer Tree to identify the GC Root keeping the objects alive—usually an unbounded in-memory cache, unremoved EventEmitter listeners, or leaky closures.'
  },

  {
    id: 'scenario-10k-concurrency',
    title: 'How would you architect Node.js to handle 10,000 concurrent requests?',
    tags: ['Scalability', 'System Design', 'PgBouncer', 'Reverse Proxy'],
    difficulty: '🔴 Advanced',
    problemStatement: 'A flash sale event expects 10,000 requests per second. Node.js is single-threaded. How do you design and configure the infrastructure and runtime to serve this traffic reliably with sub-100ms latency?',
    investigationSteps: [
      {
        step: '1. Multi-Core Utilization & Pod Scaling',
        detail: 'Deploy Node.js inside Kubernetes across multiple pods (or Cluster module), sizing replicas to utilize all available CPU cores. Use a fast reverse proxy (NGINX / Envoy) to handle SSL termination, HTTP/2 multiplexing, and round-robin load balancing.'
      },
      {
        step: '2. Database Connection Pooling with PgBouncer',
        detail: 'Never let 50 Node.js pods each open 50 connections to PostgreSQL (2,500 connections will crash the DB). Place PgBouncer in transaction pooling mode between Node and Postgres to multiplex thousands of API queries into 50 physical DB connections.'
      },
      {
        step: '3. Redis Cache-Aside & Rate Limiting',
        detail: 'Cache static product details in Redis cluster with TTL jitter. Implement sliding window rate limiting in Redis via Lua scripts to drop abusive bot traffic at the API boundary.'
      },
      {
        step: '4. Non-blocking Code & Fastify Migration',
        detail: 'Ensure zero sync disk/crypto operations on main event loop. Consider replacing Express with Fastify (utilizing JSON schema compilation) for a 3x throughput boost.'
      }
    ],
    interviewPitch: 'I scale horizontally with Kubernetes pods matching CPU core count, place NGINX for SSL termination upstream, insert PgBouncer to prevent DB connection starvation, cache hot queries in Redis with stampede mutex locks, and enforce non-blocking asynchronous streaming.'
  },

  {
    id: 'scenario-caching-stampede',
    title: 'How do you design a high-throughput caching layer and prevent Cache Stampede?',
    tags: ['Redis', 'Caching', 'Thundering Herd', 'Distributed Locks'],
    difficulty: '🔴 Advanced',
    problemStatement: 'A hot product catalog key in Redis expires. Instantly, 50,000 concurrent requests encounter a cache miss and execute identical expensive SQL queries on PostgreSQL, causing the database CPU to hit 100% and time out.',
    investigationSteps: [
      {
        step: '1. The Problem (Thundering Herd / Stampede)',
        detail: 'When high-frequency cache keys expire, simultaneous requests bypass the cache and hammer the primary database simultaneously.'
      },
      {
        step: '2. Distributed Mutex Lock (SET key val NX EX)',
        detail: 'When a cache miss occurs, the first request attempts an atomic lock in Redis: `SET lock:product:123 token NX EX 5`. The lock owner queries the DB and updates Redis. All other 49,999 requests wait 50ms and read the freshly populated cache.'
      },
      {
        step: '3. TTL Jitter (Randomized Expiration)',
        detail: 'Never cache 100,000 items with identical 3600s TTLs. Add jitter: `TTL = 3600 + Math.floor(Math.random() * 300)`. This scatters expirations over 5 minutes, preventing simultaneous cache drops.'
      },
      {
        step: '4. Probabilistic Early Recomputation (XFetch)',
        detail: 'Background workers recompute and refresh the cache shortly before actual expiration based on probability `-(beta * delta * ln(random())) > TTL - now`.'
      }
    ],
    interviewPitch: 'I employ the Cache-Aside pattern with two critical safeguards: distributed mutex locking via Redis SETNX so only one worker queries the database on a miss, and TTL jitter to prevent simultaneous cluster-wide cache expiration.'
  },

  {
    id: 'scenario-graceful-shutdown',
    title: 'How do you implement Graceful Shutdown in a Kubernetes Node.js service?',
    tags: ['DevOps', 'Kubernetes', 'SIGTERM', 'Socket Draining'],
    difficulty: '🔴 Advanced',
    problemStatement: 'During rolling deployments in Kubernetes, users report dropped requests, incomplete payments, and 502 Bad Gateway errors. How do you implement zero-downtime graceful shutdown in Node.js?',
    investigationSteps: [
      {
        step: '1. Trap SIGTERM Signal',
        detail: 'Kubernetes sends `SIGTERM` when terminating a pod. Attach a signal listener: `process.on(\'SIGTERM\', handleShutdown)`.'
      },
      {
        step: '2. Stop Accepting New Traffic & Drain Sockets',
        detail: 'Call `server.close()`. This stops listening for new HTTP connections while allowing existing in-flight HTTP requests to complete.'
      },
      {
        step: '3. Flush Queues & Close DB Connection Pools',
        detail: 'Wait for in-flight database transactions to commit/rollback. Explicitly drain and close the database pool: `await dbPool.end()`. Disconnect Redis and Kafka consumers cleanly.'
      },
      {
        step: '4. Safety Timeout & PID 1 Container Init',
        detail: 'Set a hard safety timeout: `setTimeout(() => process.exit(1), 25000)`. If in-flight sockets hang, exit before Kubernetes issues a brutal `SIGKILL` (default 30s). Ensure the container uses `dumb-init` or `tini` as PID 1 to ensure signals forward properly.'
      }
    ],
    interviewPitch: 'I trap SIGTERM, call server.close() to reject new connections while allowing in-flight requests to complete, wait for active transactions to commit before calling dbPool.end(), and set a 25-second fallback safety timeout using dumb-init as PID 1.'
  },

  {
    id: 'scenario-idempotency',
    title: 'How do you prevent duplicate transaction processing in asynchronous APIs?',
    tags: ['Architecture', 'Idempotency', 'Kafka', 'Redis'],
    difficulty: '🔴 Advanced',
    problemStatement: 'Due to network timeouts or client double-clicks, a customer\'s credit card charge request or order submission API is called twice with the same payload. How do you guarantee idempotency?',
    investigationSteps: [
      {
        step: '1. Client-Generated Idempotency Key',
        detail: 'Require a unique UUID in the HTTP header: `Idempotency-Key: 7b8e1a-4c2d-...` for all mutation endpoints (POST/PATCH).'
      },
      {
        step: '2. Atomic Redis Lock & Status Tracking',
        detail: 'Check Redis with `SET key { status: "PROCESSING" } NX EX 120`. If the key already exists and is PROCESSING, reject with 409 Conflict ("Transaction in progress").'
      },
      {
        step: '3. Cache Completed Response',
        detail: 'Once the payment gateway confirms the transaction, update the Redis key with `{ status: "COMPLETED", response: {...} }` with a 24-hour TTL. Return the saved response directly on any subsequent duplicate retry without re-charging the card.'
      },
      {
        step: '4. Database Unique Constraints',
        detail: 'Add a unique database index on `(user_id, idempotency_key)` to provide a final safety guarantee at the ACID database layer against race conditions.'
      }
    ],
    interviewPitch: 'I implement Stripe-style idempotency: require an Idempotency-Key header, use Redis atomic SETNX to lock and track state (PROCESSING vs COMPLETED), cache the response for replay, and back it with a unique database constraint.'
  }
];

if (typeof window !== 'undefined') {
  window.SENIOR_SCENARIOS = SENIOR_SCENARIOS;
}
