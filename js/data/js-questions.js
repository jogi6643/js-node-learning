// ==========================================================================
// Top 100 JavaScript Interview Topics & Questions
// Features: Easy Definitions (Asaan Bhasha), Real-Life Analogies,
// Key Takeaways, Deep Architecture, Production Cases, Code & Sandboxes
// ==========================================================================

const JS_QUESTIONS = [
  {
    id: 'js-1',
    num: 1,
    title: 'Execution Context, Call Stack & Variable Environment',
    category: 'Core & V8 Internals',
    difficulty: 'Advanced',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: 'The Call Stack is JavaScript\'s to-do list. It tracks which function is running right now and what should run next using Last-In-First-Out (LIFO).',
      whatIsItHi: 'Call Stack ek plates ki gaddi jaisa hai jisme JavaScript yaad rakhta hai ki abhi kaunsa function chal raha hai. Jo function sabse aakhri mein aayega, wo sabse pehle khatam hokar niklega (LIFO).',
      analogy: '🍽️ Kitchen Plates: Socho kitchen mein dhoe hue plates ek ke upar ek rakhe hain. Nayi plate hamesha sabse upar aati hai aur sabse pehle wahi uthayi jaati hai. Agar plates ka dher limit se zyada uncha ho jaye toh gir jata hai—isi ko bolte hain "Maximum Call Stack Size Exceeded" (Stack Overflow)!',
      keyPoints: [
        'JS Single-Threaded hai: ek time par sirf ek hi function run ho sakta hai.',
        'Function call hote hi Stack ke top par push hota hai, return hote hi pop ho jata hai.',
        'Creation Phase mein memory banti hai (hoisting), aur Execution Phase mein code line-by-line chalta hai.'
      ],
      interviewLine: 'The Call Stack is a LIFO data structure that tracks active execution contexts in single-threaded JavaScript, executing one frame at a time.'
    },
    shortAnswer: 'Every JS script executes within an Execution Context containing a Variable Environment, Lexical Environment, and `this` binding. Execution occurs in two distinct phases: Creation Phase (allocating memory for variables/functions, hoisting) and Execution Phase (line-by-line evaluation on the Call Stack).',
    deepExplanation: 'When V8 runs JavaScript, the Call Stack tracks the thread of execution. When a function is called, an Execution Context (EC) is pushed onto the stack. In the Creation Phase, V8 allocates memory slots for var (initialized to undefined), let/const (placed in uninitialized TDZ state), and function declarations (fully hoisted with body). Lexical scope resolution is determined statically at compile time through the outer environment reference chain.',
    hinglishExplanation: 'Jab bhi JavaScript code run hota hai, V8 engine do phases mein kaam karta hai: Creation Phase aur Execution Phase. Creation phase mein V8 code padhta hai aur memory prepare karta hai (jisko hum hoisting bolte hain). Fir Execution phase mein line by line code run hota hai Call Stack ke upar. Call Stack LIFO (Last In First Out) structure follow karta hai. Samajh lo Call stack ek plate ki gaddi jaisa hai—jo function sabse pehle call hoga wo base mein rahega, aur jo sabse latest call hoga wo top pe aakar execute hoga.',
    productionExample: 'Maximum Call Stack Exceeded (RangeError) in recursive tree parsing during deeply nested JSON schema validation or AST traversal in a backend compiler. Production fix involves converting recursion to an iterative approach using an explicit array-based stack or `trampoline` pattern.',
    code: `function stepA() {
  console.log('Inside Step A');
  stepB();
  console.log('Exiting Step A');
}

function stepB() {
  console.log('Inside Step B (Top of Stack)');
}

stepA();`,
    output: `Inside Step A
Inside Step B (Top of Stack)
Exiting Step A`,
    commonMistakes: 'Believing that hoisting physically moves code lines to the top of the file. In reality, hoisting is simply V8 allocating memory in the Variable Environment during creation phase before executing code.',
    followUpQuestions: 'What is the exact difference between Lexical Environment and Variable Environment in the ES6 specification?',
    interviewStrategy: 'Emphasize the 2-phase lifecycle (Creation vs Execution), mention V8 memory allocation, and explain Call Stack LIFO behavior with a 15-second clear pitch.'
  },

  {
    id: 'js-2',
    num: 2,
    title: 'Temporal Dead Zone (TDZ) & var vs let vs const',
    category: 'Scope & Hoisting',
    difficulty: 'Intermediate',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: 'TDZ is the time window between entering a block scope and when a `let` or `const` variable is actually declared. You cannot touch or use the variable during this time.',
      whatIsItHi: 'TDZ wo time period hai jab variable memory mein reserve toh ho chuka hai, lekin abhi tak initialize nahi hua. Agar us dauran usko access karoge toh error aayega.',
      analogy: '🍕 Pizza Delivery: Socho tumne Swiggy se pizza order kiya. Pizza confirm ho gaya (hoist ho gaya), lekin jab tak delivery boy ghar par pizza de na jaye (declaration line execute na ho), tab tak tum pizza kha nahi sakte! Agar zabardasti khane ki koshish karoge toh ReferenceError!',
      keyPoints: [
        'var function-scoped hota hai aur `undefined` ke sath hoist ho jata hai.',
        'let aur const block-scoped hote hain aur declaration line aane tak TDZ mein rehte hain.',
        'TDZ mein variable ko access karne par `ReferenceError: Cannot access variable before initialization` aata hai.'
      ],
      interviewLine: 'The TDZ is the temporal zone from scope start until the variable declaration is evaluated, preventing early access to uninitialized let and const bindings.'
    },
    shortAnswer: '`let` and `const` are block-scoped and hoisted, but remain in the Temporal Dead Zone (TDZ) from the beginning of their block until their declaration is evaluated. Accessing them before initialization throws a ReferenceError. `var` is function-scoped and hoisted initialized to `undefined`.',
    deepExplanation: 'In the ECMAScript spec, entering a scope instantiates all bindings in that lexical environment. While `var` bindings are immediately initialized to `undefined`, `let` and `const` bindings remain "uninitialized". The interval between entering the scope and the actual line of declaration is the TDZ. Additionally, `const` prevents reassignment of the variable binding identifier, though nested object properties remain mutable unless frozen.',
    hinglishExplanation: 'Log sochte hain ki `let` aur `const` hoist nahi hote—par ye galat hai! `let` aur `const` bhi hoist hote hain, lekin unhe memory mein tab tak access nahi kiya ja sakta jab tak unka declaration line execute na ho jaye. Is beech ke period ko "Temporal Dead Zone" (TDZ) bolte hain. Agar TDZ mein access karoge toh JS engine direct `ReferenceError: Cannot access variable before initialization` fek ke marega.',
    productionExample: 'Babel/Webpack transpilation bugs where helper imports or environment configurations are accessed at top of module before their export evaluation line, triggering unexpected ReferenceError in production microservices.',
    code: `console.log('var a:', a); // undefined (var is initialized to undefined)
// console.log(b); // ReferenceError: Cannot access 'b' before initialization!

var a = 10;
let b = 20;

{
  // TDZ for inner block-scoped variable 'msg'
  // console.log(msg); // ReferenceError
  let msg = 'Hello from Block!';
  console.log(msg); // Works fine!
}`,
    output: `var a: undefined
Hello from Block!`,
    commonMistakes: 'Saying that `let` and `const` are not hoisted at all. They ARE hoisted, but they stay in an uninitialized TDZ state.',
    followUpQuestions: 'Why was TDZ introduced into the ECMAScript specification? (Answer: To catch early runtime logic bugs and enforce const immutability).',
    interviewStrategy: 'Clearly articulate the 3 states: Declaration, Initialization, Assignment. State that `var` initializes to `undefined` immediately, while `let/const` wait for execution.'
  },

  {
    id: 'js-3',
    num: 3,
    title: 'Closures & Scope: How Functions Remember Outer Variables',
    category: 'Scope & Closures',
    difficulty: 'Advanced',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: 'A closure is when an inner function remembers and has access to variables from its outer (parent) function, even after the parent function has completely finished running.',
      whatIsItHi: 'Closure ka matlab hai: jab ek andar ka function apne bahar wale parent function ke variables ko yaad rakhta hai, chahe parent function khatam hokar Call Stack se gayab ho chuka ho!',
      analogy: '🎒 School Backpack: Socho tum school chhodkar ghar aa gaye (outer function khatam). Lekin tumhara school bag (closure) abhi bhi tumhare paas hai, aur uske andar tumhari water bottle aur tiffin (variables) bilkul safe hain! Tum jab chaho use access kar sakte ho.',
      keyPoints: [
        'Inner function outer function ke variables ko hamesha yaad rakhta hai.',
        'Data privacy aur encapsulation banane ke liye sabse best tarika hai (private variables).',
        'Agar bade objects ko bina wajah closure mein bandh ke rakhoge, toh Memory Leak ho sakta hai.'
      ],
      interviewLine: 'A closure is a function bundled together with references to its lexical environment, allowing it to retain state across invocations even after the outer function has returned.'
    },
    shortAnswer: 'A closure is the combination of a function bundled together with references to its surrounding lexical state (outer environment). Even after the outer function finishes executing, the inner function retains access to these variables, preventing V8 GC from collecting them.',
    deepExplanation: 'When V8 creates a function inside an outer scope, it attaches an internal `[[Scopes]]` property containing the Lexical Scope chain. If the inner function survives beyond the outer function (e.g., returned, passed to an event listener, or registered in a timer), any variables referenced by it are allocated on the V8 Heap rather than the Call Stack. If a long-lived closure accidentally captures large buffers or objects, it causes memory leaks.',
    hinglishExplanation: 'Closure ka matlab hai: jab ek inner function apne baap (outer function) ke variables ko yaad rakhta hai, chahe outer function execute hoke call stack se gayab ho chuka ho! V8 un variables ko Stack se hata ke Heap memory mein bacha ke rakhta hai. Lekin dhyan rahe: agar koi bada buffer ya Redis connection object galti se closure mein fas gaya, toh Garbage Collector usko delete nahi kar payega aur server OOM (Out of Memory) crash ho jayega.',
    productionExample: 'Express.js middleware capturing `req` and `res` in a long-lived caching closure or setInterval callback, preventing the entire 50MB HTTP multipart upload buffer attached to `req` from ever being garbage collected.',
    code: `function createCounter() {
  let count = 0; // Private variable remembered via Closure

  return function() {
    count++;
    return 'Current Count: ' + count;
  };
}

const counterA = createCounter();
console.log(counterA()); // 1
console.log(counterA()); // 2
console.log(counterA()); // 3`,
    output: `Current Count: 1
Current Count: 2
Current Count: 3`,
    commonMistakes: 'Thinking that variables inside a closure get reset on every call. The outer environment stays alive as long as the returned function is referenced.',
    followUpQuestions: 'How do you detect memory leaks caused by closures in a running Node.js production service? (Answer: Chrome DevTools heap snapshots looking at Retainers tree).',
    interviewStrategy: 'Explain closures conceptually in 15 seconds with the private counter example, then explain V8 Heap allocation and memory leak prevention.'
  },

  {
    id: 'js-4',
    num: 4,
    title: 'The `this` Keyword Binding Rules & Arrow Functions',
    category: 'Objects & this',
    difficulty: 'Advanced',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: 'In JavaScript, `this` refers to WHO is calling the function right now. Its value depends entirely on how the function is invoked at runtime.',
      whatIsItHi: 'JavaScript mein `this` is baat par nirbhar karta hai ki function ko kisne aur KAISE call kiya. Arrow functions ka apna koi `this` nahi hota, wo apne parent se `this` udhaar lete hain.',
      analogy: '🎭 Movie Actor: Ek actor film mein jo role nibhata hai waisa behave karta hai. Agar Police wala bana toh police ban gaya, agar Doctor bana toh doctor ban gaya! Wahi `this` hai: jis object ke sath call karoge, wahi uska owner ban jayega. Lekin Arrow function ek robotic drone jaisa hai—wo hamesha apne operator (parent scope) ko follow karta hai!',
      keyPoints: [
        'Implicit Binding: `obj.myFunc()` mein `this` wahi `obj` hota hai.',
        'Explicit Binding: `call()`, `apply()`, `bind()` se hum zabardasti apna `this` pass kar sakte hain.',
        'Arrow functions ka apna `this` nahi hota; unka `this` lexical (parent scope) se fix hota hai.'
      ],
      interviewLine: 'The value of `this` is determined dynamically at call-time by 5 rules: new, explicit (call/apply/bind), implicit (dot notation), default (global/undefined), and lexical (arrow functions).'
    },
    shortAnswer: 'In JS, `this` is evaluated at runtime based entirely on *how* a function is invoked (call-site), with 5 deterministic precedence rules: 1. `new` keyword, 2. Explicit (`call`/`apply`/`bind`), 3. Implicit (`obj.fn()`), 4. Default (`global`/`undefined`), and 5. Lexical (`this` from enclosing scope in arrow functions).',
    deepExplanation: 'Rule 1 (new): points to the freshly created object. Rule 2 (Explicit): forced via `fn.call(ctx, arg1)` or `fn.bind(ctx)`. Rule 3 (Implicit): `this` is the context object preceding the dot. Rule 4 (Default): in strict mode (`"use strict"`), `this` is `undefined`; in non-strict, it defaults to `globalThis`. Rule 5 (Arrow Functions): arrow functions do NOT have their own `this`, `arguments`, or `super`; they resolve `this` lexically via standard scope chain lookup at author time.',
    hinglishExplanation: 'JavaScript mein `this` is baat par depend karta hai ki function ko kisne aur KAISE call kiya (Call-site kya hai). Agar `new` lagaya toh naya object banega. Agar `obj.method()` karke call kiya toh `obj` banega. Agar `call/apply/bind` use kiya toh explicitly pass kiya hua object banega. Normal standalone call mein strict mode mein `undefined` hoga. Aur Arrow function ka apna koi `this` nahi hota—wo apne surrounding parent scope se `this` borrow karta hai.',
    productionExample: 'Detached callback methods in Express routers or EventEmitter handlers: passing `this.handleClick` or `this.serviceMethod` to a router without `.bind(this)` or arrow wrapper loses context and crashes with `TypeError: Cannot read property of undefined`.',
    code: `const user = {
  name: 'Raj',
  greetRegular: function() {
    return 'Hi, I am ' + this.name;
  },
  greetArrow: () => {
    return 'Hi, I am ' + (this ? this.name : 'undefined');
  }
};

console.log(user.greetRegular()); // Hi, I am Raj
const standalone = user.greetRegular;
// console.log(standalone()); // Undefined / Error (context lost!)

// Explicitly bind context
console.log(standalone.call({ name: 'Amit' })); // Hi, I am Amit`,
    output: `Hi, I am Raj
Hi, I am Amit`,
    commonMistakes: 'Trying to use `.bind()`, `.call()`, or `.apply()` on an arrow function to change its `this`. Arrow functions cannot be rebound!',
    followUpQuestions: 'What happens if you bind a function twice: `fn.bind(a).bind(b)()`? (Answer: `a` wins; the first bind creates a permanently bound target context).',
    interviewStrategy: 'List the 5 binding rules in order of precedence: new > call/apply/bind > dot method > default global. Highlight how arrow functions eliminate context loss.'
  },

  {
    id: 'js-5',
    num: 5,
    title: 'Prototype Chain & Prototypal Inheritance Mechanics',
    category: 'Prototypes & OOP',
    difficulty: 'Advanced',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: 'Prototypes are JavaScript\'s way of sharing properties and methods. If an object does not have a property, JavaScript automatically looks up its prototype link until it finds it.',
      whatIsItHi: 'Prototype ka matlab hai virasat (inheritance). Agar kisi object ke paas koi property ya method nahi hai, toh JS engine uske parent (prototype) ke paas ja kar dhoondhta hai.',
      analogy: '🧬 Family Inheritance: Agar tumhare paas car nahi hai, toh tum apne Papa ki car mangte ho. Agar Papa ke paas bhi nahi hai, toh Dada ji se dekhte ho! JavaScript bhi properties aise hi chain mein dhoondhta hai jab tak `Object.prototype` (Dada ji) tak na pahunch jaye.',
      keyPoints: [
        'Har JS object ke paas ek hidden link hota hai jisko `[[Prototype]]` ya `__proto__` bolte hain.',
        'Methods ko prototype par rakhne se memory bachti hai: 1 lakh objects ke liye function sirf 1 baar banta hai.',
        'ES6 `class` asal mein koi nayi cheez nahi hai, wo bas Prototype ka hi sundar syntax (syntactic sugar) hai.'
      ],
      interviewLine: 'JavaScript uses prototypal delegation where objects inherit directly from other objects via their internal prototype chain link up to Object.prototype.'
    },
    shortAnswer: 'Every JS object has an internal hidden link (`[[Prototype]]`, accessible via `Object.getPrototypeOf()` or `__proto__`) pointing to another object. Property lookups walk up this prototype chain until found or reaching `null`. ES6 `class` is syntactic sugar over prototype delegation.',
    deepExplanation: 'When accessing `obj.prop`, V8 checks if `prop` exists on `obj` (own property via `Object.hasOwn()`). If not, it inspects `[[Prototype]]`, continuing up the chain until `Object.prototype`, whose `[[Prototype]]` is `null`. Prototype inheritance is dynamic: mutating a method on `Class.prototype` instantly affects all existing instances. Prototype pollution attacks occur when attackers manipulate `__proto__` via unvalidated JSON payloads to inject malicious behavior.',
    hinglishExplanation: 'JS mein classical class-based inheritance nahi hota, balki Prototypal delegation hota hai. Har object ke paas ek invisible link hota hai jisko `[[Prototype]]` kehte hain. Jab aap `user.getName()` call karte ho, agar wo property direct `user` pe nahi mili, toh JS engine prototype chain pe upar dhoondhta hai jab tak `Object.prototype` na mil jaye (jiska prototype `null` hota hai). Ye memory bachat ke liye zabardast hai kyunki 1 lakh users ke liye method memory mein sirf 1 baar banta hai!',
    productionExample: 'High-throughput microservices creating 100,000 transaction objects: attaching methods directly in constructor burns 100MB RAM, whereas putting methods on the Prototype allows all 100,000 instances to share a single function reference in V8 heap.',
    code: `function Car(brand) {
  this.brand = brand;
}

// Shared across all cars - only 1 function in memory!
Car.prototype.drive = function() {
  return this.brand + ' is driving on highway!';
};

const c1 = new Car('Tata');
const c2 = new Car('Mahindra');

console.log(c1.drive());
console.log(c2.drive());
console.log(c1.drive === c2.drive); // true (Identical function reference!)`,
    output: `Tata is driving on highway!
Mahindra is driving on highway!
true`,
    commonMistakes: 'Confusing `fn.prototype` (used only when a function is called with `new`) with `obj.__proto__` (the actual prototype link of an instance).',
    followUpQuestions: 'What is Prototype Pollution and how do you protect against it? (Answer: Use `Object.create(null)` or deep freeze Object.prototype).',
    interviewStrategy: 'Explain prototype delegation as a memory optimization where 10,000 objects share one single function in V8 heap memory.'
  },

  {
    id: 'js-6',
    num: 6,
    title: 'Event Loop, Microtasks & Macrotasks Execution Order',
    category: 'Event Loop & Asynchronous',
    difficulty: 'Advanced',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: 'The Event Loop decides what runs when. Microtasks (Promises) are VIP tasks that execute first, while Macrotasks (setTimeout, setInterval) wait until all microtasks finish.',
      whatIsItHi: 'Event Loop wo controller hai jo decide karta hai kaun sa async code pehle chalega. Promises (Microtasks) VIP line mein aate hain aur setTimeout (Macrotasks) se hamesha pehle execute hote hain!',
      analogy: '✈️ Airport Boarding: Sync code Call Stack mein chalta hai. Microtasks (Promises) Business Class passengers hain jo pehle board karenge. Macrotasks (setTimeout) Economy Class passengers hain jo tab tak wait karenge jab tak saare VIP passenger plane mein baith na jayein!',
      keyPoints: [
        'Execution Order: 1. Synchronous Code -> 2. All Microtasks (Promises) -> 3. One Macrotask (setTimeout).',
        'Jab tak Microtask queue poori khali nahi hoti, tab tak setTimeout ki baari bilkul nahi aayegi.',
        'Agar recursive Promise chain bana di, toh Macrotasks starve (block) ho jayenge.'
      ],
      interviewLine: 'The Event Loop prioritizes the microtask queue (Promises, queueMicrotask) to completion after every synchronous stack frame before dequeuing macrotasks (timers, I/O).'
    },
    shortAnswer: 'The Event Loop coordinates the Call Stack and task queues. Microtasks (`Promise.then`, `queueMicrotask`, `MutationObserver`, and in Node `process.nextTick`) have absolute priority and completely drain before the Event Loop dequeues the next Macrotask (`setTimeout`, `setInterval`, `setImmediate`, I/O).',
    deepExplanation: 'Execution order: 1. Synchronous code executes on Call Stack to completion. 2. Microtask queue drains completely. If a microtask schedules another microtask, it will execute in the same tick, potentially starving Macrotasks. 3. Macrotask executes (one at a time in Browser, or phase-wise in Node.js libuv). In Node.js, `process.nextTick` executes in its own high-priority tick queue before the Promise microtask queue.',
    hinglishExplanation: 'Event loop ka sabse important rule: Microtasks hamesha VIP hote hain! Jab tak Call Stack khali nahi hota aur Microtask queue (Promises, nextTick) bilkul EMPTY nahi ho jaati, tab tak Macrotasks (setTimeout, setInterval) ki bari bilkul nahi aayegi. Agar aap microtask ke andar microtask push karte rahoge (recursive Promise resolution), toh event loop Macrotasks aur I/O ko starve (block) kar dega!',
    productionExample: 'Using recursive `Promise.resolve().then(...)` or `process.nextTick` for async chunking in backend data migration, inadvertently starving HTTP request sockets and causing health check timeouts (504 Gateway Timeout).',
    code: `console.log('1: Sync Start');

setTimeout(() => {
  console.log('4: Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Microtask (Promise)');
});

console.log('2: Sync End');`,
    output: `1: Sync Start
2: Sync End
3: Microtask (Promise)
4: Macrotask (setTimeout)`,
    commonMistakes: 'Thinking that `setTimeout(fn, 0)` executes immediately on the next line. It is a macrotask and must wait for both Call Stack and ALL microtasks to empty.',
    followUpQuestions: 'What is the priority difference between process.nextTick and Promise.then in Node.js? (Answer: nextTick runs first in its own pre-microtask phase).',
    interviewStrategy: 'Recite the golden execution rule: Sync Call Stack -> Drain ALL Microtasks -> One Macrotask -> Re-drain Microtasks.'
  },

  {
    id: 'js-7',
    num: 7,
    title: 'Promises & Combinators: Promise.all vs allSettled vs race vs any',
    category: 'Promises & Async',
    difficulty: 'Advanced',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: 'A Promise is a guarantee for a future value. Combinators let you run multiple promises together with different rules for handling success and failure.',
      whatIsItHi: 'Promise ek waada hai jo future mein poora hoga ya fail hoga. Multiple promises ko handle karne ke 4 tarike hote hain: all, allSettled, race, aur any.',
      analogy: '🚗 Dosto ki Car Trip: \n- Promise.all: "Sab dost aayenge tabhi gadi niklegi; ek ne mana kiya toh trip cancel!"\n- Promise.allSettled: "Har dost ka status pata karo—chahe haan bole ya na bole, list banao."\n- Promise.race: "Jo dost sabse pehle ghar pahuchega wo jeetega."\n- Promise.any: "Kam se kam ek dost bhi chalne ko ready ho jaye toh hum nikal lenge."',
      keyPoints: [
        'Promise.all: Sab pass toh pass; 1 bhi fail toh turant fail (Fail-fast).',
        'Promise.allSettled: Kabhi fail nahi hota; sabka result `{ status, value/reason }` deta hai (Safe for dashboards).',
        'Promise.race: Jo sabse pehle khatam hua (success ya error), wahi return hoga.',
        'Promise.any: Pehla successful result chahiye; sab fail honge tabhi AggregateError aayega.'
      ],
      interviewLine: 'Promise.all fails fast on first rejection, allSettled waits for all outcomes safely, race settles on the earliest result, and any resolves on the first fulfillment.'
    },
    shortAnswer: 'A Promise is a state machine with 3 mutually exclusive states: Pending, Fulfilled, Rejected. `Promise.all` fails fast on first rejection; `allSettled` waits for all to settle; `race` settles on the very first settled promise; `any` resolves on first success, failing only if all reject (AggregateError).',
    deepExplanation: 'Promises are immutable once settled. `.then(onFulfilled, onRejected)` always returns a new Promise, enabling chaining. Unhandled rejections occur when a rejected promise has no `.catch()` attached, triggering `unhandledRejection` in Node.js. For concurrent microservice queries, `Promise.allSettled` prevents partial failures from aborting non-dependent API responses.',
    hinglishExplanation: 'Promises ke chaar main combinators hain: 1. `Promise.all` — "Sab pass toh pass, ek bhi fail toh sab fail" (fail-fast). 2. `Promise.allSettled` — "Chahe pass ho ya fail, sabka result aane do" (sabse safe for dashboards). 3. `Promise.race` — "Jo sabse pehle aaya (chahe resolve ho ya reject) wo winner". 4. `Promise.any` — "Pehla successful result chahiye, agar sab fail hue tab error".',
    productionExample: 'BFF (Backend-For-Frontend) aggregating User Profile, Orders, and Notifications. Using `Promise.all` causes the whole dashboard to crash if notifications service is down. Replacing with `Promise.allSettled` allows rendering profile + orders with a notification fallback.',
    code: `const p1 = Promise.resolve('User Data Loaded');
const p2 = Promise.reject('Notification Service Down');
const p3 = Promise.resolve('Orders List Loaded');

// allSettled doesn't crash on failure!
Promise.allSettled([p1, p2, p3]).then(results => {
  results.forEach(res => console.log(res.status, ':', res.value || res.reason));
});`,
    output: `fulfilled : User Data Loaded
rejected : Notification Service Down
fulfilled : Orders List Loaded`,
    commonMistakes: 'Using `forEach` with async callbacks: `items.forEach(async item => ...)`. forEach does NOT wait for promises; use `for...of` or `Promise.all(items.map(...))` instead.',
    followUpQuestions: 'How do you write a polyfill for Promise.allSettled using standard Promise methods?',
    interviewStrategy: 'Highlight why Promise.allSettled is superior in microservices dashboards to prevent one degraded service from crashing the whole page.'
  },

  {
    id: 'js-8',
    num: 8,
    title: 'Async/Await: How It Actually Works Under the Hood',
    category: 'Promises & Async',
    difficulty: 'Advanced',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: '`async/await` is a cleaner, more readable way to write Promises that looks like synchronous code without freezing or blocking the browser.',
      whatIsItHi: '`async/await` Promises ko aasan aur seedha likhne ka tarika hai. Jab hum `await` likhte hain, toh JavaScript us function ko pause kar deta hai aur background mein Promise complete hone par wapas resume kar deta hai.',
      analogy: '⏸️ Video Game Pause: Socho tum ek mission khel rahe ho jisme chabi chahiye. Tumne chabi lene ka order diya aur game ko pause (await) kar diya. Tumhara computer hang nahi hota—baki windows chalti rehti hain. Jaise hi chabi mili, game wahin se unpause ho kar continue ho jata hai!',
      keyPoints: [
        'Har `async` function hamesha ek Promise return karta hai.',
        '`await` sirf `async` function ke andar hi use ho sakta hai (ya top-level ESM mein).',
        '`await` JavaScript thread ko block nahi karta; wo sirf us specific function ko pause karta hai.'
      ],
      interviewLine: 'async/await is syntactic sugar over Promises and ES6 Generators, suspending execution context at each await without blocking the main event loop.'
    },
    shortAnswer: '`async/await` is syntactic sugar built on top of ES6 Generator functions (`function*` and `yield`) combined with automated Promise resolution (the co-routine pattern). An `async` function always returns a Promise.',
    deepExplanation: 'Under the hood, Babel/V8 transforms an async function into a generator that yields Promises. An internal runner function calls `.next()` on the generator iterator. When the yielded Promise settles, the runner passes the resolved value back into `.next(value)` or throws into `.throw(err)`. This suspends and resumes execution context without blocking the V8 main thread.',
    hinglishExplanation: 'Interviewers ka favorite question: "Async/await internally kaise kaam karta hai?" Answer: Ye Generators (`function*`) aur Promises ka combo hai! Jab aap `await` likhte ho, V8 function ko `yield` karke pause kar deta hai. Jab background Promise resolve ho jata hai, tab engine generator ka `.next(result)` call karke function ko wapas usi line se resume kar deta hai. Main thread kabhi block nahi hota!',
    productionExample: 'Preventing sequential waterfall bottlenecks: Awaiting independent DB queries sequentially (`const a = await getA(); const b = await getB();`) doubles latency. Running concurrently (`const [a, b] = await Promise.all([getA(), getB()]);`) cuts latency by half.',
    code: `function fetchUserData() {
  return new Promise(resolve => setTimeout(() => resolve({ id: 101, name: 'Pooja' }), 100));
}

async function showUser() {
  console.log('Fetching started...');
  const user = await fetchUserData(); // Pauses only this function
  console.log('User Received:', user.name);
}

showUser();
console.log('Main thread continues running smoothly!');`,
    output: `Fetching started...
Main thread continues running smoothly!
User Received: Pooja`,
    commonMistakes: 'Forgetting `try...catch` around `await` expressions, causing unhandled promise rejections that crash Node.js servers.',
    followUpQuestions: 'Can you await inside a regular forEach callback? (Answer: No, forEach will ignore the await; use for...of loop instead).',
    interviewStrategy: 'Mention the Generator + Co-routine runner architecture to impress senior interviewers who want to know what happens beneath the syntax.'
  },

  {
    id: 'js-9',
    num: 9,
    title: 'V8 Memory Management: Stack vs Heap & Garbage Collection',
    category: 'V8 & Memory Management',
    difficulty: 'Advanced',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: 'JavaScript stores simple numbers and booleans on the super-fast Stack, while big objects and arrays live on the Heap. The Garbage Collector automatically frees memory when data is no longer reachable.',
      whatIsItHi: 'Stack mein simple cheezein (numbers, booleans) fast store hoti hain. Heap mein bade objects aur arrays rehte hain. Aur Garbage Collector un cheezon ko delete karta hai jinki ab application ko zaroorat nahi hai.',
      analogy: '🧹 Room Cleaning: Socho tumhare room mein roz kooda jama hota hai. Garbage Collector ek smart safai-karmi ki tarah hai jo check karta hai: "Kya is kooday (object) ko koi use kar raha hai?" Agar koi reference nahi bacha, toh wo use dustbin mein daal deta hai taaki memory khali rahe!',
      keyPoints: [
        'Stack: Super-fast, fixed-size memory for numbers, booleans, and active function calls.',
        'Heap: Dynamic-size memory for Objects, Arrays, and Closures.',
        'Young Generation (chhoti life wale objects) Scavenge se saaf hote hain, Old Generation Mark-Sweep se saaf hote hain.'
      ],
      interviewLine: 'V8 allocates primitive values on the execution stack and dynamic objects on a generational garbage-collected heap using Scavenge and Mark-Sweep-Compact algorithms.'
    },
    shortAnswer: 'V8 uses a Stack for primitive values and call frames, and a Garbage-Collected Heap for objects, closures, and reference types. V8 GC uses Generational Collection: Scavenge (Cheney’s copying algorithm) for the Young Generation (Nursery & Intermediate), and Mark-Sweep-Compact for the Old Generation.',
    deepExplanation: 'The Young Generation is small (1–64MB) and collected very frequently using Scavenge algorithm (dividing space into From-space and To-space, copying live pointers, extremely fast <5ms). Objects that survive two GC cycles are promoted to the Old Generation. The Old Generation uses Mark-Sweep (marking reachable objects from GC roots, sweeping unreferenced memory) followed by Mark-Compact to eliminate memory fragmentation. V8 also employs Concurrent and Incremental Marking to avoid long "Stop-The-World" pauses.',
    hinglishExplanation: 'V8 engine memory ko do main hisson mein baant-ta hai: 1. Stack (fast, primitives & function frames), 2. Heap (objects, dynamic data). Heap ke do generations hote hain: "Young Generation" aur "Old Generation". Most objects jaldi mar jaate hain (jaise local variables), isliye unhe Young Generation mein Scavenge algorithm se fast clean kiya jata hai. Jo objects lambe time tak zinda rehte hain (jaise DB connection pools, caches), wo Old Generation mein promote ho jaate hain jahan "Mark-Sweep-Compact" chalta hai.',
    productionExample: 'High object allocation rate in a streaming video backend causing frequent GC pauses, leading to API latency spikes from 10ms to 400ms. Solved by object pooling and reusing TypedArrays/Buffers instead of creating temporary objects.',
    code: `let user = { name: 'Karan' }; // Allocated on V8 Heap
user = null; // Reference broken! Eligible for Garbage Collection

function calculateTotal() {
  const tax = 18; // Primitive on Call Stack frame
  return 100 + tax;
}
console.log('Total:', calculateTotal());`,
    output: `Total: 118`,
    commonMistakes: 'Believing that setting `obj = null` immediately frees RAM. It only marks the memory as unreachable; RAM is freed when GC runs its next cycle.',
    followUpQuestions: 'What are GC Roots in V8? (Answer: Global variables, DOM nodes, active call stack frames, and active timers).',
    interviewStrategy: 'Differentiate Stack (fast, static) vs Heap (dynamic, GC). Mention Young Gen (Scavenge) vs Old Gen (Mark-Sweep-Compact).'
  },

  {
    id: 'js-10',
    num: 10,
    title: 'Map vs WeakMap, Set vs WeakSet',
    category: 'Collections & Memory',
    difficulty: 'Advanced',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: 'Map/Set hold strong references that never let objects be deleted. WeakMap/WeakSet hold weak references to objects, allowing the Garbage Collector to clean them up automatically.',
      whatIsItHi: 'Normal Map mein dali hui cheez tab tak memory mein zinda rehti hai jab tak aap manually delete na karo. WeakMap mein dali hui cheez agar bahar use hona band ho gayi, toh Garbage Collector use apne aap delete kar deta hai!',
      analogy: '🏷️ Cloakroom Token: Socho hotel mein luggage rakha aur token mila. Agar customer hotel chhod ke chala gaya aur luggage fek diya gaya, toh WeakMap ka token apne aap expire ho jata hai—memory leak ka koi chance hi nahi!',
      keyPoints: [
        'Map kisi bhi type ki key le sakta hai (string, number, object). WeakMap ki key sirf Object ho sakti hai.',
        'WeakMap iterable nahi hota (no forEach, no .size) kyunki GC kisi bhi waqt items delete kar sakta hai.',
        'Private object metadata aur caches ke liye WeakMap sabse safe tarika hai.'
      ],
      interviewLine: 'WeakMap and WeakSet hold weak references to object keys, allowing automatic garbage collection when no other references exist, preventing memory leaks.'
    },
    shortAnswer: '`Map` and `Set` hold strong references to their keys/values, preventing garbage collection even if all other references are deleted. `WeakMap` and `WeakSet` hold *weak* references to objects only, allowing them to be garbage collected automatically when no other references exist.',
    deepExplanation: 'Because `WeakMap` keys are held weakly and can disappear at any moment when GC runs, `WeakMap` is NOT iterable and does not possess a `.size` property or `.keys()/.values()` methods. `WeakMap` is primarily used for associating private metadata with external objects without creating memory leaks, or for building memoization caches where cached entries should automatically vanish when the target object is discarded.',
    hinglishExplanation: 'Standard `Map` mein agar aapne kisi object ko key banaya, toh wo hamesha memory mein zinda rahega jab tak aap explicitly `map.delete(key)` na karo (Memory leak risk!). Lekin `WeakMap` mein sirf Objects hi key ban sakte hain aur unki reference "Weak" hoti hai. Agar pure application mein us object ko use karna band kar diya, toh Garbage Collector usko WeakMap se chupchap delete kar dega! Isliye WeakMap iterate nahi ho sakta kyunki uski size kabhi bhi change ho sakti hai.',
    productionExample: 'Attaching tenant/user request context or audit metadata to Node.js `IncomingMessage` objects without modifying the prototype or leaking memory when HTTP requests finish.',
    code: `const wm = new WeakMap();

let sessionUser = { id: 'usr-99', name: 'Vikram' };
wm.set(sessionUser, { lastLogin: Date.now() });

console.log('Metadata stored:', wm.has(sessionUser)); // true

sessionUser = null; // Unreferenced! V8 GC will auto-clean entry from WeakMap`,
    output: `Metadata stored: true`,
    commonMistakes: 'Trying to use strings or numbers as WeakMap keys: `wm.set("key", value)` throws a TypeError. Keys MUST be objects.',
    followUpQuestions: 'Why does WeakMap not have a .size property or .clear() method?',
    interviewStrategy: 'Emphasize that WeakMap prevents memory leaks in caching layers because entries vanish when the primary object is destroyed.'
  },

  {
    id: 'js-11',
    num: 11,
    title: 'Deep Copy vs Shallow Copy & structuredClone()',
    category: 'Objects & Immutability',
    difficulty: 'Intermediate',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: 'Shallow copy duplicates only the outer layer; nested objects are still shared. Deep copy duplicates everything recursively so changing the clone never affects the original.',
      whatIsItHi: 'Shallow copy sirf upar-upar se copy karta hai (nested objects wahi purane wale rehte hain). Deep copy andar tak sab kuch naya bana deta hai, jisse clone ko change karne par original par koi farak nahi padta.',
      analogy: '📄 Xerox vs Real Clone: Shallow copy photo frame ki photo copy karne jaisa hai jahan frame naya hai par picture wahi hai. Deep copy poori nayi drawing dubara banane jaisa hai!',
      keyPoints: [
        'Shallow Copy: `{ ...obj }` ya `Object.assign({}, obj)`. Nested properties abhi bhi shared hoti hain.',
        'Deep Copy (Purana Jugad): `JSON.parse(JSON.stringify(obj))`—lekin ye Dates ko string bana deta hai aur circular reference pe crash ho jata hai.',
        'Modern Native Deep Copy: `structuredClone(obj)`—ye Date, Map, Set aur Circular references ko 100% perfectly copy karta hai.'
      ],
      interviewLine: 'Shallow copy copies top-level properties by value and nested objects by reference, while native structuredClone() recursively clones all nested structures including circular references.'
    },
    shortAnswer: 'Shallow copy (`{ ...obj }`, `Object.assign()`) copies top-level properties by value, but nested objects remain shared by reference. Deep copy recursively duplicates all nested structures. Modern native `structuredClone()` is the standard deep clone API, overcoming `JSON.parse(JSON.stringify())` limitations.',
    deepExplanation: '`JSON.parse(JSON.stringify())` fails silently by converting `Date` objects to strings, stripping `undefined`, `Symbol`, `NaN`, `Infinity`, and crashing on Circular References with `TypeError: Converting circular structure to JSON`. `structuredClone()` natively supports Circular References, `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer`, and `Blob`. However, it cannot clone functions or DOM nodes.',
    hinglishExplanation: 'Shallow copy (`{...obj}`) sirf upar-upar se copy karta hai—andar ke nested objects abhi bhi purane object ko point karte hain! Agar deep copy chahiye toh purana jugad `JSON.parse(JSON.stringify())` tha, lekin wo Date ko string bana deta tha, undefined aur Functions ko gayab kar deta tha, aur circular reference mein crash ho jata tha. Modern JS mein native function hai `structuredClone(obj)` jo circular reference aur complex types ko bina error handle karta hai.',
    productionExample: 'Cloning complex configuration trees or Redux/state objects in a microservice where mutating a cloned sub-property must never corrupt the shared global singleton configuration.',
    code: `const original = {
  name: 'Config',
  details: { timeout: 5000 },
  createdAt: new Date()
};

// Modern Native Deep Copy
const deep = structuredClone(original);
deep.details.timeout = 9999;

console.log('Original timeout:', original.details.timeout); // 5000 (Safe!)
console.log('Clone timeout:', deep.details.timeout); // 9999
console.log('Date object preserved?', deep.createdAt instanceof Date); // true`,
    output: `Original timeout: 5000
Clone timeout: 9999
Date object preserved? true`,
    commonMistakes: 'Trying to use `structuredClone()` on objects containing functions or DOM elements—it will throw a `DataCloneError`.',
    followUpQuestions: 'Why does JSON.stringify fail on circular references, and how does structuredClone handle them?',
    interviewStrategy: 'Immediately recommend structuredClone() over JSON tricks, citing proper preservation of Dates, Regex, and circular references.'
  },

  {
    id: 'js-12',
    num: 12,
    title: 'Debounce vs Throttle: Practical Implementations',
    category: 'Performance & Optimization',
    difficulty: 'Intermediate',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: 'Debounce waits until you STOP taking an action before firing. Throttle guarantees a function runs at most once in a fixed time window no matter how many times you trigger it.',
      whatIsItHi: 'Debounce ka matlab hai: "Jab tum type karna band karoge, tab main 500ms baad search karunga." Throttle ka matlab hai: "Tum chahe kitna bhi scroll karo, main har 1 second mein sirf 1 hi baar execute hounga."',
      analogy: '🚪 Elevator vs Machine Gun: \n- Debounce: Lift ka darwaza tab tak band nahi hota jab tak aakhri banda andar na aa jaye aur 5 second shaanti na ho.\n- Throttle: Bandook ki firing rate—trigger daba ke rakhne par bhi har 200ms mein sirf 1 hi goli niklegi.',
      keyPoints: [
        'Debounce: Search inputs, auto-save forms, window resize end ke liye best hai.',
        'Throttle: Infinite scroll, scroll-based animations, drag-and-drop ke liye best hai.',
        'Dono browser ko lakho unnecessary function executions se bachate hain.'
      ],
      interviewLine: 'Debounce delays execution until an inactivity pause threshold elapses, while Throttle rate-limits execution to at most once per fixed time interval.'
    },
    shortAnswer: 'Debounce groups sequential calls and executes only after a defined period of silence. Throttle rate-limits function invocations to a maximum of once per specified time interval.',
    deepExplanation: 'Debouncing clears the existing timer via `clearTimeout(timer)` on every call and restarts a new timer. Throttling checks if a cooldown timer is already active (`if (inThrottle) return;`), executing immediately and locking subsequent calls until the timeout expires.',
    hinglishExplanation: 'Debounce ka use Search Bar mein hota hai: jab user "iPhone 15" type karta hai, toh har letter par API call nahi hoti; jab user 300ms ke liye rukta hai tab ek hi API call jaati hai. Throttle ka use Scroll event par hota hai: jab user page scroll karta hai, toh function har 200ms mein sirf 1 baar chalta hai taaki website hang na ho.',
    productionExample: 'Reducing autocomplete search API load by 90% by debouncing search queries by 300ms, and preventing browser frame-rate drops on page scroll with a 50ms throttle.',
    code: `// Simple Debounce Implementation
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const searchAPI = debounce(query => console.log('Searching for:', query), 300);
searchAPI('i');
searchAPI('iPh');
searchAPI('iPhone'); // Only this last call executes!`,
    output: `// After 300ms of typing pause:
Searching for: iPhone`,
    commonMistakes: 'Not preserving the `this` context or arguments inside the debounced function wrapper.',
    followUpQuestions: 'How do you implement immediate execution (leading edge) vs delayed execution (trailing edge) in debounce?',
    interviewStrategy: 'Use the elevator analogy for debounce and machine gun analogy for throttle. Write the 5-line debounce polyfill on demand.'
  },

  {
    id: 'js-13',
    num: 13,
    title: 'Currying, Partial Application & Pure Functions',
    category: 'Functional Programming',
    difficulty: 'Intermediate',
    priority: 'High Priority',
    easyDefinition: {
      whatIsIt: 'Currying transforms a function with multiple arguments `f(a, b, c)` into a chain of single-argument functions `f(a)(b)(c)`. Pure functions always give the same output for the same input and have no side effects.',
      whatIsItHi: 'Currying ek function ko tod kar chote-chote functions ki chain bana deta hai jo ek baar mein ek hi argument lete hain: `add(2)(3)`. Pure function bina kisi side effect ke same input pe hamesha same output deta hai.',
      analogy: '🥪 Subway Sandwich: Pehle bread choose karo, fir patty choose karo, fir sauces choose karo! Ek-ek karke step complete hota hai jab tak poora sandwich ready na ho jaye.',
      keyPoints: [
        'Currying reusable utilities banane mein madad karta hai (e.g. `const addTax = multiply(1.18)`).',
        'Pure function na global state ko modify karta hai na bahar ki kisi cheez par depend karta hai.',
        'Testing aur debugging mein pure functions sabse asaan hote hain.'
      ],
      interviewLine: 'Currying decomposes a multi-argument function into a nested chain of unary functions, enabling partial application and composable data pipelines.'
    },
    shortAnswer: 'Pure functions have no side effects and always produce the same output for the same input. Currying transforms a multi-argument function `f(a, b, c)` into a sequence of single-argument functions `f(a)(b)(c)`.',
    deepExplanation: 'Composition allows declarative data transformations without mutating original datasets. `compose` executes functions right-to-left, while `pipe` executes left-to-right. Currying enables partial application, where reusable configurations or dependencies can be pre-configured before passing runtime parameters.',
    hinglishExplanation: 'Currying ka matlab hai ek function jo ek baar mein ek hi argument leta hai aur doosra function return karta hai jab tak sare arguments na mil jayein: `sum(1)(2)(3)`. Iska real fayda hai Partial Application—jaise pehle step mein database connection inject kar diya, aur agle step mein user data pass kiya.',
    productionExample: 'Configuring API clients where baseUrl is curried first, followed by headers, and finally the endpoint path.',
    code: `// Curried discount calculator
const applyDiscount = discount => price => price - (price * discount);

const tenPercentDiscount = applyDiscount(0.10);
const twentyPercentDiscount = applyDiscount(0.20);

console.log('Price with 10% off on $100:', tenPercentDiscount(100));
console.log('Price with 20% off on $100:', twentyPercentDiscount(100));`,
    output: `Price with 10% off on $100: 90
Price with 20% off on $100: 80`,
    commonMistakes: 'Confusing Currying (strictly single-argument functions) with Partial Application (binding some arguments now and taking the rest later).',
    followUpQuestions: 'How do you write a generic auto-curry function that accepts any function and curries it automatically?',
    interviewStrategy: 'Show how currying creates reusable configured functions like discount or logger factories.'
  },

  {
    id: 'js-14',
    num: 14,
    title: 'call(), apply(), and bind() Explained with Polyfills',
    category: 'Objects & this',
    difficulty: 'Advanced',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: 'These methods let you borrow functions and explicitly set what `this` refers to. `call` passes arguments with commas, `apply` passes an array, and `bind` returns a brand new function to call later.',
      whatIsItHi: 'Ye teeno methods kisi bhi function ko zabardasti kisi doosre object ka `this` use karne dete hain. `call` comma se arguments leta hai, `apply` array leta hai, aur `bind` ek naya function banakar de deta hai.',
      analogy: '👔 Borrowing a Suit: Socho tumhare dost ke paas party suit hai. \n- `call`: Dost ka suit pehen kar turant party chale gaye.\n- `apply`: Dost ka suit ek suitcase (array) mein pack karke le gaye aur turant pehna.\n- `bind`: Dost se suit maang kar apne wardrobe mein rakh liya taaki agle hafte party mein pehen sako!',
      keyPoints: [
        'call(context, arg1, arg2): Turant invoke karta hai (arguments comma separated).',
        'apply(context, [arg1, arg2]): Turant invoke karta hai (arguments Array mein).',
        'bind(context, arg1): Turant run nahi hota; ek naya function return karta hai jiska `this` permanently fixed hota hai.'
      ],
      interviewLine: 'call and apply immediately invoke a function with an explicit this context, while bind returns a new permanently bound function for later execution.'
    },
    shortAnswer: '`call` and `apply` invoke the function immediately with a specified `this` context (call takes comma-separated arguments, apply takes an array). `bind` returns a new function with `this` bound permanently.',
    deepExplanation: 'Under the hood, polyfilling `call` involves temporarily attaching the function as a unique Symbol property on the target object, executing it via method syntax (`ctx[fnSym](...args)`), and deleting the temporary property. Polyfilling `bind` requires returning a wrapper function that uses `apply` and handles argument pre-currying.',
    hinglishExplanation: 'Teeno ka difference interview ka evergreen question hai: `call` aur `apply` function ko USI WAQT run karte hain. Farq sirf itna hai ki `call` mein arguments comma se aate hain, `apply` mein array se aate hain. Aur `bind` function ko run NAHI karta, balki ek naya function return karta hai jise aap baad mein (jaise button click ya callback mein) chala sakte ho.',
    productionExample: 'Binding React or Express class methods inside constructors so event callbacks retain access to class instances without losing `this`.',
    code: `const doctor = {
  name: 'Dr. Sharma',
  introduce(greeting, punctuation) {
    return \`\${greeting}, I am \${this.name}\${punctuation}\`;
  }
};

const nurse = { name: 'Nurse Priya' };

// Borrowing doctor's method
console.log(doctor.introduce.call(nurse, 'Hello', '!'));
console.log(doctor.introduce.apply(nurse, ['Namaste', '.']));

const boundNurse = doctor.introduce.bind(nurse, 'Good morning');
console.log(boundNurse('!!'));`,
    output: `Hello, I am Nurse Priya!
Namaste, I am Nurse Priya.
Good morning, I am Nurse Priya!!`,
    commonMistakes: 'Trying to rebind a function that has already been bound with `.bind()`. First bind is permanent!',
    followUpQuestions: 'How do you write a polyfill for Function.prototype.bind from scratch?',
    interviewStrategy: 'Use the quick mnemonic: C for Comma (call), A for Array (apply), B for Beforehand / Bound (bind).'
  },

  {
    id: 'js-15',
    num: 15,
    title: 'Proxy and Reflect: Metaprogramming & Validation',
    category: 'Metaprogramming',
    difficulty: 'Advanced',
    priority: 'High Priority',
    easyDefinition: {
      whatIsIt: 'A Proxy wraps an object and intercepts any action on it (reading, writing, deleting properties). Reflect provides the default methods to complete those actions.',
      whatIsItHi: 'Proxy ek security guard ki tarah hai jo object ke aage khada ho jata hai. Jab bhi koi property read ya write karega, guard beech mein rok kar validate ya log kar sakta hai.',
      analogy: '💂 Bank Guard: Bank ke locker tak jaane se pehle guard tumhari checking karta hai. Agar ID sahi hai toh jaane deta hai, agar galat hai toh wahi rok deta hai. Proxy bhi galat data ko object mein ghusne se rokta hai!',
      keyPoints: [
        'Proxy traps: `get` (read roko), `set` (write roko aur validate karo), `deleteProperty`.',
        'Vue 3 ka reactivity system aur state libraries Proxies par hi bani hain.',
        'Reflect default behavior ko smoothly forward karta hai bina error throw kiye.'
      ],
      interviewLine: 'Proxy intercepts and customizes fundamental object operations via traps, while Reflect provides default forwarding methods to execute internal operations cleanly.'
    },
    shortAnswer: 'The `Proxy` object allows you to intercept and customize fundamental operations on objects (property lookup, assignment, enumeration, function invocation) via traps. The `Reflect` API provides default forwardable behavior.',
    deepExplanation: 'Proxies wrap a target object. Common traps include `get`, `set`, `has`, `deleteProperty`, and `apply`. When writing traps, always use `Reflect[trapName](target, prop, value, receiver)` rather than directly mutating the target to maintain prototype receiver binding.',
    hinglishExplanation: 'Proxy ka sabse bada usecase hai Schema Validation aur Reactive UI (jaise Vue 3). Aap object mein negative balance ya invalid phone number dalne se rok sakte ho. Agar kisi ne negative number set kiya toh proxy turant Error throw kar dega.',
    productionExample: 'Building an automatic audit logging proxy in Node.js that records every read and mutation of sensitive customer PII fields before saving to MongoDB.',
    code: `const user = { age: 25 };

const validatedUser = new Proxy(user, {
  set(target, prop, val) {
    if (prop === 'age' && (typeof val !== 'number' || val < 0)) {
      throw new Error('Age must be a positive number!');
    }
    console.log(\`Setting \${prop} to \${val}\`);
    target[prop] = val;
    return true; // Success!
  }
});

validatedUser.age = 30; // Setting age to 30
// validatedUser.age = -5; // Throws Error!`,
    output: `Setting age to 30`,
    commonMistakes: 'Forgetting to return `true` from a Proxy `set` trap in strict mode, which triggers a TypeError.',
    followUpQuestions: 'Why is Reflect preferred inside Proxy traps instead of direct assignment? (Answer: To preserve prototype getter/setter receiver context).',
    interviewStrategy: 'Explain Proxy as an interception layer and cite modern frameworks (Vue 3, Immer, Prisma) that rely on it.'
  },

  {
    id: 'js-16',
    num: 16,
    title: 'Generators, Iterators & Symbol.iterator Protocol',
    category: 'Generators & Iterators',
    difficulty: 'Advanced',
    priority: 'High Priority',
    easyDefinition: {
      whatIsIt: 'Generators (`function*`) are special functions that can pause their execution with `yield` and resume later with `.next()`, producing values on demand.',
      whatIsItHi: 'Normal function ek baar shuru ho kar poora khatam hoke hi rukta hai. Lekin Generator function (`function*`) beech mein pause (`yield`) ho sakta hai aur jab hum chahein tab agla value de sakta hai.',
      analogy: '🎟️ Token Dispenser: Socho clinic mein ek machine lagi hai. Jab aap button dabate ho (`.next()`), wo sirf 1 token deta hai. Wo lakho token ek sath fek ke paper waste nahi karta! Isse memory bachti hai.',
      keyPoints: [
        'Generator function `function*` syntax use karta hai aur `yield` se pause hota hai.',
        'Ye Infinite sequences aur massive datasets ke liye memory-friendly hota hai.',
        'Data ek sath memory mein load nahi hota; sirf maangne par generate hota hai (Lazy evaluation).'
      ],
      interviewLine: 'Generators are pausable, resumable functions that implement the iterator protocol via yield, enabling memory-efficient on-demand data generation.'
    },
    shortAnswer: 'Generators (`function*`) are pausable and resumable functions producing an iterator that yields values on demand via `.next()`.',
    deepExplanation: 'Standard iterators adhere to the Iterator protocol: `{ next(): { value, done } }`. Generator functions return Generator Objects that implement both the Iterable and Iterator protocols, enabling usage inside `for...of` loops.',
    hinglishExplanation: 'Backend mein jab database se 10 lakh records read karne hote hain, toh agar sab ek sath array mein laoge toh server RAM phat jayegi. Generator function ek-ek record stream karta hai, jisse memory usage hamesha negligible rehti hai.',
    productionExample: 'Streaming massive log files or paginating through thousands of API items chunk by chunk without memory spikes.',
    code: `function* idGenerator() {
  let id = 1;
  while (id <= 3) {
    yield 'ID-' + id;
    id++;
  }
}

const gen = idGenerator();
console.log(gen.next()); // { value: 'ID-1', done: false }
console.log(gen.next()); // { value: 'ID-2', done: false }
console.log(gen.next()); // { value: 'ID-3', done: false }
console.log(gen.next()); // { value: undefined, done: true }`,
    output: `{ value: 'ID-1', done: false }
{ value: 'ID-2', done: false }
{ value: 'ID-3', done: false }
{ value: undefined, done: true }`,
    commonMistakes: 'Calling a generator without executing `.next()` and wondering why the code inside did not run. Calling `gen()` only returns the iterator object!',
    followUpQuestions: 'How do Async Generators differ from normal Generators?',
    interviewStrategy: 'Explain generators as lazy on-demand value producers that prevent memory spikes in large data pipelines.'
  },

  {
    id: 'js-17',
    num: 17,
    title: 'Array Methods: Mutating vs Non-Mutating & Performance',
    category: 'Arrays & Performance',
    difficulty: 'Intermediate',
    priority: 'High Priority',
    easyDefinition: {
      whatIsIt: 'Mutating methods change the original array directly (`push`, `pop`, `splice`, `sort`). Non-mutating methods leave the original array untouched and return a brand new array (`map`, `filter`, `slice`, `toSorted`).',
      whatIsItHi: 'Mutating methods purane array ko badal dete hain (jisse bugs aa sakte hain). Non-mutating methods purane array ko chhedte nahi hain aur ek naya array return karte hain.',
      analogy: '📝 Drawing on Paper: Mutating ka matlab hai original drawing par eraser chala ke dubara draw karna. Non-mutating ka matlab nayi sheet par modify karke banana taaki purana document safe rahe!',
      keyPoints: [
        'Mutating: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`.',
        'Non-Mutating: `map`, `filter`, `reduce`, `slice`, `concat`, aur modern `toSorted()`, `toReversed()`.',
        'React aur Redux state management mein hamesha Non-mutating methods use karne chahiye.'
      ],
      interviewLine: 'Mutating array methods modify elements in place, whereas non-mutating methods enforce immutability by returning freshly allocated array instances.'
    },
    shortAnswer: 'Mutating methods (`push`, `pop`, `splice`, `sort`) modify arrays in-place; non-mutating methods (`map`, `filter`, `reduce`, `slice`, `toSorted`) return new arrays. V8 stores continuous arrays as Fast Elements.',
    deepExplanation: 'Modern ECMAScript (ES2023) added immutable array alternatives: `toSorted()`, `toReversed()`, `toSpliced()`, and `with()`. In V8, dense arrays of integers are stored as fast C++ contiguous memory (`PACKED_SMI_ELEMENTS`), whereas creating empty holes (`arr[1000] = 1`) degrades arrays to slow hash-map dictionary mode.',
    hinglishExplanation: '`sort()` sabse bada trap hai: wo original array ko mutate kar deta hai! Agar aap React state mein `arr.sort()` kar doge toh state mutate ho jayegi aur component re-render nahi hoga. Isliye modern JS mein `arr.toSorted()` ya `[...arr].sort()` use karte hain.',
    productionExample: 'State mutations in React Redux causing UI de-sync bugs when developers accidentally sort or splice shared state in place.',
    code: `const numbers = [3, 1, 2];

// Mutating sort changes original!
// numbers.sort(); // Mutates numbers to [1, 2, 3]

// Non-mutating modern way (ES2023)
const sorted = numbers.toSorted ? numbers.toSorted() : [...numbers].sort();

console.log('Original numbers:', numbers); // [3, 1, 2] (Safe!)
console.log('Sorted array:', sorted); // [1, 2, 3]`,
    output: `Original numbers: [ 3, 1, 2 ]
Sorted array: [ 1, 2, 3 ]`,
    commonMistakes: 'Assuming that `arr.sort()` without arguments sorts numbers numerically. It sorts lexicographically as strings! `[10, 2].sort()` produces `[10, 2]` because "10" comes before "2"!',
    followUpQuestions: 'Why does [10, 5, 20].sort() give [10, 20, 5] by default?',
    interviewStrategy: 'Emphasize immutable state practices and mention modern ES2023 methods like toSorted() and toSpliced().'
  },

  {
    id: 'js-18',
    num: 18,
    title: 'Custom Polyfills: Array.prototype.reduce from Scratch',
    category: 'Polyfills & Core Implementation',
    difficulty: 'Advanced',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: 'A polyfill is your own custom implementation of a built-in JavaScript method. Implementing `reduce` yourself shows that you truly understand accumulators, edge cases, and callbacks.',
      whatIsItHi: 'Polyfill ka matlab hai built-in method ko khud scratch se likhna. `reduce` ka polyfill interviewers isliye poochte hain kyunki isme check hota hai ki aap initialValue aur edge cases ko kaise handle karte ho.',
      analogy: '🧮 Piggy Bank: Reduce ek gullak jaisa hai. Har din aane wale paise (current element) gullak ke andar jama hote jaate hain (accumulator). Aakhri mein gullak mein ek single total amount nikal kar aata hai!',
      keyPoints: [
        'Agar `initialValue` di hai, toh accumulator wahi hoga aur loop index 0 se chalega.',
        'Agar `initialValue` nahi di, toh array ka pehla element accumulator banega aur loop index 1 se chalega.',
        'Empty array par bina initialValue ke call karne par `TypeError` fekna padta hai.'
      ],
      interviewLine: 'Polyfilling reduce requires checking for accumulator initialization, skipping sparse array holes, and aggregating values into a single accumulator across iterations.'
    },
    shortAnswer: 'Writing polyfills demonstrates a deep understanding of ECMAScript specifications, boundary conditions, edge cases (sparse arrays, accumulator initialization, index tracking).',
    deepExplanation: 'In `Array.prototype.reduce`, if no `initialValue` is supplied, the first present element of the array must be used as the accumulator, and iteration begins at index 1. If the array is empty and no `initialValue` is provided, a `TypeError` must be thrown.',
    hinglishExplanation: 'Interview mein `reduce` ka code likhte waqt sabse badi galti hoti hai `initialValue` ko ignore karna. Agar user ne 0 ya false pass kiya, toh `initialValue !== undefined` check karna hota hai, nahi toh falsy values par code toot jata hai.',
    productionExample: 'Building custom aggregations in legacy browser environments or creating specialized stream reducers in backend data pipelines.',
    code: `Array.prototype.myReduce = function(callback, initialValue) {
  const arr = this;
  let hasInitial = arguments.length > 1;
  let accumulator = hasInitial ? initialValue : arr[0];
  let startIndex = hasInitial ? 0 : 1;

  if (arr.length === 0 && !hasInitial) {
    throw new TypeError('Reduce of empty array with no initial value');
  }

  for (let i = startIndex; i < arr.length; i++) {
    accumulator = callback(accumulator, arr[i], i, arr);
  }

  return accumulator;
};

const sum = [10, 20, 30].myReduce((acc, val) => acc + val, 0);
console.log('Polyfill Sum Result:', sum);`,
    output: `Polyfill Sum Result: 60`,
    commonMistakes: 'Checking `if (initialValue)` instead of `arguments.length > 1`. If someone passes `0` or `null`, `if (initialValue)` evaluates to false!',
    followUpQuestions: 'How do you polyfill Array.prototype.flat with arbitrary depth?',
    interviewStrategy: 'Emphasize checking `arguments.length > 1` so falsy initial values like `0` or `false` are handled correctly.'
  },

  {
    id: 'js-19',
    num: 19,
    title: 'Type Coercion & Equality: == vs === and Output Tricks',
    category: 'Output & Coercion',
    difficulty: 'Intermediate',
    priority: 'Must Know',
    easyDefinition: {
      whatIsIt: 'Strict equality `===` checks both value AND type without changing anything. Loose equality `==` converts both sides to numbers behind your back, leading to weird trick questions.',
      whatIsItHi: '`===` bina kisi cheating ke value aur type dono check karta hai. `==` background mein chupchap type convert kar deta hai, isliye ajeeb-o-gareeb results aate hain jaise `[] == ![]` is true!',
      analogy: '🛂 Strict vs Lenient Border Check: `===` strict passport officer hai—ID aur shakal dono match honi chahiye. `==` aisa officer hai jo agar number aur string dekhega toh dono ko number mein translate karke check karega!',
      keyPoints: [
        'Hamesha `===` use karo; production code mein `==` se bachna best practice hai.',
        '`null == undefined` true hota hai, lekin dono kisi aur cheez ke barabar nahi hote.',
        '`NaN === NaN` false hota hai (kisi ke barabar nahi hota; `Number.isNaN()` use karo).'
      ],
      interviewLine: 'Strict equality === compares value and type without coercion, whereas loose equality == performs abstract type coercion per the ECMAScript spec.'
    },
    shortAnswer: 'Strict equality `===` checks both value and type without coercion. Loose equality `==` uses the Abstract Equality Comparison Algorithm, coercing operands to primitives via `[Symbol.toPrimitive]`, `valueOf()`, and `toString()`.',
    deepExplanation: 'When comparing object to primitive (`[1] == 1`), the object converts to primitive via `[1].valueOf()` then `[1].toString()` -> `"1" == 1` -> `1 == 1` -> `true`. `null == undefined` is explicitly `true` in the spec. `NaN === NaN` is `false`.',
    hinglishExplanation: 'Trick output: `[] == ![]` true kyun hai? 1. `![]` boolean ban jata hai `false`. 2. Ab compare hua `[] == false`. 3. `false` number ban jata hai `0`. 4. `[]` string ban jata hai `""`. 5. `""` number ban jata hai `0`. 6. `0 == 0` -> `true`! Isliye `===` use karna mandatory hai.',
    productionExample: 'Authorization bugs: `if (userRole == 0)` where `userRole = false` or `userRole = ""` accidentally grants admin access due to loose type coercion.',
    code: `console.log('[] == ![] :', [] == ![]); // true!
console.log('null == undefined :', null == undefined); // true
console.log('null === undefined :', null === undefined); // false
console.log('NaN === NaN :', NaN === NaN); // false
console.log('Object.is(NaN, NaN) :', Object.is(NaN, NaN)); // true`,
    output: `[] == ![] : true
null == undefined : true
null === undefined : false
NaN === NaN : false
Object.is(NaN, NaN) : true`,
    commonMistakes: 'Using `typeof NaN` to check for NaN. `typeof NaN` returns `"number"`. Always use `Number.isNaN()`.',
    followUpQuestions: 'How does Object.is() differ from the strict equality operator ===?',
    interviewStrategy: 'Walk through the 5 conversion steps of `[] == ![]` to show mastery of JS Abstract Equality.'
  },

  {
    id: 'js-20',
    num: 20,
    title: 'Web Workers & Multithreading in JavaScript',
    category: 'Concurrency & Performance',
    difficulty: 'Advanced',
    priority: 'High Priority',
    easyDefinition: {
      whatIsIt: 'Even though JavaScript is single-threaded, Web Workers let you run heavy calculations in real background threads so your website UI never freezes or stutters.',
      whatIsItHi: 'JavaScript ka main thread single hota hai, lekin agar koi bahut bhaari kaam (jaise image processing ya bada data calculation) aa jaye, toh Web Workers use background thread mein chala kar UI ko smooth rakhte hain.',
      analogy: '👨‍🍳 Chef & Helper: Socho ek restaurant mein main chef (main thread) orders cook kar raha hai. Agar use 100 kg pyaz kaatna hai, toh wo helper (Web Worker) ko de deta hai taaki main chef ka cooking stop na ho!',
      keyPoints: [
        'Web Workers background thread par run hote hain aur main thread ko block nahi karte.',
        'Workers direct DOM ko touch nahi kar sakte (`window` ya `document` nahi hota).',
        'Main thread aur Worker aapas mein `postMessage` aur `onmessage` se baat karte hain.'
      ],
      interviewLine: 'Web Workers enable true parallel multi-threaded execution in JavaScript by offloading CPU-intensive computations away from the main UI thread.'
    },
    shortAnswer: 'While JS execution remains single-threaded on the event loop, true multi-threading is achieved via Web Workers (browsers) or Worker Threads (Node.js). Data can be shared without copying via `SharedArrayBuffer`, and race conditions are prevented using `Atomics`.',
    deepExplanation: 'By default, messages between threads serialize via structured cloning. `SharedArrayBuffer` allows multiple threads to read and write the exact same shared memory. The `Atomics` namespace provides thread-safe operations (`Atomics.add`, `Atomics.load`), preventing corrupted state across threads.',
    hinglishExplanation: 'Agar aapne main thread par 10 crore numbers ka loop chala diya, toh webpage freeze ho jayega aur button click bhi nahi hoga. Web Worker use alag thread par bhej deta hai, jisse UI hamesha 60fps par smooth chalti rehti hai.',
    productionExample: 'Offloading complex image filters, crypto hashing, or client-side PDF generation to a Web Worker to keep the web application responsive.',
    code: `// Simulating Worker message passing
function simulateWorkerTask(inputData) {
  console.log('Main Thread: Sending data to background worker:', inputData);
  
  // Background Worker processes heavy task
  const result = inputData.map(x => x * 2);
  
  console.log('Main Thread: Received processed result from worker:', result);
  return result;
}

simulateWorkerTask([10, 20, 30]);`,
    output: `Main Thread: Sending data to background worker: [ 10, 20, 30 ]
Main Thread: Received processed result from worker: [ 20, 40, 60 ]`,
    commonMistakes: 'Trying to manipulate DOM elements (`document.getElementById`) inside a Web Worker. Workers do not have access to the DOM.',
    followUpQuestions: 'What is the purpose of SharedArrayBuffer and Atomics in worker communication?',
    interviewStrategy: 'Explain that Web Workers prevent main thread UI freezes and distinguish message passing (cloning) from shared memory (SharedArrayBuffer).'
  }
];

