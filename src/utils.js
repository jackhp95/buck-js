const loop = (fn) => (xs) => {
  for (const x of xs) {
    fn(x);
  }
};
const log = (x) => (console.log(x), x);
const QSA = (sel, el = document) => el.querySelectorAll(sel);
const QS = (sel, el = document) => el.querySelector(sel);
const asEl = (node) => (node.tagName ? node : node.parentElement);
const invoke = (fn, ...args) => fn(...args);
const noop = () => {};
const maybe =
  (mapFn, withDefault = noop) =>
  (...args) => {
    try {
      return mapFn(...args);
    } catch (e) {
      return withDefault(e, ...args);
    }
  };
const perf =
  (fn, _name) =>
  async (...args) => {
    const name = _name || fn.name;
    performance.mark("a");
    const result =
      typeof fn?.then === "function" ? await fn(...args) : fn(...args);
    performance.mark("b");
    performance.measure(name, "a", "b");
    loop(console.log)(performance.getEntriesByName(name, "measure"));
    return result;
  };
const documentPositionComparator = (a, b) => {
  if (a === b) {
    return 0;
  }
  var position = a.compareDocumentPosition(b);
  if (
    position & Node.DOCUMENT_POSITION_FOLLOWING ||
    position & Node.DOCUMENT_POSITION_CONTAINED_BY
  ) {
    return -1;
  } else if (
    position & Node.DOCUMENT_POSITION_PRECEDING ||
    position & Node.DOCUMENT_POSITION_CONTAINS
  ) {
    return 1;
  } else {
    return 0;
  }
};
const sortEls = (els) =>
  ("sort" in els ? els : [...els]).sort(documentPositionComparator);

const attrPatternMatch = {
  1: (el) => {
    const o = {};
    loop((a) => {
      o[a.name] = a.value;
    })(el.attributes);
    return o;
  },
  2: (el, get) => el.getAttribute(get),
  3: (el, get, set) => el.setAttribute(get, set),
};
const attrFn = (...args) => attrPatternMatch[args.length](args);

const inlineFunction =
  (attrName, ...argNames) =>
  (el, ...argValues) => {
    if (!(attrName in el)) {
      const fn = Function(...argNames, el.getAttribute(attrName)).bind(el);
      el[attrName] = fn;
    }
    return el[attrName](...argValues);
  };

const inlineResolve = (attrName, obj) => (el) => {
  if (!(attrName in el)) {
    const path = el.getAttribute(attrName);
    const cleanPath = /^[\.\[]/.test(path) ? path : "." + path;
    // store the callback function to make non-ref values reactive;
    el[attrName] = Function(
      "maybe",
      "obj",
      `return maybe((...a) => {
          if (a.length) {
            const [value] = a;
            obj${cleanPath} = value;
          }
          return obj${cleanPath};
        });`
    )(maybe, obj);
  }
  return el[attrName];
};

const inline = {
  event: (attrName) => (event) =>
    inlineFunction(attrName, "event")(event.target, event),
  entry: (attrName) => (entry) =>
    inlineFunction(attrName, "entry")(entry.target, entry),
  js: inlineFunction,
  resolve: inlineResolve,
};

const attr = Object.assign(attrFn, inline);
const cssPatternMatch = {
  2: (el, key) => getComputedStyle(el).getPropertyValue(key),
  3: (el, key, value) => {
    el.style[key] = value;
  },
};
const css = (...args) => cssPatternMatch[args.length](...args);

export {
  loop,
  log,
  QSA,
  QS,
  asEl,
  sortEls,
  css,
  invoke,
  perf,
  attr,
  maybe,
  noop,
};
