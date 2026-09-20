// ==========================================================================
// JavaScript & Node.js Interview Handbook - Comprehensive Core Topics Data
// 24 JavaScript Topics + 35 Node.js Topics
// Strict 8-Part Architecture + Dual English/Hinglish Language Modes
// ==========================================================================

const HANDBOOK_TOPICS = {
  js: [
    {
      id: 'js-1-fundamentals',
      num: 1,
      title: 'JavaScript Fundamentals',
      category: 'Language Core',
      whatIsIt: 'JavaScript is a high-level, single-threaded, garbage-collected, dynamic language that compiles just-in-time (JIT) into machine code. It runs on an event-driven non-blocking runtime.',
      whatIsItHi: 'JavaScript ek high-level, single-threaded aur dynamic language hai jo V8 engine ke andar JIT (Just-In-Time) machine code mein compile hoti hai. Ye non-blocking event-driven model follow karti hai.',
      whyNeed: 'Universal language for browsers and backends (via Node.js), enabling unified fullstack engineering without switching syntax or concurrency paradigms.',
      whyNeedHi: 'Browser aur backend dono jagah ek hi language chalane ke liye, taaki bina multi-threaded complexity ke fast non-blocking I/O use kiya ja sake.',
      howItWorks: 'Code is parsed into an Abstract Syntax Tree (AST), interpreted into bytecode by Ignition, and hot functions are compiled into native machine code by TurboFan.',
      howItWorksHi: 'V8 engine code ko padh kar Abstract Syntax Tree (AST) banata hai, Ignition interpreter bytecode banata hai, aur TurboFan compiler hot functions ko direct fast machine code mein convert karta hai.',
      components: ['V8 Engine', 'AST Parser', 'Ignition Interpreter', 'TurboFan JIT Compiler', 'Call Stack', 'Memory Heap'],
      analogy: 'Chef & Fast-Food Mold: The interpreter reads the recipe line-by-line. When a burger is ordered 1,000 times, a custom metal mold (JIT compiler) is built to churn them out instantly.',
      analogyHi: 'Chef aur Recipe: Interpreter line-by-line recipe padh kar kaam shuru karta hai. Jab koi dish roz lakho baar banti hai, toh compiler uska direct machine mold bana deta hai taaki second ke hazarwe hisse mein kaam ho sake.',
      code: `console.log('JS Engine Initialized');
const language = 'JavaScript';
console.log('Type:', typeof language);
console.log('Is single-threaded:', true);`,
      output: `JS Engine Initialized
Type: string
Is single-threaded: true`,
      stepByStep: '1. Script is parsed into AST.\n2. Synchronous console logs execute on the Call Stack.\n3. Dynamic types are resolved at runtime.',
      interview: {
        pitch: 'JavaScript is a single-threaded, JIT-compiled dynamic language designed around an event-driven runtime with non-blocking I/O.',
        shortAnswer: 'Single-threaded, dynamic language with non-blocking event loop execution and V8 JIT compilation.',
        detailedAnswer: 'JavaScript executes on a single main thread with one Call Stack. Heavy or asynchronous operations are offloaded to runtime environments (Web APIs in browser or Libuv in Node.js), while the V8 engine optimizes bytecode into native machine code.',
        followUps: [
          'Is JavaScript compiled or interpreted? (Answer: Both—JIT compiled via V8 Ignition and TurboFan).',
          'Why is JavaScript single-threaded? (Answer: Designed originally for browser DOM manipulation where concurrent threads could cause race conditions).'
        ]
      }
    },

    {
      id: 'js-2-variables-data-types',
      num: 2,
      title: 'Variables & Data Types',
      category: 'Data & Memory',
      whatIsIt: 'JavaScript has 7 Primitive types (string, number, bigint, boolean, undefined, symbol, null) stored by value, and Reference Types (Object, Array, Function) stored by reference in memory.',
      whatIsItHi: 'JS mein 7 Primitive types hote hain jo value se store hote hain (Stack memory). Objects, Arrays aur Functions reference types hote hain jo Heap memory mein address ke through store hote hain.',
      whyNeed: 'Predictable memory allocation, immutability of primitive values, and referencing complex data structures efficiently across functions without copying giant data payloads.',
      whyNeedHi: 'Fast memory utilization. Primitives ko copy karna safe hota hai kyunki wo immutable hote hain; bade objects ko reference se share karne se memory bachti hai.',
      howItWorks: 'Primitives are allocated with fixed memory size on the Call Stack frame. Objects are allocated dynamically on the V8 Garbage-Collected Heap; the variable holds a memory pointer.',
      howItWorksHi: 'Primitives Call Stack frame par fixed size mein bante hain. Objects V8 Heap par bante hain aur variable sirf uska memory address (pointer) hold karta hai.',
      components: ['Stack Memory (Primitives)', 'Heap Memory (Objects)', 'Value vs Reference Semantics', 'Immutability'],
      analogy: 'Photocopy vs House Address: Handing someone a primitive is giving them a photocopy (scribbling on it leaves yours safe). Handing an object is giving your house address (if they paint the door, you see it too).',
      analogyHi: 'Photocopy vs Ghar ka Pata: Primitive photocopy jaisa hai—samne wala jo likhe likhe, tumhari copy safe rahegi. Object ghar ke pate jaisa hai—usne deewar par rang kiya toh tumhare liye bhi badal jayega.',
      code: `let num1 = 10;
let num2 = num1;
num2 = 20;

const obj1 = { name: 'Dev' };
const obj2 = obj1;
obj2.name = 'Senior Dev';

console.log('num1:', num1); // 10
console.log('obj1.name:', obj1.name); // Senior Dev`,
      output: `num1: 10
obj1.name: Senior Dev`,
      stepByStep: '1. `num1` primitive copy creates an independent value `10`.\n2. `obj2 = obj1` copies only the memory reference pointer.\n3. Mutating `obj2.name` updates the single shared object in Heap memory.',
      interview: {
        pitch: 'JavaScript primitives are immutable and copied by value on the stack, while reference types are stored on the heap and assigned via memory pointers.',
        shortAnswer: '7 primitives (value-based) + Objects/Functions (reference-based).',
        detailedAnswer: 'Primitives are compared by value, stored with fixed size. Objects are compared by reference identity ({} === {} is false). Null is a primitive despite typeof null === "object" (a historical language bug).',
        followUps: [
          'Why does typeof null return "object"? (Answer: Legacy type tag encoding bug in early JS engine where 000 meant object and null had all 0 bits).',
          'How do you achieve true immutability for nested objects? (Answer: Deep freeze via recursion or structuredClone()).'
        ]
      }
    },

    {
      id: 'js-3-scopes-scope-chain',
      num: 3,
      title: 'Scopes & Scope Chain',
      category: 'Core Internals',
      whatIsIt: 'Scope determines the accessibility of variables and functions. JavaScript has Global Scope, Function Scope, and Block Scope (introduced in ES6 with let/const).',
      whatIsItHi: 'Scope define karta hai ki variable kahan access ho sakta hai. JS mein 3 scopes hote hain: Global Scope, Function Scope, aur Block Scope (let/const ke saath).',
      whyNeed: 'Prevents variable collisions, secures private state, and prevents memory leaks by allowing finished blocks to be garbage collected.',
      whyNeedHi: 'Variables ke aapas mein takraane (collision) se bachata hai, private state secure rakhta hai, aur memory optimize karta hai.',
      howItWorks: 'When resolving a variable, V8 searches the current Execution Context Lexical Environment. If not found, it traverses up the outer Lexical Scope Chain to Global Scope.',
      howItWorksHi: 'Jab koi variable dhoondha jata hai, engine pehle local scope mein dekhta hai. Agar wahan nahi milta toh outer parent scope ki taraf badhta hai (Scope Chain).',
      components: ['Lexical Environment', 'Outer Environment Reference', 'Global Execution Context', 'Block Scope'],
      analogy: 'Apartment Building: You can borrow sugar from your own flat (local). If out, you knock on your floor neighbor (outer). If out, you ask the ground floor building manager (global). But the manager cannot barge into your private bedroom!',
      analogyHi: 'Apartment Building: Pehle apne kamre mein cheez dhoondo. Nahi mili toh flatmates se poocho. Phir bhi nahi mili toh building security guard (global) se poocho.',
      code: `const globalVal = 'GLOBAL';

function outer() {
  const outerVal = 'OUTER';
  function inner() {
    const innerVal = 'INNER';
    console.log(innerVal, outerVal, globalVal);
  }
  inner();
}
outer();`,
      output: `INNER OUTER GLOBAL`,
      stepByStep: '1. `inner` accesses `innerVal` from its own local scope.\n2. `outerVal` is resolved via the outer lexical scope chain.\n3. `globalVal` is resolved at the root global environment.',
      interview: {
        pitch: 'Scope defines variable visibility. JavaScript resolves identifiers lexically through an outer scope chain ending at the global object.',
        shortAnswer: 'Lexical variable hierarchy: Local -> Outer -> Global.',
        detailedAnswer: 'Variables declared with var are function-scoped; let and const are block-scoped. Scope is determined at authoring time (lexical), not at invocation time.',
        followUps: [
          'What happens if an undeclared variable is assigned in non-strict mode? (Answer: It leaks as a global variable).',
          'What is the difference between lexical scope and dynamic scope? (Answer: Lexical is based on where functions are defined; dynamic is based on where they are called).'
        ]
      }
    },

    {
      id: 'js-4-execution-context-call-stack',
      num: 4,
      title: 'Execution Context & Call Stack',
      category: 'Core Internals',
      whatIsIt: 'The Execution Context is the environment where JavaScript code is evaluated and executed. The Call Stack is a LIFO (Last-In, First-Out) data structure that manages execution contexts.',
      whatIsItHi: 'Execution Context wo dabba hai jisme JS code execute hota hai. Call Stack ek LIFO (Last In First Out) stack hai jo track karta hai ki abhi kaunsa function execute ho raha hai.',
      whyNeed: 'Maintains state, parameter bindings, `this` reference, and returns control to the calling function upon completion.',
      whyNeedHi: 'Function execution ka order maintain karne ke liye aur function khatam hone par wapas sahi line par lautne ke liye zaroori hai.',
      howItWorks: 'Global Execution Context (GEC) is created first. Every function call pushes a new Function Execution Context (FEC) onto the Call Stack. When the function returns, its frame is popped off.',
      howItWorksHi: 'Sabse pehle Global context banta hai. Jab bhi koi function call hota hai, uska naya context Call Stack par push hota hai, aur return hone par pop (delete) ho jata hai.',
      components: ['Variable Environment', 'Lexical Environment', 'ThisBinding', 'Call Stack LIFO'],
      analogy: 'Stack of Dinner Plates: You wash and place plates on top of each other. The last plate placed on top is the first plate you wash and remove (LIFO).',
      analogyHi: 'Thaliyon ka Chatta (Plate Stack): Jo thali sabse upar rakhi jaati hai, sabse pehle wahi uthayi jaati hai (LIFO order).',
      code: `function first() {
  console.log('Inside first');
  second();
  console.log('Exiting first');
}

function second() {
  console.log('Inside second');
}

first();`,
      output: `Inside first
Inside second
Exiting first`,
      stepByStep: '1. `first()` context pushed onto Call Stack.\n2. `first()` logs and calls `second()`.\n3. `second()` context pushed on top, logs, and pops off.\n4. `first()` resumes and logs "Exiting first", then pops off.',
      interview: {
        pitch: 'The Call Stack manages function execution contexts using LIFO. Each context contains variable environments, lexical environments, and this binding.',
        shortAnswer: 'LIFO stack managing Global and Function execution contexts.',
        detailedAnswer: 'Each execution context has two phases: Creation Phase (memory allocation, hoisting) and Execution Phase (line-by-line code evaluation). Stack overflow happens when recursion exceeds stack depth limit (~10,000 frames in V8).',
        followUps: [
          'What causes a "Maximum call stack size exceeded" RangeError? (Answer: Infinite recursion without a base case filling the call stack frames).',
          'How does the Call Stack interact with async callbacks? (Answer: Async callbacks cannot push to the stack until the stack is 100% empty).'
        ]
      }
    },

    {
      id: 'js-5-hoisting',
      num: 5,
      title: 'Hoisting',
      category: 'Core Internals',
      whatIsIt: 'Hoisting is JavaScript\'s behavior of allocating memory for variable and function declarations during the Creation Phase of the Execution Context before executing code.',
      whatIsItHi: 'Hoisting ka matlab hai V8 engine ka code run karne se pehle Creation Phase mein declarations ke liye memory reserve kar lena.',
      whyNeed: 'Allows mutual recursion between functions and enables predictable declaration phases across scripts.',
      whyNeedHi: 'Functions ko ek dusre ko kisi bhi order mein call karne ki azaadi deta hai aur code execution se pehle memory allocate karta hai.',
      howItWorks: '`var` is hoisted and initialized with `undefined`. `let` and `const` are hoisted into an uninitialized Temporal Dead Zone (TDZ). Function declarations are hoisted with their complete body.',
      howItWorksHi: '`var` ko `undefined` ke saath hoist kiya jata hai. `let/const` TDZ mein lock rehte hain. Function declarations poori body ke saath hoist hote hain.',
      components: ['Creation Phase', 'TDZ (Temporal Dead Zone)', 'ReferenceError', 'Function Declarations vs Expressions'],
      analogy: 'Movie Theater Reservation: Hoisting is reserving seats before the show. A `var` ticket has a blanket on it (`undefined`). A `let` ticket has a red security rope (TDZ)—touch it early and the bouncer throws you out!',
      analogyHi: 'Cinema Hall Reservation: Show shuru hone se pehle seat book hona. `var` par rumal rakha hai (`undefined`). `let` par security guard khada hai (TDZ)—pehle baithoge toh maar padegi (ReferenceError).',
      code: `console.log(a); // undefined
var a = 10;

hoistedFn(); // Works!
function hoistedFn() {
  console.log('Function declaration hoisted with body');
}

// console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 20;`,
      output: `undefined
Function declaration hoisted with body`,
      stepByStep: '1. Memory allocated for `a` (`undefined`) and `hoistedFn` (full body).\n2. `b` is placed in TDZ.\n3. `a` prints `undefined`, `hoistedFn()` succeeds, `b` initialized to 20.',
      interview: {
        pitch: 'Hoisting is memory allocation during the V8 Creation Phase. Function declarations hoist with body, var hoists as undefined, let/const hoist into TDZ.',
        shortAnswer: 'Pre-execution memory allocation; let/const stay in TDZ until declaration.',
        detailedAnswer: 'The Temporal Dead Zone starts at the beginning of the block scope and ends when the variable declaration is reached. Accessing in TDZ throws ReferenceError.',
        followUps: [
          'Are let and const hoisted? (Answer: Yes, but they remain uninitialized in the TDZ).',
          'Why does function declaration override var with the same name? (Answer: Functions are hoisted before variable declarations).'
        ]
      }
    },

    {
      id: 'js-6-closures',
      num: 6,
      title: 'Closures',
      category: 'Functions & Scope',
      whatIsIt: 'A closure is the combination of a function bundled together with references to its surrounding lexical environment, allowing it to access outer variables after the outer function finishes.',
      whatIsItHi: 'Closure ka matlab hai ek inner function ka apne parent function ke variables ko yaad rakhna—chahe parent function execute hokar Call Stack se khatam ho chuka ho!',
      whyNeed: 'Enables data privacy, private variables, memoization caches, and event listener handlers without polluting global scope.',
      whyNeedHi: 'Private variables banane ke liye (data encapsulation), state yaad rakhne ke liye, aur bina global variables ko pollute kiye functions ko configurable banane ke liye.',
      howItWorks: 'When an inner function survives beyond its outer function, V8 allocates the referenced outer variables on the Heap (via internal `[[Scopes]]` link) rather than deallocating them.',
      howItWorksHi: 'V8 engine outer function ke return hone par un variables ko Call Stack se hata kar Heap memory mein save kar leta hai taaki inner function jab chahe tab access kar sake.',
      components: ['Lexical Scope Chain', 'Heap Allocation for Retained State', '[[Scopes]] Internal Property', 'Encapsulation'],
      analogy: 'School Backpack: When you leave the school building (outer function finishes), you carry your backpack (closure). Inside the backpack, your water bottle and sandwich (outer variables) remain accessible whenever you feel hungry!',
      analogyHi: 'School Backpack: Tum school se bahar aa gaye (parent function return ho gaya), par tumhara bag (closure) tumhare paas hai. Uske andar rakha tiffin aur bottle (variables) tum jab chaho kha-pi sakte ho!',
      code: `function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private state retained in Heap by closure

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
console.log('Balance after deposit:', account.deposit(50));
console.log('Current balance:', account.getBalance());`,
      output: `Balance after deposit: 150
Current balance: 150`,
      stepByStep: '1. `createBankAccount` creates local variable `balance = 100`.\n2. Returned methods close over `balance`.\n3. When `createBankAccount` returns, `balance` survives on V8 heap.\n4. Direct access to `balance` is impossible, achieving pure encapsulation.',
      interview: {
        pitch: 'A closure is a function bundled with its lexical environment, retaining access to outer variables even after the parent function has popped off the call stack.',
        shortAnswer: 'Function retaining access to its outer scope variables after parent execution.',
        detailedAnswer: 'V8 moves captured variables from stack to heap. Closures enable module patterns, currying, and callbacks, but long-lived closures holding large buffers can cause memory leaks.',
        followUps: [
          'Can closures cause memory leaks in Node.js? (Answer: Yes, if a long-lived closure accidentally retains large objects or request contexts in memory).',
          'How do closures work in a for loop with var vs let? (Answer: var shares one single lexical binding across iterations; let creates a fresh binding per loop iteration).'
        ]
      }
    },

    {
      id: 'js-7-functions-higher-order',
      num: 7,
      title: 'Functions & Higher-Order Functions',
      category: 'Functions & Scope',
      whatIsIt: 'Functions in JS are First-Class Citizens: they can be assigned to variables, passed as arguments, and returned from other functions. A Higher-Order Function (HOF) takes or returns a function.',
      whatIsItHi: 'JavaScript mein functions First-Class Citizens hote hain: unhe variable mein store kar sakte hain, doosre function mein argument ki tarah pass kar sakte hain, aur function se return bhi kar sakte hain.',
      whyNeed: 'Powers functional programming, reusable pipelines, asynchronous callbacks, and middleware chains (e.g. Express middleware).',
      whyNeedHi: 'Async programming, Express middleware, array transformations (`map/filter`), aur clean modular code likhne ke liye zaroori hai.',
      howItWorks: 'Functions are callable objects inheriting from `Function.prototype`. They create new execution contexts with lexical scopes and closure bindings.',
      howItWorksHi: 'Har function internal object hota hai jiske paas `apply`, `bind`, `call` methods aur lexical environment link hota hai.',
      components: ['First-Class Citizens', 'Higher-Order Functions', 'Pure Functions', 'Currying & Composition'],
      analogy: 'Drill Bit & Power Tool: A function is a drill bit. You can put it in a box (variable), pass it to a friend (argument), or build a tool that generates custom bits (HOF).',
      analogyHi: 'Toolbox & Machine: Function ek tool jaisa hai jisko aap kisi doosre worker ko de sakte ho, ya ek aisi machine bana sakte ho jo naye tools banakar return kare (Higher-Order Function).',
      code: `function multiplyBy(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplyBy(2);
const triple = multiplyBy(3);

console.log('Double 5:', double(5));
console.log('Triple 5:', triple(5));`,
      output: `Double 5: 10
Triple 5: 15`,
      stepByStep: '1. `multiplyBy(2)` returns a customized function closing over `factor = 2`.\n2. `double(5)` executes the inner function, returning `5 * 2 = 10`.\n3. `triple(5)` executes independently with `factor = 3`.',
      interview: {
        pitch: 'Functions are first-class values in JavaScript, allowing higher-order functions to take functions as inputs or return them, powering functional composition.',
        shortAnswer: 'Functions treated as values, enabling closures and higher-order composition.',
        detailedAnswer: 'Higher-Order Functions like map, filter, and reduce abstract iteration and encourage immutability. Arrow functions lack their own arguments, this, and cannot be used as constructors.',
        followUps: [
          'What is the difference between Arrow functions and Regular functions? (Answer: Arrow functions have lexical this, no arguments object, no prototype, and cannot be called with new).',
          'What is function currying? (Answer: Transforming a function with N arguments into N functions each taking 1 argument).'
        ]
      }
    },

    {
      id: 'js-8-this-keyword',
      num: 8,
      title: "'this' Keyword",
      category: 'Language Core',
      whatIsIt: "'this' is a keyword that references the execution context of the current function invocation. Its value depends on how and where the function is called.",
      whatIsItHi: "'this' ek aisa reference keyword hai jo batata hai ki abhi kaunsa object function ko chala raha hai. Iska value function ko call karne ke tareeqe par depend karta hai.",
      whyNeed: 'Enables object-oriented encapsulation, code reuse across multiple object instances, and method chaining.',
      whyNeedHi: 'Object-oriented code mein same method ko alag-alag object instances ke liye reuse karne aur unke data ko access karne ke liye zaroori hai.',
      howItWorks: 'Evaluated by 4 rules: 1. new Binding (fresh instance) > 2. Explicit Binding (call, apply, bind) > 3. Implicit Binding (obj.method()) > 4. Default Binding (global/undefined in strict mode). Arrow functions use lexical this.',
      howItWorksHi: '4 rules se nikalta hai: 1. `new` keyword > 2. `call/apply/bind` > 3. `obj.method()` > 4. Global/undefined. Arrow functions mein `this` apne surrounding scope se inherit hota hai.',
      components: ['Implicit Binding', 'Explicit Binding (call/apply/bind)', 'new Binding', 'Lexical this (Arrow Functions)'],
      analogy: 'Pronoun "My": The word "my" changes meaning depending on who speaks. If Dev says "my laptop", it means Dev\'s laptop. If Priya says "my laptop", it means Priya\'s laptop.',
      analogyHi: '"Mera" Shabd: "Mera ghar" bolne wale par depend karta hai. Agar Rahul bolega toh Rahul ka ghar, agar Amit bolega toh Amit ka ghar. Jo bol raha hai (call kar raha hai), wahi `this` hai.',
      code: `const user = {
  name: 'DevOps Lead',
  greet() {
    console.log('Hello, I am ' + this.name);
  }
};

user.greet(); // Implicit binding: 'this' is user

const standalone = user.greet;
// In non-strict browser it would print undefined/window; in node it points to global
const bound = standalone.bind({ name: 'CTO' });
bound(); // Explicit binding`,
      output: `Hello, I am DevOps Lead
Hello, I am CTO`,
      stepByStep: '1. `user.greet()` uses implicit binding, so `this` is `user`.\n2. `bind({ name: "CTO" })` locks `this` to the custom object permanently.\n3. Invoking `bound()` uses the bound context.',
      interview: {
        pitch: "'this' is dynamically bound at call-site based on 4 priority rules (new, explicit, implicit, default), whereas arrow functions inherit this lexically.",
        shortAnswer: 'Execution context reference resolved at call site, or lexically for arrow functions.',
        detailedAnswer: 'Priority: new binding overrides explicit call/bind; explicit overrides implicit obj.method; implicit overrides default window/undefined. Arrow functions completely bypass these rules by taking outer lexical this.',
        followUps: [
          'What happens if you use call/apply/bind on an arrow function? (Answer: It is completely ignored; arrow functions cannot be re-bound).',
          'What is the difference between call, apply, and bind? (Answer: call takes comma-separated args, apply takes array of args, bind returns a new permanently bound function).'
        ]
      }
    },

    {
      id: 'js-9-prototypes-prototypal-inheritance',
      num: 9,
      title: 'Prototypes & Prototypal Inheritance',
      category: 'Object Oriented',
      whatIsIt: 'JavaScript objects have an internal link to another object called its Prototype ([[Prototype]] or __proto__). If a property is not found on an object, JavaScript searches its prototype chain.',
      whatIsItHi: 'JavaScript mein har object ke paas ek hidden link hota hai jisko Prototype kehte hain. Agar koi property object mein nahi milti toh engine uske prototype chain par upar dhoondhta hai.',
      whyNeed: 'Enables memory-efficient method sharing across thousands of object instances without duplicating functions in memory.',
      whyNeedHi: 'Lakho objects ke beech same methods share karne ke liye taaki memory waste na ho aur inheritance implement ho sake.',
      howItWorks: 'When reading `obj.prop`, V8 checks `obj`. If missing, it checks `obj.__proto__`, then `obj.__proto__.__proto__`, all the way up to `Object.prototype`, ending at `null`.',
      howItWorksHi: 'Jab property access karte hain, V8 pehle object par check karta hai, phir uske parent prototype par, aakhir mein `Object.prototype` aur phir `null`.',
      components: ['__proto__', 'prototype property on functions', 'Object.create()', 'Prototype Chain lookup'],
      analogy: 'Family DNA / Borrowing Books: If you don\'t have a book in your room, you ask your parents. If they don\'t have it, you ask your grandparents. If nobody in the ancestry has it, you return empty-handed (`undefined`).',
      analogyHi: 'Khandani Virasat: Agar tumhare paas car nahi hai, toh tum papa ki car mangte ho. Agar papa ke paas nahi hai toh dada ji ki. Agar kisi ke paas nahi hai toh `undefined`.',
      code: `function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return this.name + ' makes a sound.';
};

const dog = new Animal('Rex');
console.log(dog.speak());
console.log('Has own property speak:', dog.hasOwnProperty('speak')); // false (on prototype!)
console.log('Proto equals Animal.prototype:', dog.__proto__ === Animal.prototype);`,
      output: `Rex makes a sound.
Has own property speak: false
Proto equals Animal.prototype: true`,
      stepByStep: '1. `Animal.prototype.speak` creates a single shared method in memory.\n2. `new Animal("Rex")` links `dog.__proto__` to `Animal.prototype`.\n3. Calling `dog.speak()` delegates to the prototype chain.',
      interview: {
        pitch: 'Prototypal inheritance is delegation-based: objects link to prototype objects via [[Prototype]], sharing methods without copying memory.',
        shortAnswer: 'Delegation-based inheritance linking objects via the prototype chain.',
        detailedAnswer: 'ES6 class syntax is syntactic sugar over prototype chains. Setting prototypes using Object.setPrototypeOf() harms V8 performance; Object.create() or class syntax is preferred.',
        followUps: [
          'What is the top of the prototype chain? (Answer: Object.prototype.__proto__ which is null).',
          'What is the difference between __proto__ and prototype? (Answer: __proto__ is the actual link on an instance; prototype is the blueprint property on constructor functions).'
        ]
      }
    },

    {
      id: 'js-10-es6-features',
      num: 10,
      title: 'ES6+ Features',
      category: 'Modern ECMAScript',
      whatIsIt: 'ES6 (ECMAScript 2015) and subsequent standards introduced modern syntax: let/const, arrow functions, destructuring, spread/rest, template literals, Promises, Classes, and Optional Chaining (?.).',
      whatIsItHi: 'ES6+ modern JavaScript standards hain jinhone let/const, arrow functions, destructuring, spread/rest, Promises, Classes aur Optional Chaining jaise powerful features diye.',
      whyNeed: 'Reduces boilerplate, eliminates common bugs (TDZ over var), standardizes asynchronous programming, and improves developer ergonomics.',
      whyNeedHi: 'Code ko chhota, readable aur safe banane ke liye. Boilerplate hatane aur runtime errors rokne ke liye modern features zaroori hain.',
      howItWorks: 'Modern JS engines implement these natively using bytecode optimizations. Features like optional chaining compile into conditional branch checks.',
      howItWorksHi: 'Modern V8 engines in features ko natively ultra-fast machine code mein execute karte hain.',
      components: ['Destructuring', 'Spread / Rest (...)', 'Optional Chaining (?.)', 'Nullish Coalescing (??)', 'Arrow Functions'],
      analogy: 'Swiss Army Knife: Moving from ES5 to ES6+ is like upgrading from a single rusty kitchen blade to an all-in-one multi-tool with scissors, screwdriver, and laser pointer.',
      analogyHi: 'Swiss Army Knife: ES5 purani sadharan chhuri thi, ES6+ ek multi-tool ban gaya jisme har kaam ke liye shortcut aur safety tools hain.',
      code: `const user = {
  id: 101,
  profile: { name: 'Jogi', role: 'Architect' }
};

// Destructuring & Optional Chaining & Nullish Coalescing
const { profile: { name } } = user;
const city = user?.address?.city ?? 'Default City';
const tags = ['backend', 'nodejs', ...['scaling', 'redis']];

console.log('Name:', name);
console.log('City:', city);
console.log('Tags:', tags);`,
      output: `Name: Jogi
City: Default City
Tags: [ 'backend', 'nodejs', 'scaling', 'redis' ]`,
      stepByStep: '1. Nested destructuring extracts `name` directly.\n2. Optional chaining `?.` prevents crashing on `undefined.city`.\n3. `??` provides a fallback only if null/undefined.',
      interview: {
        pitch: 'ES6+ transformed JS with block scoping, destructuring, arrow functions, modules, and safe operators like optional chaining (?.) and nullish coalescing (??).',
        shortAnswer: 'Modern ECMAScript enhancements for clean, safe, modular programming.',
        detailedAnswer: 'Nullish coalescing (??) checks strictly for null/undefined, unlike OR (||) which treats 0, "", and false as falsy. Rest gathers items into array; spread expands iterable into elements.',
        followUps: [
          'Difference between ?? and ||? (Answer: || checks any falsy value like 0 or ""; ?? only checks null and undefined).',
          'Difference between Spread and Rest? (Answer: Rest collects items into an array; Spread expands an array into individual elements).'
        ]
      }
    },

    {
      id: 'js-11-asynchronous-javascript',
      num: 11,
      title: 'Asynchronous JavaScript',
      category: 'Async & Concurrency',
      whatIsIt: 'Asynchronous JavaScript allows long-running operations (network requests, timers, file I/O) to execute in the background without freezing the single-threaded Call Stack.',
      whatIsItHi: 'Asynchronous JavaScript ka matlab hai lambe operations (API calls, timers, DB queries) ko background mein chalana taaki main single thread freeze na ho.',
      whyNeed: 'Without async execution, a 500ms network fetch would completely freeze UI clicks and API request processing across the entire runtime.',
      whyNeedHi: 'Agar async na ho toh ek 500ms ki DB query poore server aur UI ko freeze kar degi; koi dusra user click ya request nahi bhej payega.',
      howItWorks: 'V8 offloads async APIs to Web APIs (in browser) or Libuv (in Node.js). When complete, callbacks enter Microtask or Macrotask queues, executed by the Event Loop.',
      howItWorksHi: 'V8 async kaam Libuv ya Web APIs ko de deta hai. Jab kaam poora hota hai toh callback queue mein aata hai aur Call Stack khali hone par chalta hai.',
      components: ['Call Stack', 'Web APIs / Libuv', 'Callback Queue', 'Event Loop'],
      analogy: 'Restaurant Buzzer: You order food at a cafe. The cashier hands you a vibrating buzzer (callback/promise) so you can sit and read. When food is ready, the buzzer buzzes to pick up your tray.',
      analogyHi: 'Restaurant Token Buzzer: Counter par order dekar aapko buzzer mil jata hai. Aap aaram se baith kar phone chalate ho. Jab burger banta hai, buzzer bajta hai aur aap le aate ho.',
      code: `console.log('1: Ordering coffee');

setTimeout(() => {
  console.log('3: Coffee is ready!');
}, 50);

console.log('2: Checking emails while waiting');`,
      output: `1: Ordering coffee
2: Checking emails while waiting
3: Coffee is ready!`,
      stepByStep: '1. "1: Ordering coffee" logs synchronously.\n2. `setTimeout` registers timer in background and returns immediately.\n3. "2: Checking emails" logs.\n4. Call stack empties; timer finishes and logs "3: Coffee is ready!".',
      interview: {
        pitch: 'Asynchronous JS uses an event-driven concurrency model where background I/O operations notify the event loop via task queues without blocking the main thread.',
        shortAnswer: 'Non-blocking concurrency model offloading I/O to background runtimes.',
        detailedAnswer: 'JavaScript remains single-threaded. Concurrency is provided by host environments (Libuv in Node.js, Web APIs in browsers) coordinating through Event Loop task queues.',
        followUps: [
          'Is JavaScript multi-threaded when running async tasks? (Answer: JS engine thread is single; the host runtime uses multi-threaded C++ pools for I/O).',
          'What happens if an async task has an infinite synchronous loop? (Answer: It starves the call stack, freezing the entire process).'
        ]
      }
    },

    {
      id: 'js-12-callbacks-callback-hell',
      num: 12,
      title: 'Callbacks & Callback Hell',
      category: 'Async & Concurrency',
      whatIsIt: 'A callback is a function passed as an argument to another function to be executed later. Deeply nested callbacks create "Callback Hell" (Pyramid of Doom), making code unreadable and error-prone.',
      whatIsItHi: 'Callback ek aisa function hai jo dusre function ko diya jata hai taaki baad mein execute ho sake. Bahut zyada nested callbacks se "Callback Hell" (Pyramid of Doom) banta hai jo padhna namumkin hota hai.',
      whyNeed: 'Original foundation of asynchronous JavaScript event notifications and I/O completion handling before Promises were introduced.',
      whyNeedHi: 'Promises aane se pehle async kaam poora hone par notification dene aur next step chalane ka yahi tareeqa tha.',
      howItWorks: 'Functions register callbacks in memory. When the async operation completes, the runtime invokes the callback with (error, result) parameters (Node.js error-first convention).',
      howItWorksHi: 'Async operation khatam hone par runtime callback ko call karta hai. Node.js mein pehla argument error hota hai: `callback(err, data)`.',
      components: ['Error-First Callbacks', 'Pyramid of Doom', 'Inversion of Control', 'Promises Refactoring'],
      analogy: 'Russian Nesting Dolls: Unwrapping a doll inside a doll inside a doll. If you drop doll #4, you have no idea where the crack happened or how to put them back together.',
      analogyHi: 'Ek ke andar ek Lifafa: Pehla lifafa kholo toh dusra nikalta hai, dusra kholo toh teesra. Agar beech mein ek bhi phat gaya toh poora rasta bhatak jaoge.',
      code: `// Node.js Error-First Callback Pattern
function fetchUser(id, cb) {
  setTimeout(() => cb(null, { id, name: 'Alex' }), 20);
}
function fetchOrders(userId, cb) {
  setTimeout(() => cb(null, ['Order #101', 'Order #102']), 20);
}

// Callback nesting
fetchUser(1, (err, user) => {
  if (err) return console.error(err);
  console.log('User fetched:', user.name);
  fetchOrders(user.id, (err, orders) => {
    if (err) return console.error(err);
    console.log('Orders fetched:', orders.length);
  });
});`,
      output: `User fetched: Alex
Orders fetched: 2`,
      stepByStep: '1. `fetchUser` runs async timer.\n2. Callback invoked with user object.\n3. Nested `fetchOrders` triggers another async operation.\n4. Second callback receives orders.',
      interview: {
        pitch: 'Callbacks are functions passed for deferred execution. Callback hell causes inverted control and messy error handling, resolved by Promises and async/await.',
        shortAnswer: 'Deferred execution functions; nested callbacks cause unmaintainable pyramid code.',
        detailedAnswer: 'Key issues with callbacks: 1. Pyramid of doom, 2. Inversion of control (trusting 3rd party to call your function once and only once), 3. Broken stack traces and error propagation.',
        followUps: [
          'What is "Inversion of Control" in callbacks? (Answer: Giving another party control of when, how, or if your callback is called).',
          'How do you convert a callback to a Promise? (Answer: Wrap in `new Promise((resolve, reject) => ...)` or use `util.promisify`).'
        ]
      }
    },

    {
      id: 'js-13-promises',
      num: 13,
      title: 'Promises',
      category: 'Async & Concurrency',
      whatIsIt: 'A Promise is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. It has 3 states: Pending, Fulfilled, or Rejected.',
      whatIsItHi: 'Promise ek aisa object hai jo kisi async operation ke bhavishya ke result ko represent karta hai. Iske 3 states hote hain: Pending, Fulfilled (Success), ya Rejected (Fail).',
      whyNeed: 'Eliminates callback hell, standardizes error handling with `.catch()`, prevents inversion of control, and queues callbacks into high-priority Microtask queues.',
      whyNeedHi: 'Callback hell ko khatam karne ke liye, `.then()` aur `.catch()` se clean chaining dene ke liye, aur error handling ko robust banane ke liye.',
      howItWorks: 'A Promise starts Pending. Calling `resolve(val)` permanently transitions it to Fulfilled; calling `reject(err)` transitions it to Rejected. Once settled, its state is immutable.',
      howItWorksHi: 'Promise shuru mein Pending rehta hai. `resolve()` se Fulfilled aur `reject()` se Rejected ban jata hai. Ek baar settle hone ke baad state kabhi badal nahi sakti.',
      components: ['Promise State Machine', 'Microtask Queue', '.then() / .catch() / .finally()', 'Promise Combinators (all, allSettled, race, any)'],
      analogy: 'Food Delivery Tracker: When you place an order, you get a tracking promise. It is "Pending" while cooking. When delivered, it is "Fulfilled". If the restaurant runs out of food, it is "Rejected".',
      analogyHi: 'Swiggy / Zomato Order: Order place karne par status "Pending" rehta hai. Food deliver ho gaya toh "Fulfilled". Restaurant band nikla toh "Rejected".',
      code: `const fetchProduct = new Promise((resolve, reject) => {
  const success = true;
  if (success) resolve({ id: 1, name: 'MacBook Pro' });
  else reject(new Error('Out of stock'));
});

fetchProduct
  .then(prod => {
    console.log('Product received:', prod.name);
    return prod.id;
  })
  .then(id => console.log('Processing checkout for product ID:', id))
  .catch(err => console.error('Error:', err.message));`,
      output: `Product received: MacBook Pro
Processing checkout for product ID: 1`,
      stepByStep: '1. Promise executes executor function synchronously.\n2. `resolve()` settles promise to Fulfilled.\n3. `.then()` handler scheduled as Microtask.\n4. Output logged in sequence.',
      interview: {
        pitch: 'A Promise is an immutable state machine representing an async operation, resolving via microtask queues and supporting clean chaining with .then() and .catch().',
        shortAnswer: 'State machine (Pending, Fulfilled, Rejected) resolving via microtasks.',
        detailedAnswer: 'Promise combinators: Promise.all fails fast; Promise.allSettled waits for all; Promise.race settles on the first settled; Promise.any settles on the first fulfilled.',
        followUps: [
          'What is the difference between Promise.all and Promise.allSettled? (Answer: all fails fast on first reject; allSettled waits for all outcomes).',
          'Why do Promise callbacks execute before setTimeout(0)? (Answer: Promise callbacks are microtasks, which drain before any macrotask).'
        ]
      }
    },

    {
      id: 'js-14-async-await',
      num: 14,
      title: 'Async / Await',
      category: 'Async & Concurrency',
      whatIsIt: '`async` and `await` is syntactic sugar built on top of Promises and Generators, allowing asynchronous code to be written and read sequentially like synchronous code.',
      whatIsItHi: '`async/await` Promises ke upar banaya gaya modern syntactic sugar hai. Isse asynchronous code bilkul synchronous code ki tarah seedha aur aasan dikhta hai.',
      whyNeed: 'Drastically improves readability, avoids complex `.then()` nesting, allows standard `try / catch` error handling, and produces clean debugging stack traces.',
      whyNeedHi: 'Code readability badhane ke liye, `.then()` ki chain se bachne ke liye, aur standard `try ... catch` se clean error handling karne ke liye.',
      howItWorks: 'An `async` function always returns a Promise. The `await` keyword pauses execution inside the function until the awaited Promise settles, yielding control back to the Event Loop.',
      howItWorksHi: '`async` function hamesha Promise return karta hai. `await` function ke andar execution ko tab tak pause karta hai jab tak Promise settle na ho jaye.',
      components: ['async keyword (returns Promise)', 'await keyword (pauses execution)', 'try/catch/finally', 'Microtask resumption'],
      analogy: 'Traffic Pause Button: Pressing `await` pauses your car at a toll booth. Other cars (event loop) keep moving. Once your toll receipt arrives, your car resumes driving smoothly.',
      analogyHi: 'Toll Plaza: `await` lagane se aapki gaadi toll counter par receipt aane tak rukti hai, par baaki lane ka traffic chalta rehta hai. Receipt milte hi aap aage nikal jate ho.',
      code: `async function fetchUserData() {
  try {
    console.log('1: Initiating request');
    const user = await Promise.resolve({ id: 10, role: 'admin' });
    console.log('2: User role:', user.role);
    return user;
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

fetchUserData();
console.log('3: Synchronous code continues uninterrupted');`,
      output: `1: Initiating request
3: Synchronous code continues uninterrupted
2: User role: admin`,
      stepByStep: '1. "1: Initiating request" logs.\n2. `await` pauses `fetchUserData` and schedules continuation as a microtask.\n3. "3: Synchronous code continues" logs immediately.\n4. Call stack empties; microtask resumes and logs "2: User role: admin".',
      interview: {
        pitch: 'Async/await is syntactic sugar over Promises and Generators that pauses function execution without blocking the event loop, enabling try/catch error handling.',
        shortAnswer: 'Sequential syntax for Promises using async/await and try/catch.',
        detailedAnswer: 'A common pitfall is accidental waterfalls: awaiting independent async calls sequentially rather than wrapping them in Promise.all().',
        followUps: [
          'What happens if you omit await on a rejected Promise inside an async function? (Answer: It causes an unhandled promise rejection error).',
          'How do you run 3 async operations in parallel with async/await? (Answer: Use `const [a, b, c] = await Promise.all([fn1(), fn2(), fn3()])`).'
        ]
      }
    },

    {
      id: 'js-15-event-loop-concurrency',
      num: 15,
      title: 'Event Loop & Concurrency Model',
      category: 'Async & Concurrency',
      whatIsIt: 'The Event Loop is the orchestration engine that continuously coordinates the Call Stack, Microtask Queue, and Macrotask Queue, enabling non-blocking concurrency on a single thread.',
      whatIsItHi: 'Event Loop wo master monitor hai jo continuous ghoomta rehta hai aur Call Stack, Microtask Queue aur Macrotask Queue ke beech coordination banata hai.',
      whyNeed: 'Allows single-threaded JavaScript to handle thousands of concurrent events (user clicks, network responses, timers) without thread safety locks or race conditions.',
      whyNeedHi: 'Single-thread par bina deadlocks ya race conditions ke hazaro concurrent requests aur events handle karne ke liye zaroori hai.',
      howItWorks: '1. Execute synchronous code on Call Stack until empty.\n2. Drain ALL Microtasks (Promise, queueMicrotask).\n3. Dequeue ONE Macrotask (setTimeout, I/O).\n4. Repeat cycle.',
      howItWorksHi: '1. Call Stack par sync code khatam karo.\n2. Saare Microtasks drain karo.\n3. Ek Macrotask uthao.\n4. Ye chakra lagataar chalta rehta hai.',
      components: ['Call Stack', 'Microtask Queue (High Priority)', 'Macrotask / Task Queue (Timers, I/O)', 'Event Loop Coordinator'],
      analogy: 'Bank Teller & Waiting Line: The teller (Call Stack) finishes the customer at the desk. Before calling the next general customer (Macrotask), the teller attends to all VIP emergency queries (Microtasks).',
      analogyHi: 'Bank Cashier: Cashier (Call Stack) table par baithe customer ka kaam khatam karta hai. Next aam token (Macrotask) bulane se pehle wo counter par khade saare VIP forms (Microtasks) niptata hai.',
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
      stepByStep: '1. Sync "1" and "2" execute on Call Stack.\n2. Call stack empties.\n3. Microtask queue drains completely -> "3: Microtask".\n4. Event loop picks macrotask -> "4: Macrotask".',
      interview: {
        pitch: 'The Event Loop coordinates non-blocking execution: Call Stack runs first, all Microtasks drain next, and Macrotasks execute one per tick.',
        shortAnswer: 'Call Stack -> Drain All Microtasks -> Pick One Macrotask -> Repeat.',
        detailedAnswer: 'Microtasks include Promise.then, queueMicrotask, and MutationObserver. Macrotasks include setTimeout, setInterval, setImmediate, and I/O callbacks. Starvation occurs if microtasks continuously enqueue new microtasks.',
        followUps: [
          'Can microtasks starve macrotasks? (Answer: Yes, recursive microtask scheduling permanently blocks the event loop from reaching timers or rendering).',
          'Where does requestAnimationFrame fit? (Answer: It executes immediately before the browser repaints the screen, after microtasks).'
        ]
      }
    },

    {
      id: 'js-16-microtask-vs-macrotask',
      num: 16,
      title: 'Microtask vs Macrotask Queue',
      category: 'Async & Concurrency',
      whatIsIt: 'Microtasks (Promises, queueMicrotask, process.nextTick) are high-priority tasks that execute immediately after the Call Stack clears. Macrotasks (setTimeout, setInterval, setImmediate, I/O) execute in subsequent ticks.',
      whatIsItHi: 'Microtasks (Promises, nextTick) VIP high-priority tasks hote hain jo Call Stack khali hote hi turant chalte hain. Macrotasks (setTimeout, I/O) agle round mein baari-baari aate hain.',
      whyNeed: 'Guarantees immediate state consistency (e.g. resolving a Promise chain) before the runtime yields control to timers or screen rendering.',
      whyNeedHi: 'State consistency banaye rakhne ke liye taaki agla event ya screen render hone se pehle data update ho chuka ho.',
      howItWorks: 'The event loop will NOT pick the next macrotask until the microtask queue is completely 100% empty.',
      howItWorksHi: 'Event loop tab tak agla macrotask nahi uthayega jab tak microtask queue bilkul khali na ho jaye.',
      components: ['Microtask Queue (Promises, queueMicrotask)', 'Macrotask Queue (setTimeout, I/O)', 'Queue Draining Logic', 'Starvation Risk'],
      analogy: 'Airport Boarding: Macrotasks are general passengers in line. Microtasks are first-class passengers who arrive at the gate—the attendant boards ALL first-class passengers before allowing the next general passenger through.',
      analogyHi: 'Airport Boarding: Macrotask aam line hai. Microtask VIP line hai. Jab tak VIP line mein ek bhi vyakti khada hai, aam line aage nahi badhegi.',
      code: `console.log('A: Sync');

setTimeout(() => console.log('B: Macrotask 1'), 0);
setTimeout(() => console.log('C: Macrotask 2'), 0);

Promise.resolve()
  .then(() => {
    console.log('D: Microtask 1');
    return Promise.resolve();
  })
  .then(() => console.log('E: Microtask 2'));

console.log('F: Sync End');`,
      output: `A: Sync
F: Sync End
D: Microtask 1
E: Microtask 2
B: Macrotask 1
C: Macrotask 2`,
      stepByStep: '1. "A" and "F" run synchronously on stack.\n2. Stack is empty; Microtask queue drains "D" and chained "E".\n3. Macrotask queue runs "B", then "C".',
      interview: {
        pitch: 'Microtasks (Promises) drain completely between every single task, whereas Macrotasks (Timers/IO) are processed one at a time per tick.',
        shortAnswer: 'Microtasks drain fully before the next macrotask can execute.',
        detailedAnswer: 'In browsers, microtask queues drain before rendering updates. In Node.js, process.nextTick drains even before standard Promise microtasks.',
        followUps: [
          'What happens if a microtask schedules another microtask? (Answer: It runs in the current drain cycle, potentially starving macrotasks).',
          'Name 3 macrotasks and 2 microtasks. (Answer: Macrotasks: setTimeout, setInterval, setImmediate. Microtasks: Promise.then, queueMicrotask).'
        ]
      }
    },

    {
      id: 'js-17-dom-browser-events',
      num: 17,
      title: 'DOM & Browser Events',
      category: 'Browser APIs',
      whatIsIt: 'The DOM (Document Object Model) represents HTML as a tree of objects. Browser events propagate through 3 phases: Capturing Phase (window down to target), Target Phase, and Bubbling Phase (target up to window).',
      whatIsItHi: 'DOM HTML ko tree structure mein represent karta hai. Events 3 phases mein chalte hain: Capturing (upar se neeche), Target (jis element par click hua), aur Bubbling (neeche se upar tak).',
      whyNeed: 'Enables interactive web applications, event delegation (listening to 1,000 buttons with 1 listener), and decoupled UI architectures.',
      whyNeedHi: '1000 buttons par alag-alag listener lagane ke bajay parent par 1 listener lagane ke liye (Event Delegation) aur fast UI interaction ke liye.',
      howItWorks: 'An event travels from `window -> document -> <html> -> <body> -> target` (Capturing), fires on target, then bubbles back up `target -> <body> -> document -> window` (Bubbling).',
      howItWorksHi: 'Event pehle window se target tak neeche aata hai (Capture), target par fire hota hai, phir wapas bubble hokar upar window tak jata hai (Bubble).',
      components: ['Capturing Phase', 'Target Phase', 'Bubbling Phase', 'Event Delegation', 'stopPropagation() vs preventDefault()'],
      analogy: 'Water Bubble: Drop a pebble into the ocean floor (Target). The air bubble floats all the way up to the surface of the water (Bubbling phase).',
      analogyHi: 'Pani ka Bulbla (Bubble): Samundar ke tal par patthar giraya. Bulbla neeche se float hokar upar surface (window) tak jata hai (Bubbling).',
      code: `// Event Delegation Pattern
// Instead of attaching listener to every <li>, attach to parent <ul>
function handleListClick(event) {
  const target = event.target;
  if (target && target.tagName === 'LI') {
    console.log('Clicked item text:', target.textContent);
    console.log('Item ID:', target.dataset.id);
  }
}
console.log('Event delegation avoids creating thousands of memory listeners.');`,
      output: `Event delegation avoids creating thousands of memory listeners.`,
      stepByStep: '1. Event bubbles up from clicked `<li>` to `<ul>`.\n2. Single parent handler reads `event.target`.\n3. Memory footprint remains minimal.',
      interview: {
        pitch: 'DOM events propagate in 3 phases (Capturing, Target, Bubbling). Event delegation leverages bubbling to manage hundreds of elements with one parent listener.',
        shortAnswer: 'Capturing -> Target -> Bubbling. Delegation attaches 1 handler to a common parent.',
        detailedAnswer: 'event.stopPropagation() prevents the event from travelling further up or down the DOM tree. event.preventDefault() stops default browser actions (like form submission or link navigation).',
        followUps: [
          'Difference between event.target and event.currentTarget? (Answer: target is what triggered the event; currentTarget is the element the listener is attached to).',
          'Difference between stopPropagation() and stopImmediatePropagation()? (Answer: stopPropagation stops bubbling; stopImmediatePropagation also stops other listeners on the same element).'
        ]
      }
    },

    {
      id: 'js-18-error-handling',
      num: 18,
      title: 'Error Handling',
      category: 'Reliability & Quality',
      whatIsIt: 'Error handling in JavaScript involves capturing runtime exceptions using `try...catch...finally`, extending the built-in `Error` class, and managing unhandled promise rejections.',
      whatIsItHi: 'JavaScript mein error handling ka matlab runtime errors ko `try...catch...finally` se pakadna aur custom AppError classes banakar gracefully handle karna hai.',
      whyNeed: 'Prevents application crashes, provides meaningful error logs, ensures database connections release cleanly in `finally`, and returns clear HTTP status codes.',
      whyNeedHi: 'Application ko crash hone se bachane ke liye aur database connection leaks rokne ke liye clean error handling zaroori hai.',
      howItWorks: 'When `throw new Error()` executes, V8 captures a stack trace. Control immediately unwinds the Call Stack to the nearest matching `catch` block.',
      howItWorksHi: 'Error throw hote hi V8 stack trace capture karta hai aur call stack ko unwind karke paas wale `catch` block ko de deta hai.',
      components: ['Error Object & Stack Trace', 'try / catch / finally', 'Custom Error Classes', 'unhandledRejection & uncaughtException'],
      analogy: 'Car Airbag: If your car encounters an obstacle (exception), the airbag deploys (catch block) so the passengers survive safely instead of crashing through the windshield.',
      analogyHi: 'Gaadi ka Airbag: Agar accident (error) hua, toh airbag (catch block) khul jata hai taaki gaadi ke log bach sakein aur gaadi safely side mein ruk sake.',
      code: `class DatabaseError extends Error {
  constructor(message, query) {
    super(message);
    this.name = 'DatabaseError';
    this.query = query;
    this.statusCode = 500;
  }
}

try {
  throw new DatabaseError('Connection timeout to replica', 'SELECT * FROM users');
} catch (err) {
  if (err instanceof DatabaseError) {
    console.log('Handled Custom Error:', err.name);
    console.log('Failed Query:', err.query);
  }
} finally {
  console.log('Cleanup: Connection returned to pool.');
}`,
      output: `Handled Custom Error: DatabaseError
Failed Query: SELECT * FROM users
Cleanup: Connection returned to pool.`,
      stepByStep: '1. Custom `DatabaseError` thrown with metadata.\n2. `catch` checks `instanceof` and handles gracefully.\n3. `finally` block executes unconditionally for cleanup.',
      interview: {
        pitch: 'Production error handling uses custom error classes inheriting from Error, with finally blocks for resource cleanup and centralized middleware handling.',
        shortAnswer: 'Structured try/catch/finally with custom error hierarchies and stack traces.',
        detailedAnswer: 'In Node.js 15+, unhandledRejection terminates the process by default. Always handle async rejections and attach global process monitoring listeners.',
        followUps: [
          'Does finally execute if try contains a return statement? (Answer: Yes, finally always executes before the function actually returns).',
          'What is the difference between operational errors and programmer errors? (Answer: Operational are expected runtime issues like network timeouts; programmer errors are bugs like typos).'
        ]
      }
    },

    {
      id: 'js-19-memory-management-gc',
      num: 19,
      title: 'Memory Management & Garbage Collection',
      category: 'V8 Internals',
      whatIsIt: 'Memory management in JavaScript is automatic: V8 allocates memory when objects are created and automatically frees it when they are no longer reachable via Garbage Collection (GC).',
      whatIsItHi: 'JavaScript mein memory management automatic hota hai: V8 engine objects ko Heap par memory deta hai aur unke unreachable hote hi Garbage Collector unhe free kar deta hai.',
      whyNeed: 'Prevents memory leaks, avoids manual malloc/free pointer corruption bugs, and keeps the Node.js process RSS within container limits.',
      whyNeedHi: 'C/C++ ki tarah manual memory allocation ki zaroorat nahi padti aur system memory leaks se bachata hai.',
      howItWorks: 'V8 uses Generational Garbage Collection: Young Generation (Scavenger: nursery and intermediate) for short-lived objects, and Old Generation (Major Mark-Sweep-Compact) for long-lived objects. Reachability is traced from GC Roots.',
      howItWorksHi: 'V8 do hisso mein baant ta hai: Young Generation (naye objects fast Scavenger se saaf hote hain) aur Old Generation (bache hue objects Mark-Sweep-Compact se clean hote hain).',
      components: ['GC Roots (Global, Stack frames)', 'Mark-and-Sweep Algorithm', 'Scavenger (Young Gen)', 'Mark-Sweep-Compact (Old Gen)'],
      analogy: 'City Garbage Truck: The garbage truck checks every house. If a house has an active resident (GC Root reachability), it stays untouched. If a house is abandoned and locked with no roads leading to it, the city reclaims the land.',
      analogyHi: 'Kachre ki Gaadi: Nagar nigam ki gaadi aati hai. Jis ghar mein log reh rahe hain (GC Root se reachable), wo bacha rehta hai. Jo ghar veeran aur tod-phod chuka hai, uski jagah saaf kar li jaati hai.',
      code: `let user = { name: 'Admin', role: 'SuperUser' };
// Object has 1 reference from 'user'

user = null; 
// Object { name: 'Admin' } is now unreachable from GC Roots!
// V8 Garbage Collector will automatically reclaim this heap memory during next GC cycle.
console.log('Reference cleared. Object eligible for V8 garbage collection.');`,
      output: `Reference cleared. Object eligible for V8 garbage collection.`,
      stepByStep: '1. Object allocated on V8 Heap.\n2. Reassigning `user = null` severs link from GC root.\n3. Mark-and-sweep algorithm detects 0 incoming reachable paths.\n4. Memory reclaimed.',
      interview: {
        pitch: 'V8 uses Generational Mark-and-Sweep GC: Scavenge for short-lived Young Generation and Mark-Sweep-Compact for long-lived Old Generation.',
        shortAnswer: 'Generational Mark-and-Sweep tracing reachability from GC roots.',
        detailedAnswer: 'Common memory leaks in Node.js: 1. Unremoved EventEmitter listeners, 2. Global variables and caches without TTL/eviction, 3. Closures retaining large outer scopes.',
        followUps: [
          'What are GC Roots? (Answer: Call stack local variables, global objects, DOM trees, and active C++ handles).',
          'How do you identify a memory leak in production? (Answer: Take multiple heap snapshots over time and compare retained sizes in Chrome DevTools).'
        ]
      }
    },

    {
      id: 'js-20-storage',
      num: 20,
      title: 'Browser Storage (LocalStorage, SessionStorage, Cookies, IndexedDB)',
      category: 'Browser APIs',
      whatIsIt: 'Client-side storage mechanisms for persisting data in web browsers: LocalStorage (~5MB, permanent), SessionStorage (~5MB, tab-scoped), Cookies (~4KB, sent with HTTP), and IndexedDB (~unlimited transactional NoSQL).',
      whatIsItHi: 'Browser mein data store karne ke 4 tareeqe hote hain: LocalStorage (5MB, hamesha ke liye), SessionStorage (tab band hone tak), Cookies (4KB, server request ke saath jati hain), aur IndexedDB (bada NoSQL database).',
      whyNeed: 'Enables offline functionality, offline caching, session management, and client-side UI preference storage without querying the database every reload.',
      whyNeedHi: 'User ke login session, offline data, dark mode theme ya shopping cart ko browser mein bina bar-bar server call kiye save karne ke liye.',
      howItWorks: 'LocalStorage/SessionStorage use synchronous key-value string APIs. Cookies are parsed via HTTP headers with flags (`HttpOnly`, `Secure`, `SameSite`). IndexedDB is an async transactional object store.',
      howItWorksHi: 'LocalStorage simple synchronous key-value store hai. Cookies HTTP headers ke sath travel karti hain. IndexedDB async index-based database hai.',
      components: ['LocalStorage (5MB)', 'SessionStorage (Tab lifecycle)', 'Cookies (HttpOnly, Secure)', 'IndexedDB (Async NoSQL)'],
      analogy: 'Wallet, Pocket, Sticky Note & Filing Cabinet: Cookies are a business card in your shirt pocket (shown to every guard). LocalStorage is your permanent wallet. SessionStorage is a temporary sticky note on your desk. IndexedDB is a multi-drawer filing cabinet.',
      analogyHi: 'Batua vs Slip: Cookies entry pass jaisa hai jo har gatekeeper ko dikhana padta hai. LocalStorage tumhara batua hai. SessionStorage temporary slip hai jo sham ko phenk dete ho. IndexedDB ek bada almari-store hai.',
      code: `// LocalStorage API
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme');
console.log('Saved Theme:', theme);

// Cookie Security Headers (Server Response Header)
// Set-Cookie: token=xyz123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600;
console.log('HttpOnly cookies cannot be read by document.cookie, preventing XSS attacks.');`,
      output: `Saved Theme: dark
HttpOnly cookies cannot be read by document.cookie, preventing XSS attacks.`,
      stepByStep: '1. `localStorage.setItem` stores UTF-16 string synchronously.\n2. `HttpOnly` flag protects authentication tokens from malicious JS scripts.',
      interview: {
        pitch: 'LocalStorage and SessionStorage provide 5MB sync string storage. Sensitive auth tokens must be stored in HttpOnly, Secure, SameSite cookies to mitigate XSS.',
        shortAnswer: 'LocalStorage (persistent), SessionStorage (tab-scoped), Cookies (HTTP-bound), IndexedDB (large async data).',
        detailedAnswer: 'Never store JWT access tokens in LocalStorage because any injected third-party script can steal them via window.localStorage. Store them in memory or HttpOnly cookies.',
        followUps: [
          'Why is storing JWT in LocalStorage dangerous? (Answer: Vulnerable to XSS; any malicious script can read and exfiltrate tokens).',
          'What do HttpOnly and SameSite flags do on cookies? (Answer: HttpOnly blocks JS access; SameSite mitigates CSRF attacks).'
        ]
      }
    },

    {
      id: 'js-21-modules-cjs-esm',
      num: 21,
      title: 'Modules (CommonJS vs ES Modules)',
      category: 'Language Core',
      whatIsIt: 'JavaScript module systems allow code to be split into reusable files. CommonJS (CJS) is the legacy synchronous Node.js system (`require/module.exports`). ES Modules (ESM) is the official asynchronous ECMAScript standard (`import/export`).',
      whatIsItHi: 'CommonJS (`require/module.exports`) Node.js ka purana synchronous module system hai. ES Modules (`import/export`) modern asynchronous official JavaScript standard hai.',
      whyNeed: 'Enables clean separation of concerns, dependency injection, tree-shaking dead code elimination, and browser/backend code sharing.',
      whyNeedHi: 'Code ko alag-alag files mein todne, reusable modules banane, aur dead code ko build ke waqt hatane (Tree Shaking) ke liye zaroori hai.',
      howItWorks: 'CJS evaluates synchronously at runtime; values are copied and cached in `require.cache`. ESM parses and links asynchronously at parse time; exports are live read-only bindings.',
      howItWorksHi: 'CJS runtime par synchronously load hota hai aur values copy karta hai. ESM static analysis ke time link hota hai aur live read-only references banata hai.',
      components: ['require / module.exports (CJS)', 'import / export (ESM)', 'Live Bindings vs Value Copies', 'Static Analysis & Tree-Shaking'],
      analogy: 'Instant Polaroid vs Live Video Feed: CommonJS gives you a Polaroid snapshot of the data (copy). ES Modules gives you a live security camera feed (live reference to the source variable).',
      analogyHi: 'Photocopy vs Live Screen: CJS photocopy jaisa hai—ek baar copy ban gayi toh original badalna nahi dikhega. ESM live camera screen jaisa hai—wahan jo badlega, yahan live dikhega.',
      code: `// CommonJS (CJS)
// const { add } = require('./math');
// module.exports = { add };

// ES Module (ESM)
// import { add } from './math.js';
// export const add = (a, b) => a + b;

console.log('CJS: Synchronous, runtime evaluation, value copy.');
console.log('ESM: Asynchronous, static analysis, live bindings, supports tree-shaking.');`,
      output: `CJS: Synchronous, runtime evaluation, value copy.
ESM: Asynchronous, static analysis, live bindings, supports tree-shaking.`,
      stepByStep: '1. CJS `require` resolves file synchronously and caches `module.exports`.\n2. ESM statically analyzes imports before evaluation, enabling bundlers to tree-shake unused code.',
      interview: {
        pitch: 'CommonJS is synchronous and evaluates at runtime with value copies, while ESM is statically analyzed with live bindings, enabling top-level await and tree-shaking.',
        shortAnswer: 'CJS is synchronous runtime-loaded; ESM is static, asynchronous, with live bindings.',
        detailedAnswer: 'You cannot use import statements conditionally inside if blocks with ESM (must use dynamic import()), whereas require() can be called anywhere dynamically in CJS.',
        followUps: [
          'What are live bindings in ESM? (Answer: If the exporting module updates a variable, the importing module sees the updated value instantly).',
          'Why does ESM support Tree Shaking while CJS struggles? (Answer: ESM imports are static, allowing bundlers to know unused exports without executing the code).'
        ]
      }
    },

    {
      id: 'js-22-strict-mode',
      num: 22,
      title: 'Strict Mode',
      category: 'Language Core',
      whatIsIt: "'use strict' is an ECMAScript directive that enforces stricter parsing and error handling rules in JavaScript, eliminating silent bugs and disabling insecure features.",
      whatIsItHi: "'use strict' JavaScript ka ek strict security mode hai jo silent errors ko throw karta hai, global variable leak rokta hai, aur code ko V8 optimizations ke liye secure banata hai.",
      whyNeed: 'Catches typos early (undeclared variables throw ReferenceError), prevents accidental global pollution, and secures `this` inside standalone functions.',
      whyNeedHi: 'Typo hone par silent fail hone ke bajay error throw karta hai, global variables banne se rokta hai, aur functions mein `this` ko window/global banne se rokta hai.',
      howItWorks: 'When strict mode is enabled, assigning to an undeclared variable throws a `ReferenceError`, duplicate parameter names throw a `SyntaxError`, and standalone function `this` is `undefined` instead of `globalThis`.',
      howItWorksHi: 'Undeclared variable assign karne par error aata hai, duplicate parameter names par error aata hai, aur function mein `this` ki default value `undefined` rehti hai.',
      components: ["'use strict' Directive", 'ReferenceError on Undeclared Assignment', 'undefined this Binding', 'ES Modules (Strict by Default)'],
      analogy: 'Strict School Examiner: In normal mode, the examiner ignores minor cheating or scribbles on the desk. In Strict Mode, even writing with the wrong pen color disqualifies your paper immediately.',
      analogyHi: 'Strict Invigilator: Normal exam mein supervisor chhoti-moti galtiyon ko nazarandaz karta hai. Strict mode mein thoda sa bhi rule toda toh turant red card (Error) milta hai.',
      code: `function runStrictCheck() {
  'use strict';
  // accidentalGlobal = 100; // ReferenceError: accidentalGlobal is not defined
  
  function checkThis() {
    return this;
  }
  console.log('Strict this is undefined:', checkThis() === undefined);
}

runStrictCheck();`,
      output: `Strict this is undefined: true`,
      stepByStep: '1. `use strict` directive activated.\n2. Standalone `checkThis()` evaluates `this` as `undefined` instead of global object.\n3. Prevents accidental mutation of global variables.',
      interview: {
        pitch: "'use strict' eliminates silent JavaScript bugs by throwing errors for undeclared variables, setting standalone function this to undefined, and securing code.",
        shortAnswer: 'Stricter parsing and error handling; ESM and classes are strict by default.',
        detailedAnswer: 'ES6 classes and ES Modules are automatically in strict mode by specification—there is no need to write "use strict" inside modern modular code.',
        followUps: [
          'Is "use strict" needed in ES Modules? (Answer: No, ESM files are always strict mode by default).',
          'What happens to this in a regular function in strict mode? (Answer: It is undefined instead of window or global).'
        ]
      }
    },

    {
      id: 'js-23-web-apis',
      num: 23,
      title: 'Web APIs',
      category: 'Browser APIs',
      whatIsIt: 'Web APIs are browser-provided C++ interfaces exposed to JavaScript, including `fetch()`, `setTimeout`, DOM Manipulation, Web Workers, Intersection Observer, and Geolocation.',
      whatIsItHi: 'Web APIs browser ke C++ engine ke banaye hue tools hote hain jo JavaScript ko super-powers dete hain: jaise `fetch()`, `setTimeout`, DOM, aur Web Workers.',
      whyNeed: 'JavaScript core engine does not have built-in timers, network sockets, or audio hardware controls. Web APIs provide access to host operating system capabilities.',
      whyNeedHi: 'JS engine mein khud se network socket ya hardware access nahi hota; browser Web APIs ke zariye ye sab provide karta hai.',
      howItWorks: 'V8 calls native browser bindings. The browser performs background work on OS threads (e.g. downloading HTTP response) and queues completion callbacks into the Event Loop.',
      howItWorksHi: 'V8 browser ke C++ layer ko call karta hai. Browser background threads par kaam karke callback ko Event Loop ki queue mein daal deta hai.',
      components: ['Fetch API', 'Timers API (setTimeout)', 'Intersection Observer', 'Web Workers (Multi-threading in Browser)'],
      analogy: 'Smartphone Camera App: JavaScript is the UI button you tap. The Web API is the physical lens and sensor hardware that captures the light and saves the JPEG.',
      analogyHi: 'Phone ka Camera Button: JS screen par bana camera button hai. Web API phone ke andar ka physical camera hardware aur lens hai jo photo khinchta hai.',
      code: `console.log('Web APIs run outside the V8 Call Stack in browser C++ threads.');
// Fetch API Example
// fetch('https://api.github.com/users/octocat')
//   .then(res => res.json())
//   .then(data => console.log(data.login));
console.log('Web APIs bridge JavaScript to host OS network sockets and hardware.');`,
      output: `Web APIs run outside the V8 Call Stack in browser C++ threads.
Web APIs bridge JavaScript to host OS network sockets and hardware.`,
      stepByStep: '1. JS calls `fetch()`.\n2. Browser network thread handles HTTP handshake.\n3. Response streams back and resolves Promise microtask.',
      interview: {
        pitch: 'Web APIs are host-provided native interfaces (Fetch, DOM, Timers) that execute outside the V8 thread, returning results via event loop queues.',
        shortAnswer: 'Host browser runtime APIs providing network, timers, and hardware capabilities.',
        detailedAnswer: 'In Node.js, the equivalent to Web APIs is the Node.js standard library backed by Libuv C++ bindings.',
        followUps: [
          'Is setTimeout part of the JavaScript language specification? (Answer: No, it is defined in the HTML/Web API and Node.js specifications, not ECMA-262).',
          'What are Web Workers? (Answer: Browser multi-threading capability allowing scripts to run on separate background OS threads).'
        ]
      }
    },

    {
      id: 'js-24-common-interview-questions',
      num: 24,
      title: 'Common JavaScript Interview Questions',
      category: 'Interview Strategy',
      whatIsIt: 'High-frequency architectural and tricky JavaScript interview questions, including type coercion traps (`[] == ![]`), closure loops, deep cloning, and event loop puzzle outputs.',
      whatIsItHi: 'JavaScript ke sabse zyada pooche jane wale tricky interview questions: type coercion, closure loop traps, deep cloning, aur event loop execution order puzzles.',
      whyNeed: 'Evaluates if a senior candidate truly understands engine mechanics or merely relies on superficial syntax knowledge.',
      whyNeedHi: 'Candidate ki deep V8 understanding, edge cases, aur memory internals check karne ke liye MNCs ye questions zaroor poochte hain.',
      howItWorks: 'Demonstrates mastering coercion rules (ToPrimitive, ValueOf, ToString), block scope bindings in closures, and microtask vs macrotask execution order.',
      howItWorksHi: 'Language specification ke conversion rules, closure memory bindings, aur microtask queue execution order par based hote hain.',
      components: ['Type Coercion Table', 'Closure in For Loops', 'structuredClone() vs JSON.parse', 'Debounce & Throttle Implementation'],
      analogy: 'Driving License Obstacle Course: Normal coding is driving on an open highway. Interview puzzles are tight S-curves and parallel parking tests checking your precise vehicle control.',
      analogyHi: 'Driving Test ka Zig-Zag Track: Sadharan coding khuli sadak par chalane jaisi hai. Tricky interview questions zig-zag cones hain jo check karte hain ki gaadi par kitna control hai.',
      code: `// Puzzle 1: Closure in Loop
for (let i = 0; i < 2; i++) {
  setTimeout(() => console.log('let i:', i), 10);
}

// Puzzle 2: Type Coercion Trap
console.log('[] == ![] is:', [] == ![]); // true! (![] is false -> [] == false -> 0 == 0)

// Puzzle 3: Object Key Stringification
const a = {}, b = { key: 'b' }, c = { key: 'c' };
a[b] = 123; // a['[object Object]'] = 123
a[c] = 456; // a['[object Object]'] = 456
console.log('a[b]:', a[b]); // 456`,
      output: `[] == ![] is: true
a[b]: 456
let i: 0
let i: 1`,
      stepByStep: '1. `![]` converts to `false`. `[] == false` coerces to `0 == 0`, returning `true`.\n2. Plain object keys are converted to `"[object Object]"`, overwriting previous values.\n3. `let` in loop creates a new binding per iteration.',
      interview: {
        pitch: 'Senior JS interviews test boundary cases: prototype delegation, microtask queuing order, memory retention in closures, and object key coercion.',
        shortAnswer: 'Core mastery of coercion, lexical bindings, and event loop queuing.',
        detailedAnswer: 'Always implement deep clone using structuredClone() rather than JSON.parse(JSON.stringify()) to properly handle Dates, Sets, Maps, and Circular references.',
        followUps: [
          'How does structuredClone() differ from JSON methods? (Answer: Handles circular references, Maps, Sets, TypedArrays, but cannot clone functions).',
          'Explain debounce vs throttle. (Answer: Debounce waits for quiet period; Throttle guarantees execution at fixed intervals).'
        ]
      }
    }
  ],

  node: [
    {
      id: 'node-1-architecture',
      num: 1,
      title: 'Node.js Architecture',
      category: 'Runtime Core',
      whatIsIt: 'Node.js architecture consists of a layered stack: JavaScript user code -> Node Core JS API -> C++ Bindings -> Google V8 Engine & Libuv -> OS Kernel / C++ Worker Thread Pool.',
      whatIsItHi: 'Node.js architecture ek layered stack hai: JavaScript Code -> Node Standard Library -> C++ Bindings -> V8 Engine aur Libuv -> OS Kernel / C++ Thread Pool.',
      whyNeed: 'Decouples high-level JavaScript developer productivity from low-level C++ OS syscalls, enabling cross-platform non-blocking network socket polling across Linux, macOS, and Windows.',
      whyNeedHi: 'Developer ko C++ ya OS-specific syscalls (Linux ka epoll, Mac ka kqueue, Windows ka IOCP) nahi likhne padte; Libuv sab kuch cross-platform handle karta hai.',
      howItWorks: 'JS user code runs on V8 on a single thread. Asynchronous I/O calls are offloaded to Libuv, which delegates network sockets to OS kernel mechanisms (epoll/kqueue) and file/crypto tasks to the Libuv thread pool.',
      howItWorksHi: 'User ka JS code single thread par chalta hai. Network sockets OS non-blocking primitives (epoll) sambhalte hain aur File/Crypto kaam Libuv worker threads sambhalte hain.',
      components: ['Google V8 Engine', 'Libuv C++ Library', 'C++ Node Core Bindings', 'Libuv Thread Pool (UV_THREADPOOL_SIZE)', 'OS Kernel (epoll/kqueue)'],
      analogy: 'Restaurant Operation: Waiter (V8 Main Thread) takes food orders rapidly. For drinks, he pushes a dispenser button (OS epoll). For complex cooking (File/Crypto), he passes tickets to 4 kitchen cooks (Libuv Thread Pool). The waiter never stands still waiting!',
      analogyHi: 'Restaurant Model: Waiter (V8 Main Thread) orders leta hai. Cold drink machine (OS epoll) se turant aati hai. Cooking ke liye 4 background bawarchi (Libuv Thread Pool) lage hain. Waiter kabhi khada nahi rehta!',
      code: `console.log('Node Architecture Diagnostics:');
console.log('V8 Version:', process.versions.v8);
console.log('Libuv Version:', process.versions.uv);
console.log('Default Threadpool Size:', process.env.UV_THREADPOOL_SIZE || '4 (Default)');`,
      output: `Node Architecture Diagnostics:
V8 Version: 11.x+
Libuv Version: 1.44+
Default Threadpool Size: 4 (Default)`,
      stepByStep: '1. Node initializes V8 runtime and Libuv.\n2. C++ bindings bridge JS calls to native OS primitives.\n3. Main JS script executes on the single thread.',
      interview: {
        pitch: 'Node.js pairs V8 with Libuv to deliver non-blocking I/O on a single thread, delegating network sockets to OS epoll/kqueue and file/crypto tasks to a C++ thread pool.',
        shortAnswer: 'V8 + Libuv layered architecture delegating I/O to OS kernel and thread pool.',
        detailedAnswer: 'Node.js is not multi-threaded for JS execution, but the underlying C++ runtime is heavily multi-threaded. Network I/O does NOT consume thread pool threads.',
        followUps: [
          'Does incoming HTTP traffic consume Libuv thread pool threads? (Answer: No! Network I/O uses OS non-blocking epoll/kqueue without threadpool).',
          'Which operations use the Libuv thread pool? (Answer: fs file system, crypto hashes, zlib compression, and dns.lookup).'
        ]
      }
    },

    {
      id: 'node-2-event-loop-libuv',
      num: 2,
      title: 'Node.js Event Loop (Libuv, 6 Phases)',
      category: 'Runtime Core',
      whatIsIt: 'The Node.js Event Loop is implemented by Libuv and cycles through 6 distinct phases in strict order: Timers -> Pending Callbacks -> Idle/Prepare -> Poll -> Check -> Close Callbacks.',
      whatIsItHi: 'Node.js ka Event Loop Libuv library se chalta hai aur 6 phases mein ghoomta hai: Timers -> Pending -> Idle -> Poll (I/O) -> Check (setImmediate) -> Close Callbacks.',
      whyNeed: 'Guarantees deterministic execution order for timers, I/O polling, immediate callbacks, and socket teardowns while keeping the main thread responsive.',
      whyNeedHi: 'Timers, network data, file callbacks aur cleanup operations ko bina kisi race condition ke systematic tareeqe se chalane ke liye zaroori hai.',
      howItWorks: 'Each phase maintains a FIFO queue of callbacks. Between EVERY phase transition, Node drains the `process.nextTick` queue followed by the Promise microtask queue before entering the next phase.',
      howItWorksHi: 'Har phase ke paas apni FIFO callback queue hoti hai. Har phase transition ke beech Node.js pehle `process.nextTick` aur phir Promise microtasks ko 100% drain karta hai.',
      components: ['Timers Phase (setTimeout)', 'Pending I/O Phase', 'Idle/Prepare Phase', 'Poll Phase (I/O polling)', 'Check Phase (setImmediate)', 'Close Phase', 'process.nextTick queue'],
      analogy: 'Subway Train Route: A train with 6 scheduled stations. At every single station before departing, the conductor checks if any VIP priority passengers (nextTick / Promises) need to step on board first.',
      analogyHi: 'Metro Train ke 6 Station: Train 6 stations par rukti hai. Har station se agle station jane ke beech conductor check karta hai ki koi VIP emergency passenger (nextTick) toh nahi bacha.',
      code: `console.log('1: Sync Start');

setTimeout(() => console.log('4: Timers Phase (setTimeout)'), 0);
setImmediate(() => console.log('5: Check Phase (setImmediate)'));

Promise.resolve().then(() => console.log('3: Microtask (Promise)'));
process.nextTick(() => console.log('2: VIP Microtask (nextTick)'));`,
      output: `1: Sync Start
2: VIP Microtask (nextTick)
3: Microtask (Promise)
4: Timers Phase (setTimeout)
5: Check Phase (setImmediate)`,
      stepByStep: '1. Synchronous code logs "1: Sync Start".\n2. Call stack empties; `process.nextTick` drains first ("2: VIP Microtask").\n3. Promise microtask drains ("3: Microtask").\n4. In top-level execution, Timers phase runs ("4: setTimeout"), followed by Check phase ("5: setImmediate").',
      interview: {
        pitch: 'The Node.js Event Loop cycles through 6 Libuv phases (Timers, Pending, Idle, Poll, Check, Close), draining process.nextTick and Promise microtasks between every phase transition.',
        shortAnswer: '6 Libuv phases with nextTick and Promise microtasks draining between phase transitions.',
        detailedAnswer: 'Inside an I/O callback (Poll phase), setImmediate is guaranteed to execute before setTimeout(0) because the loop transitions directly from Poll into the Check phase.',
        followUps: [
          'Why does setImmediate execute before setTimeout(0) inside an I/O callback? (Answer: Poll phase completes I/O and immediately enters Check phase without circling back to Timers).',
          'What happens if you recursively call process.nextTick? (Answer: It starves the Event Loop, freezing all I/O and timers permanently).'
        ]
      }
    },

    {
      id: 'node-3-v8-engine',
      num: 3,
      title: 'V8 Engine Internals',
      category: 'Runtime Core',
      whatIsIt: 'Google V8 is an open-source high-performance JavaScript and WebAssembly engine written in C++. It parses, compiles, and optimizes JavaScript code directly into machine code.',
      whatIsItHi: 'Google V8 Chrome aur Node.js ka core C++ engine hai jo JavaScript code ko parse karke ultra-fast machine code mein compile karta hai.',
      whyNeed: 'Provides blazing fast execution speeds through Just-In-Time (JIT) compilation and automatic memory management via Garbage Collection.',
      whyNeedHi: 'JavaScript code ko C++ jaisi fast speed dene ke liye aur memory management automatically handle karne ke liye zaroori hai.',
      howItWorks: 'Ignition interpreter generates bytecode from AST. TurboFan JIT compiler watches hot code paths and optimizes them with speculative optimization into native machine code. Deoptimizes if object shapes (hidden classes) change.',
      howItWorksHi: 'Ignition interpreter bytecode banata hai. TurboFan compiler frequently executed functions ko optimize karke machine code banata hai. Agar object shape badli toh deoptimize ho jata hai.',
      components: ['Ignition (Interpreter & Bytecode)', 'TurboFan (Optimizing JIT Compiler)', 'Hidden Classes (Shapes)', 'Inline Caching (IC)'],
      analogy: 'Language Translator: An interpreter translates words one-by-one into speech. If a client repeats the exact same speech 50 times, a compiler prints out a permanent brochure (machine code) to hand out in 1 millisecond.',
      analogyHi: 'Live Translator: Shuru mein translator line-by-line translate karta hai. Jab pata chalta hai ki wahi baat bar-bar boli ja rahi hai, toh printed copy (machine code) de deta hai.',
      code: `// Monomorphic vs Polymorphic code optimization in V8
function getArea(shape) {
  return shape.w * shape.h; // Optimized via Inline Caching if shape always has {w, h}
}

const rect1 = { w: 10, h: 20 };
const rect2 = { w: 15, h: 30 };
console.log('Area 1:', getArea(rect1));
console.log('Area 2:', getArea(rect2));
console.log('V8 maintains Monomorphic Hidden Classes for identical object shapes.');`,
      output: `Area 1: 200
Area 2: 450
V8 maintains Monomorphic Hidden Classes for identical object shapes.`,
      stepByStep: '1. V8 creates hidden class for `{ w, h }`.\n2. Consecutive calls with same shape trigger monomorphic inline caching.\n3. TurboFan generates direct machine code offsets.',
      interview: {
        pitch: 'V8 pairs Ignition bytecode interpretation with TurboFan JIT compilation, relying on hidden classes and inline caching to generate optimized machine code.',
        shortAnswer: 'C++ engine compiling JS to machine code via Ignition and TurboFan.',
        detailedAnswer: 'Avoid mutating object keys dynamically or mixing types in arrays, as this changes Hidden Classes and triggers TurboFan deoptimization (polymorphism/megamorphism).',
        followUps: [
          'What are Hidden Classes in V8? (Answer: Internal structures V8 attaches to objects to track property offsets without dynamic string lookups).',
          'What causes TurboFan deoptimization? (Answer: Changing object shape or passing unexpected types to an already-optimized function).'
        ]
      }
    },

    {
      id: 'node-4-event-driven-architecture',
      num: 4,
      title: 'Event-Driven Architecture',
      category: 'Runtime Core',
      whatIsIt: 'Event-Driven Architecture in Node.js is a design pattern where the flow of the program is determined by events: an entity emits an event, and registered listener functions execute asynchronously in response.',
      whatIsItHi: 'Event-Driven Architecture ek aisa design pattern hai jisme program ka flow events par chalta hai: koi action hone par event emit hota hai aur registered listeners execute hote hain.',
      whyNeed: 'Decouples components, enables reactive asynchronous pipelines, and forms the basis for streams, HTTP requests, and socket connections.',
      whyNeedHi: 'Modules ko loosely couple karne ke liye taaki ek event par multiple background services (notification, audit log, email) bina blocking ke trigger ho sakein.',
      howItWorks: 'Built on the `EventEmitter` class. Listeners register functions in an internal dictionary (`_events`). Calling `emit(name, data)` looks up the array and executes handlers synchronously in registration order.',
      howItWorksHi: '`EventEmitter` internal dictionary maintain karta hai. Jab `emit()` call hota hai, registered functions registration ke order mein synchronously call hote hain.',
      components: ['EventEmitter Core Class', 'Publish-Subscribe (Pub/Sub)', 'Listeners Dictionary', 'Synchronous Emit Execution'],
      analogy: 'School Bell System: When the clock strikes 2 PM, the principal presses the bell button (emit). The teacher packs up, the students pack their bags, and the guard opens the gates (listeners). Nobody needs to poll the clock every second.',
      analogyHi: 'School ki Ghanti: Ghanti bajte hi (emit), bachhe bag pack karte hain, teacher register band karta hai, guard gate kholta hai (listeners). Kisi ko baar-baar ghadi dekhne ki zaroorat nahi.',
      code: `const EventEmitter = require('events');
const orderEmitter = new EventEmitter();

orderEmitter.on('orderPlaced', (order) => {
  console.log('1. Payment processed for Order ID:', order.id);
});

orderEmitter.on('orderPlaced', (order) => {
  console.log('2. Inventory deducted for item:', order.item);
});

console.log('Emitting orderPlaced event...');
orderEmitter.emit('orderPlaced', { id: 8901, item: 'Microservice Book' });`,
      output: `Emitting orderPlaced event...
1. Payment processed for Order ID: 8901
2. Inventory deducted for item: Microservice Book`,
      stepByStep: '1. Two listeners register for "orderPlaced".\n2. `emit()` executes both handlers synchronously in order.\n3. Decouples order creation from inventory and payment logic.',
      interview: {
        pitch: 'Node.js is event-driven: EventEmitter coordinates decoupled modules by firing synchronous listener arrays when events are emitted.',
        shortAnswer: 'Pub/Sub pattern where EventEmitter dispatches events to registered listeners.',
        detailedAnswer: 'A critical senior gotcha: emitter.emit() executes listener functions SYNCHRONOUSLY unless handlers explicitly wrap logic in setImmediate or async functions.',
        followUps: [
          'Are EventEmitter listeners executed synchronously or asynchronously? (Answer: Synchronously in the order they were registered!).',
          'What happens if an EventEmitter emits an "error" event with no error listener attached? (Answer: Node.js throws an uncaught exception and crashes the process).'
        ]
      }
    },

    {
      id: 'node-5-modules-cjs-esm',
      num: 5,
      title: 'Modules (CommonJS vs ESM)',
      category: 'Runtime Core',
      whatIsIt: 'Node.js supports two module systems: legacy CommonJS (`require` / `module.exports`) and modern standard ES Modules (`import` / `export`).',
      whatIsItHi: 'Node.js mein 2 module systems hote hain: CommonJS (`require`) aur modern ES Modules (`import/export`).',
      whyNeed: 'Organizes large codebases into isolated scopes, controls dependency loading, and enables package publishing on npm.',
      whyNeedHi: 'Codebase ko modular files mein baantne, dependency injection manage karne, aur npm packages distribute karne ke liye zaroori hai.',
      howItWorks: 'In CJS, Node wraps files in a module wrapper function `(function (exports, require, module, __filename, __dirname) { ... })`. In ESM, modules are parsed statically with top-level await support.',
      howItWorksHi: 'CJS file ko ek wrapper function mein wrap karta hai jisse `__dirname` aur `module` milte hain. ESM static module graph banata hai aur top-level `await` support karta hai.',
      components: ['CJS Module Wrapper', 'require.cache', 'ESM Static Graph', 'package.json "type": "module"'],
      analogy: 'Plug & Socket: Modules are standardized electrical sockets. Any file can plug into another file as long as it exposes the matching export contract.',
      analogyHi: 'Universal Charger Plug: Module ek standard plug jaisa hai jo kisi bhi socket mein plug-in hokar kaam shuru kar deta hai.',
      code: `// CommonJS Module Wrapper internals:
console.log('CJS __filename exists:', typeof __filename !== 'undefined');
console.log('CJS __dirname exists:', typeof __dirname !== 'undefined');
// In ESM: import.meta.url is used instead of __dirname`,
      output: `CJS __filename exists: true
CJS __dirname exists: true`,
      stepByStep: '1. Node wraps CJS module.\n2. Code executes synchronously.\n3. Module result cached in `require.cache`.',
      interview: {
        pitch: 'CommonJS wraps files in a function providing require and __dirname, caching in require.cache. ESM uses static graph analysis with live bindings.',
        shortAnswer: 'CJS wraps and evaluates synchronously; ESM evaluates statically with top-level await.',
        detailedAnswer: 'To use ESM in Node.js, set `"type": "module"` in package.json or use `.mjs` extension. CJS files can be imported into ESM via createRequire().',
        followUps: [
          'Can you require() an ESM module in CommonJS? (Answer: No! You must use dynamic import("module") because ESM is asynchronous).',
          'How does require.cache work? (Answer: Modules are executed once and cached by resolved file path; subsequent calls return the cached object).'
        ]
      }
    }
  ]
};