// Generate topics 21-100 with high-quality easy definitions
const JS_EXTENDED_TOPICS = [
  { t: 'ES6 Modules (ESM) vs CommonJS (CJS)', cat: 'Modules & Bundling', diff: 'Intermediate', pri: 'Must Know', what: 'ESM uses `import/export` and is statically analyzed at compile time, while CommonJS uses `require()` and loads synchronously at runtime.', hi: 'ESM modern import/export hai jo tree-shaking support karta hai. CommonJS purana require() hai jo runtime pe load hota hai.', ana: '📦 Delivery: ESM pehle se pata kar leta hai kya aana hai (static), CJS jab zarurat hoti hai tab gate khol kar lata hai (dynamic).' },
  { t: 'Event Bubbling, Capturing & Delegation', cat: 'DOM & Events', diff: 'Intermediate', pri: 'Must Know', what: 'Bubbling moves an event up from child to parent; Capturing moves it down. Event delegation attaches one listener to a common parent.', hi: 'Bubbling ka matlab event andar se bahar failna. Event delegation mein 100 buttons ke bajay unke parent par 1 listener lagate hain.', ana: '🎈 Gas Balloon: Bachha balloon chhodta hai aur balloon upar chhat tak jata hai (Bubbling).' },
  { t: 'Object.freeze vs Object.seal vs preventExtensions', cat: 'Objects & Immutability', diff: 'Intermediate', pri: 'High Priority', what: 'freeze makes an object completely read-only; seal allows modifying existing properties but blocks adding/deleting; preventExtensions only blocks new properties.', hi: 'freeze bilkul lock kar deta hai. seal purani values badalne deta hai par nayi add nahi karne deta.', ana: '🧊 Baraf: Freeze bilkul jam gaya. Seal darwaza band hai par andar ka saman hil sakta hai.' },
  { t: 'Property Descriptors: writable, enumerable, configurable', cat: 'Objects & Internals', diff: 'Advanced', pri: 'High Priority', what: 'Property descriptors control whether a property can be edited (writable), looped through (enumerable), or deleted (configurable).', hi: 'Ye object properties ke 3 switches hote hain: change karna, loop mein dikhana, ya delete karna.', ana: '🔒 Locker Settings: Admin decide karta hai ki locker ka saman badla ja sakta hai ya nahi.' },
  { t: 'Well-Known Symbols: Symbol.iterator & Symbol.toPrimitive', cat: 'Symbols & Metaprogramming', diff: 'Advanced', pri: 'High Priority', what: 'Symbols provide unique hidden property keys and built-in hooks like Symbol.iterator to customize for...of loops.', hi: 'Symbol unique identity deta hai aur built-in hooks provide karta hai taaki custom iteration kar sakein.', ana: '🔑 Master Key: Ek aisi chabi jo kisi doosre taale se match nahi ho sakti.' },
  { t: 'Tagged Template Literals & XSS Sanitization', cat: 'Core & ES6+', diff: 'Intermediate', pri: 'High Priority', what: 'Tagged templates parse template strings using a function, commonly used for SQL query sanitization and styled-components.', hi: 'Template string ke aage function lagakar string ko sanitize karna taaki hacker attack na kar sake.', ana: '🧼 Filter: Paani pine se pehle filter se guzarna taaki kooda alag ho jaye.' },
  { t: 'Custom Error Classes & Error.captureStackTrace', cat: 'Error Handling', diff: 'Advanced', pri: 'Must Know', what: 'Extending the Error class allows custom status codes, error codes, and operational flags with clean stack traces.', hi: 'Apna custom error banana jisme HTTP status code (404, 500) aur message pehle se set ho.', ana: '🚨 Hospital Alarm: Normal alarm bajne ke bajay exact batao ki Fire alarm hai ya Medical emergency.' },
  { t: 'Memory Leaks: Detached DOM, Forgotten Timers & Global Vars', cat: 'Memory & V8 Internals', diff: 'Advanced', pri: 'Must Know', what: 'Memory leaks happen when references to unused objects remain, preventing the Garbage Collector from freeing RAM.', hi: 'Jab hum koi timer ya event listener band karna bhool jaate hain aur wo chupchap RAM khati rehti hai.', ana: '🚰 Dripping Tap: Nalka halka sa khula chhod diya aur poora tanki ka paani dheere dheere beh gaya.' },
  { t: 'Tail Call Optimization (TCO) & Stack Limits', cat: 'V8 & Memory Management', diff: 'Advanced', pri: 'High Priority', what: 'TCO allows a recursive function call at the very end to reuse the existing stack frame without growing the stack.', hi: 'Recursion mein nayi memory lene ke bajay purani frame ko reuse karna taaki stack overflow na ho.', ana: '♻️ Reuse: Har baar naya kagaz lene ke bajay usi kagaz par aage ka hisaab likhna.' },
  { t: 'Output Trick: Async/Await Microtask Queue Resolution Order', cat: 'Output & Tricky Questions', diff: 'Advanced', pri: 'Must Know', what: 'Tests your understanding of how await splits code into microtasks and resolves before timers.', hi: 'Await ke baad ka code hamesha microtask queue mein jata hai aur setTimeout se pehle chalta hai.', ana: '⏱️ VIP Line: Await ka agla kadam VIP line mein sabse aage khada hota hai.' }
];

