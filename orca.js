// console.log("hello");

// 4 call structure
// 1) establish the timing strategy
// 2) wrap the function with the desired timing
// 3) provide the arguments to begin the timing
// 4) returns a closure to cancel the call, or replace the debounce FN and Argument
const extendFunction = (fn, obj) =>
  new Proxy(fn, {
    get: (target, prop) => obj[prop].bind(obj),
    apply: function (target, ctx, args) {
      return fn(...args);
    }
  });

// Timing a bunch of jobs.
// the shape kinda looks like this
// {[root]: {[sequence]: {[timing]: {[fn]: [args]}}}}
function sequencer(sequence) {
  if (!this.rootMap) {
    this.rootMap = new Map();
  }
  const rootMap = this.rootMap;
  if (!rootMap.has(sequence)) rootMap.set(sequence, new Map());
  const seqMap = rootMap.get(sequence);
  const upsertTiming = (timing) => {
    if (!seqMap.has(timing)) seqMap.set(timing, new Map());
    const timingMap = seqMap.get(timing);
    const upsertFn = (fn, argsUpserter) => {
      const fnMap = rootMap.get(timing);
      const upsertArgs = (...args) => {
        const upsertedArgs = fnMap.has(fn)
          ? argsUpserter(fnMap.get(fn), args)
          : args;
        fnMap.set(fn, upsertedArgs);
      };
      sequence(timing, fnMap);
      return extendFunction(upsertArgs, fnMap);
    };
    return extendFunction(upsertFn, timingMap);
  };
  return extendFunction(upsertTiming, seqMap);
}

const batchMap = (timing, fnMap) =>
  timing(() => {
    const callFn = ([fn, args]) => fn(...args);
    fnMap.entries().forEach(callFn);
    fnMap.clear();
  });
const batch = sequencer(batchMap);

const recurMap = (timing, fnMap) => {
  timing(() => {
    const [fn, args] = fnMap.entries().next().value;
    fn(...args);
    fnMap.delete(fn);
    recurMap(timing, fnMap);
  });
};
const recur = sequencer(recurMap);

// Timing individual Jobs

const orca = (timing) => (fn) => {
  const me = { fn, canceled: false };
  me.cancel = () => (me.canceled = true);
  // API to set min time between consecutive fn calls
  me.throttler = (throttleTimer) => {
    me.throttle = () => {
      // don't reset the running throttle
      if (me.throttled) return;
      throttleTimer(() => (me.throttled = false))();
      me.throttled = true;
    };
  };

  return function (...args) {
    me.args = args;
    // this only puts a date if this has been previously declared as true.
    if (me.debounce) {
      me.debounce = Date.now();
    }
    me.callback = () => me.fn(...me.args);
    const filterCall = (_debounce, ok) =>
      [
        me.canceled,
        me.throttled,
        // only compare debounce times between init and call if debounce is true
        // if init and call aren't equal; that means there has been a call between init and call,
        // so we should early eject
        me.debounce && me.debounce !== _debounce,
        () => ok(me.callback())
      ].find((x) => x);
    const resolve = (_debounce) => (ok) => {
      // only pass timing the num of arguments it wants. (fn.length == argCount)
      const timingArgs = [filterCall(_debounce, ok), me]
      // console.log(timingArgs)
      timingArgs.length = timing.length;
      timing(...timingArgs);
    };
    // queues throttling for subsequent calls
    if (me.throttle) {
      me.throttle();
    }
    const resultPromise = new Promise(resolve(me.debounce));
    return extendFunction(this, Object.assign(resultPromise, me));
  };
};

const sync = orca((fn) => fn);
const then = orca(queueMicrotask);
const task = orca(setTimeout);
const tick = orca(requestAnimationFrame);
const next = orca((cb) =>
  requestAnimationFrame(() => requestAnimationFrame(cb))
);
const idle = orca(requestIdleCallback);

const wait = (ms = 0) =>
  orca((fn) => setTimeout(fn, ms));
const once = orca((cb, me) => {
  cb();
  me.cancel();
});

// orca is a way to easily tap into the event loop!
// wrap functions with
// Object.entries({
//   wait100: wait(100),
//   once,
//   twice: once,
//   wait0: wait(0),
//   idle,
//   tick,
//   wait10: wait(10),
//   next,
//   task,
//   then,
//   sync
// }).forEach(([name, fn]) => fn(console.log)(name));

// console.log("end ");