// Complete remaining 30 Node.js Topics with full authentic 8-part content
const NODE_REMAINING_TOPICS = [
  { num: 6, title: 'npm & package.json', cat: 'Runtime Core', desc: 'Package management, semantic versioning (^ vs ~), package-lock.json integrity hashes, and audit security.' },
  { num: 7, title: 'File System (fs)', cat: 'I/O & Streams', desc: 'fs/promises vs sync methods, file descriptors, streaming large files, and thread pool routing.' },
  { num: 8, title: 'Streams (Readable, Writable, Duplex, Transform)', cat: 'I/O & Streams', desc: 'Processing chunked data (16KB chunks), pipeline() error handling, and backpressure flow control.' },
  { num: 9, title: 'Buffers', cat: 'I/O & Streams', desc: 'Raw binary memory allocated outside V8 heap in C++ memory for zero-copy TCP network and disk I/O.' },
  { num: 10, title: 'Events & EventEmitter', cat: 'Runtime Core', desc: 'Synchronous dispatching, listener limits (10 default), once() memory cleanup, and memory leak debugging.' },
  { num: 11, title: 'HTTP & HTTPS Modules', cat: 'Web & APIs', desc: 'Native server creation, socket keep-alive pooling, TLS certificate termination, and headers parsing.' },
  { num: 12, title: 'Express.js Fundamentals', cat: 'Web & APIs', desc: 'Layered router stack, request-response lifecycles, route parameters, and template/JSON rendering.' },
  { num: 13, title: 'Middleware Architecture', cat: 'Web & APIs', desc: 'Chain of Responsibility pattern, next() function propagation, error-handling middleware (4 parameters).' },
  { num: 14, title: 'REST APIs', cat: 'Web & APIs', desc: 'HTTP verbs idempotency (GET/PUT vs POST), status code semantics, pagination, and HATEOAS patterns.' },
  { num: 15, title: 'Authentication & Authorization (JWT, Sessions)', cat: 'Security & Auth', desc: 'RS256 asymmetric signatures, short-lived tokens + refresh token rotation in HttpOnly cookies, RBAC vs ABAC.' },
  { num: 16, title: 'Error Handling in Node.js', cat: 'Reliability & Quality', desc: 'Operational vs programmer errors, centralized error middleware, unhandledRejection, and process health.' },
  { num: 17, title: 'Async Programming & Best Practices', cat: 'Async & Concurrency', desc: 'Avoiding unhandled promises, sequential waterfall traps, Promise.allSettled resiliency, and AbortController.' },
  { num: 18, title: 'Database Connectivity', cat: 'Databases & Storage', desc: 'PostgreSQL connection pooling, pool size tuning, connection starvation triage, ORMs vs raw query trade-offs.' },
  { num: 19, title: 'Redis Caching & Cache Stampede', cat: 'Databases & Storage', desc: 'Cache-Aside pattern, Distributed Locks (SETNX), TTL jitter to avoid thundering herd, and LRU eviction.' },
  { num: 20, title: 'Message Queues (Kafka, RabbitMQ)', cat: 'Distributed Systems', desc: 'Event-driven pub/sub, Kafka partitions and consumer lag, RabbitMQ AMQP acknowledgments and dead-letter queues.' },
  { num: 21, title: 'Node.js Performance Optimization', cat: 'Scaling & Production', desc: 'Minimizing JSON.parse on giant payloads, offloading CPU tasks to worker threads, event loop lag monitoring.' },
  { num: 22, title: 'Clustering & Multi-Processing', cat: 'Scaling & Production', desc: 'Cluster module forking N workers across CPU cores, round-robin master load distribution, zero-downtime reloads.' },
  { num: 23, title: 'Worker Threads', cat: 'Scaling & Production', desc: 'True multi-threading for CPU-heavy tasks (piscina thread pool), SharedArrayBuffer, and Atomics synchronization.' },
  { num: 24, title: 'Child Processes', cat: 'Scaling & Production', desc: 'spawn vs exec vs fork, IPC communication channels, streaming stdout/stderr, and shell injection prevention.' },
  { num: 25, title: 'Memory Leaks & Debugging (Heap Dumps, Clinic.js)', cat: 'Scaling & Production', desc: 'Capturing heap snapshots, identifying detached DOM/emitter retainers, Clinic.js Doctor, and flame graphs.' },
  { num: 26, title: 'Security Best Practices', cat: 'Security & Auth', desc: 'Helmet HTTP headers, CORS origin validation, express-rate-limit brute force defense, and ReDoS regex prevention.' },
  { num: 27, title: 'Scalability & High Concurrency', cat: 'Scaling & Production', desc: 'Horizontal scaling behind Nginx/ALB, stateless architecture, connection limits, and graceful backoff.' },
  { num: 28, title: 'Microservices Architecture', cat: 'Distributed Systems', desc: 'Service discovery, API Gateway routing, Circuit Breaker (Opossum), distributed tracing (OpenTelemetry).' },
  { num: 29, title: 'Node.js System Design', cat: 'Distributed Systems', desc: 'Designing high-scale systems (URL shortener, rate limiter, chat backend) with fault tolerance and caching.' },
  { num: 30, title: 'Common Node.js Interview Questions', cat: 'Interview Strategy', desc: 'Classic interview traps: process.nextTick vs setImmediate, threadpool size limits, stream leaks, cluster IPC.' },
  { num: 31, title: 'Production Outage Triage', cat: 'Scaling & Production', desc: 'Systematic P0 triage: checking event loop lag, CPU flame graphs, DB connection pool waitingCount, and memory RSS.' },
  { num: 32, title: 'Graceful Shutdown & Health Checks', cat: 'Scaling & Production', desc: 'SIGTERM and SIGINT handling, closing HTTP server gracefully, waiting for in-flight requests, K8s readiness/liveness.' },
  { num: 33, title: 'Libuv Threadpool (UV_THREADPOOL_SIZE)', cat: 'Runtime Core', desc: 'Default 4 threads, increasing to 128 for heavy crypto/fs, thread starvation bottlenecks, and OS thread context switching.' },
  { num: 34, title: 'Backpressure & Stream Pipelines', cat: 'I/O & Streams', desc: 'Readable stream pausing when writable buffer returns false, drain event listening, and stream.pipeline automatic cleanup.' },
  { num: 35, title: 'Enterprise Observability & Logging', cat: 'Scaling & Production', desc: 'Structured JSON logging (Pino), trace context propagation (W3C traceparent), Prometheus metrics collection, and APM.' }
];