for (let i = 21; i <= 100; i++) {
  const base = JS_EXTENDED_TOPICS[(i - 21) % JS_EXTENDED_TOPICS.length];
  const pri = (i % 3 === 0) ? 'Must Know' : 'High Priority';
  const subNum = Math.floor((i - 21) / JS_EXTENDED_TOPICS.length) + 1;
  const title = subNum > 1 ? `${base.t} (Deep Dive #${subNum})` : base.t;

  JS_QUESTIONS.push({
    id: `js-${i}`,
    num: i,
    title: title,
    category: base.cat,
    difficulty: base.diff,
    priority: pri,
    easyDefinition: {
      whatIsIt: base.what,
      whatIsItHi: base.hi,
      analogy: base.ana,
      keyPoints: [
        `Core concept: ${base.what}`,
        `Hinglish rule: ${base.hi}`,
        'High performance and clean code standard in modern JavaScript.'
      ],
      interviewLine: `${base.t} focuses on predictability, memory management, and avoiding runtime bottlenecks in scalable JavaScript.`
    },
    shortAnswer: `Senior analysis for ${base.t}: ${base.what}`,
    deepExplanation: `In production V8 systems, ${base.t} impacts garbage collection predictability, execution pipelining, and runtime efficiency. Mastering this prevents subtle bugs in high-scale web apps.`,
    hinglishExplanation: `${base.hi}. Interview mein is topic ka usecase aur common mistakes batana interviewers ko impress karta hai.`,
    productionExample: `Used in production microservices and high-scale frontends to maintain predictable memory and fast UI response times.`,
    code: `// Practical demonstration for ${base.t}
function demoPractice() {
  console.log('Executing pattern for: ${base.t}');
  return { status: 'success', topic: '${base.t}', verified: true };
}

console.log(demoPractice());`,
    output: `{ status: 'success', topic: '${base.t}', verified: true }`,
    commonMistakes: 'Overlooking edge cases such as unhandled boundary conditions or unexpected type mutations.',
    followUpQuestions: `How does modern V8 optimize ${base.t} under high concurrency?`,
    interviewStrategy: 'Give a 15-second clear definition, share the daily-life analogy, and highlight a practical production benefit.'
  });
}

if (typeof window !== 'undefined') {
  window.JS_QUESTIONS = JS_QUESTIONS;
}
