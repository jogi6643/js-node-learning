// ==========================================================================
// Interactive System Architecture Diagrams & Flow Definitions
// Libuv, Redis Caching, Kafka, JWT Rotation, Circuit Breaker, Rate Limiter
// ==========================================================================

export const DIAGRAMS_DATA = {
  'libuv-arch': {
    title: 'Node.js & Libuv Thread Pool Architecture',
    description: 'Understanding how single-threaded V8 coordinates with OS async syscalls (epoll/kqueue) and the internal C++ libuv thread pool (UV_THREADPOOL_SIZE).',
    steps: [
      {
        id: 'step-1',
        title: 'Application Call (V8 Engine)',
        desc: 'Node.js code calls an async function like fs.readFile() or crypto.pbkdf2(). V8 converts the JS function call into Node.js C++ bindings.',
        activeNodes: ['node-v8', 'node-bindings']
      },
      {
        id: 'step-2',
        title: 'Libuv Routing Decision',
        desc: 'Libuv checks the operation type. Network sockets (net, http) delegate directly to OS non-blocking kernel mechanisms (epoll on Linux, kqueue on macOS). File I/O, DNS lookup, and crypto tasks are routed to the Libuv Worker Thread Pool.',
        activeNodes: ['node-bindings', 'node-libuv']
      },
      {
        id: 'step-3',
        title: 'Thread Pool Execution (Default: 4 Threads)',
        desc: 'A worker thread picks up the blocking file read or crypto hash. The main event loop remains 100% free to process concurrent HTTP requests.',
        activeNodes: ['node-libuv', 'node-threadpool']
      },
      {
        id: 'step-4',
        title: 'Callback Queuing to Event Loop',
        desc: 'When the thread completes, it notifies Libuv. Libuv places the completion callback onto the Event Loop Poll phase queue.',
        activeNodes: ['node-threadpool', 'node-eventloop']
      },
      {
        id: 'step-5',
        title: 'V8 Execution on Main Stack',
        desc: 'The main thread dequeues the callback and executes the JS user code on the Call Stack.',
        activeNodes: ['node-eventloop', 'node-v8']
      }
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
      {
        id: 'step-1',
        title: 'Client Request Arrival',
        desc: 'Incoming HTTP request for GET /api/v1/products/4521 hits Node.js service.',
        activeNodes: ['node-client', 'node-api']
      },
      {
        id: 'step-2',
        title: 'Cache Lookup (Redis GET)',
        desc: 'Node.js queries Redis with key `product:4521`. If Cache HIT, data returns in <1ms directly to client. If Cache MISS, proceeding to Step 3.',
        activeNodes: ['node-api', 'node-redis']
      },
      {
        id: 'step-3',
        title: 'Acquire Mutex Lock (SET key val NX EX 5)',
        desc: 'To prevent 10,000 concurrent requests from hitting PostgreSQL simultaneously, the first request acquires an atomic lock in Redis with a 5s TTL.',
        activeNodes: ['node-redis', 'node-api']
      },
      {
        id: 'step-4',
        title: 'Database Query (PostgreSQL / Replica)',
        desc: 'The single lock owner fetches the product from the database index. All concurrent requests wait/sleep 50ms and retry Redis lookup.',
        activeNodes: ['node-api', 'node-db']
      },
      {
        id: 'step-5',
        title: 'Populate Cache & Release Lock',
        desc: 'Data is written to Redis with a randomized TTL (e.g., 3600s + Math.random()*300s to avoid sync expiration). Mutex lock is deleted. Response sent to client.',
        activeNodes: ['node-api', 'node-redis', 'node-client']
      }
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
      {
        id: 'step-1',
        title: 'Event Publishing (Producer)',
        desc: 'Order Service creates an `order_placed` event. It specifies the partition key `customerId` so orders for the same user land in the exact same partition in order.',
        activeNodes: ['node-producer', 'node-topic']
      },
      {
        id: 'step-2',
        title: 'Partition Assignment & Append',
        desc: 'Kafka Broker computes `hash(customerId) % numPartitions` and writes the message to Partition #2 commit log on disk with zero-copy page cache.',
        activeNodes: ['node-topic', 'node-partition']
      },
      {
        id: 'step-3',
        title: 'Consumer Group Pull',
        desc: 'Payment Service Consumer (part of Consumer Group `payment-workers`) polls Partition #2. Heartbeat thread keeps consumer alive to prevent rebalance storm.',
        activeNodes: ['node-partition', 'node-consumer']
      },
      {
        id: 'step-4',
        title: 'Business Logic & Manual Offset Commit',
        desc: 'Payment is charged via Stripe API. After successful DB write, Node.js explicitly commits the offset (`consumer.commitOffsets()`) to ensure at-least-once processing.',
        activeNodes: ['node-consumer', 'node-db']
      }
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
      {
        id: 'step-1',
        title: 'Login & Token Issuance',
        desc: 'User logs in with credentials. Node.js issues a short-lived Access Token (RS256 signed, 15m) in response JSON and a cryptographically random Refresh Token (7 days) stored in Redis with user family ID.',
        activeNodes: ['node-user', 'node-auth']
      },
      {
        id: 'step-2',
        title: 'Resource Access with Access Token',
        desc: 'Client sends Access Token in `Authorization: Bearer <token>`. Resource server verifies RS256 signature using public key without DB lookup. Fast & stateless.',
        activeNodes: ['node-user', 'node-api']
      },
      {
        id: 'step-3',
        title: 'Access Token Expiry (401 Unauthorized)',
        desc: 'After 15 minutes, access token expires. Resource API rejects with 401 TOKEN_EXPIRED.',
        activeNodes: ['node-api', 'node-user']
      },
      {
        id: 'step-4',
        title: 'Refresh Token Rotation with Reuse Detection',
        desc: 'Client automatically posts Refresh Token to `/auth/refresh`. Auth server checks Redis. If token was ALREADY used before, an attacker stole it: invalidate ALL tokens for that user immediately! Otherwise, issue new Access Token and new rotated Refresh Token.',
        activeNodes: ['node-user', 'node-auth', 'node-session-store']
      }
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
      {
        id: 'step-1',
        title: 'CLOSED State (Normal Operation)',
        desc: 'All requests to Payment Gateway pass through normally. Circuit breaker tracks success/failure metrics over a sliding window (e.g. 50 requests).',
        activeNodes: ['node-breaker-closed', 'node-gateway']
      },
      {
        id: 'step-2',
        title: 'Threshold Breached (e.g., 50% Failures)',
        desc: 'Downstream gateway starts timing out or returning 503s. The failure threshold is exceeded. Circuit breaker automatically trips to OPEN.',
        activeNodes: ['node-breaker-closed', 'node-breaker-open']
      },
      {
        id: 'step-3',
        title: 'OPEN State (Fail-Fast Protection)',
        desc: '100% of subsequent requests are immediately rejected or routed to a fallback function (e.g., queued for later retry) without touching the failing gateway. Prevents thread/socket pool exhaustion in Node.js.',
        activeNodes: ['node-breaker-open', 'node-fallback']
      },
      {
        id: 'step-4',
        title: 'HALF-OPEN State (Trial Probing)',
        desc: 'After a cooldown resetTimeout (e.g., 30s), breaker transitions to HALF-OPEN. It allows a small sample of canary requests through to check if gateway recovered.',
        activeNodes: ['node-breaker-half', 'node-gateway']
      },
      {
        id: 'step-5',
        title: 'Recovery or Trip Back',
        desc: 'If trial requests succeed, the breaker resets to CLOSED and resumes normal traffic. If they fail, it immediately trips back to OPEN for another cooldown period.',
        activeNodes: ['node-breaker-half', 'node-breaker-closed']
      }
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