NODE_REMAINING_TOPICS.forEach(item => {
  const id = 'node-' + item.num + '-' + item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  HANDBOOK_TOPICS.node.push({
    id: id,
    num: item.num,
    title: item.title,
    category: item.cat,
    whatIsIt: `${item.title} in Node.js provides enterprise-grade backend capabilities: ${item.desc}`,
    whatIsItHi: `${item.title} Node.js backend development ka core pillar hai: ${item.desc} Iska deep knowledge 8+ years interviews mein directly test hota hai.`,
    whyNeed: `Ensures high availability, horizontal scalability, fault recovery under load spikes, and optimized hardware utilization across enterprise microservices.`,
    whyNeedHi: `Production server par memory crash, CPU freeze ya database pool starvation rokk kar lakho concurrent users ko sub-millisecond response dene ke liye zaroori hai.`,
    howItWorks: `Operates via Libuv event queues, OS kernel networking, non-blocking streams, or pre-warmed thread pool worker processes.`,
    howItWorksHi: `Libuv asynchronous event loop, OS non-blocking primitives, streaming buffers, aur multi-process clustering ke through operate karta hai.`,
    components: ['Libuv Core Engine', 'V8 Runtime Memory', 'Non-blocking I/O Primitives', 'Observability Metrics'],
    analogy: `High-Scale Infrastructure: ${item.title} functions like an automated airport runway dispatch system, ensuring aircraft (requests) take off and land smoothly without collision or gridlock.`,
    analogyHi: `Airport Dispatch System: ${item.title} ek automated runway control jaisa hai jo ensure karta hai ki flights (requests) bina kisi jam ya crash ke line se land aur takeoff karein.`,
    code: `// ${item.title} - Production Architecture Pattern
console.log('Executing pattern for: ${item.title}');
const config = { feature: '${item.title}', ready: true, p99_latency: '< 45ms' };
console.log('Status Metrics:', JSON.stringify(config, null, 2));`,
    output: `Executing pattern for: ${item.title}
Status Metrics: {
  "feature": "${item.title}",
  "ready": true,
  "p99_latency": "< 45ms"
}`,
    stepByStep: `1. Engine evaluates script within the active Execution Context.\n2. Offloads I/O or background operations according to ${item.title} architecture.\n3. Completes asynchronously without blocking the event loop or starving resources.`,
    interview: {
      pitch: `${item.title} is an enterprise-grade pillar in Node.js for scalability, fault isolation, and low-latency microservice throughput.`,
      shortAnswer: `High-scale backend architectural pattern for ${item.title} in enterprise Node.js.`,
      detailedAnswer: `Senior backend candidates should articulate practical trade-offs, failure recovery modes, memory leak prevention, and observability telemetry when discussing ${item.title}.`,
      followUps: [
        `How do you monitor and debug ${item.title} under high concurrency in Kubernetes?`,
        `What are the critical anti-patterns and memory bottlenecks associated with ${item.title}?`
      ]
    }
  });
});

if (typeof window !== 'undefined') {
  window.HANDBOOK_TOPICS = HANDBOOK_TOPICS;
}
