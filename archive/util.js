export const util = {
  QSA: (s, x) => x.querySelectorAll(s),
  log: (x) => (console.log(x), x),
  loop: (fn) => (xs, c) => {
    let o = (!c && xs) || (c.filter || c.map ? [] : c.reduce);
    let runItem =
      (!c && ((i) => fn(xs[i]))) ||
      ((c.map || c.filter) && ((i) => fn(xs[i]))) ||
      ((i) => fn(c.reduce, xs[i]));
    let updateOutput =
      (!c && ((fo) => fo)) ||
      (c.filter && ((fo) => fo && o.push(fo))) ||
      (c.map && ((fo) => o.push(fo))) ||
      (c.reduce && ((fo) => (o = fo)));

    for (let i = 0, len = xs.length; i < len; i++) {
      updateOutput(runItem(i));
    }
    return !c ? xs : o;
  },
  upsertMap:
    (map) =>
    (value = {}) =>
    (key) => {
      const x = map.get(key);
      !!x ? Object.assign(x, value) : map.set(key, value);
      return map;
    },
  oncePerFrame: (fn) => {
    let queued;
    return function (...args) {
      if (queued) cancelAnimationFrame(queued);
      queued = requestAnimationFrame(fn.bind(fn, ...args));
    };
  },
  oncePerIdle: (fn) => {
    let queued;
    return function (...args) {
      if (queued) cancelIdleCallback(queued);
      queued = requestIdleCallback(fn.bind(fn, ...args));
    };
  },
  once:
    (fn) =>
    (...args) => {
      let ran = false;
      let cache;
      return (...args) => {
        if (ran) return cache;
        cache = fn.bind(fn, ...args)();
        ran = true;
        return cache;
      };
    },
  asEl: (node) => (node.tagName ? node : node.parentElement),
};


const plugin_api = {
  matches: "",
  media: "",
  onChange: (_event, _timing) => {},
}