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
const identity = (x) => x;
const kebabToCamel = (str) => str.replace(/-./g, (m) => m.toUpperCase()[1]);
const camelToKebab = (str) =>
  str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const falseRE = /^\s*|false|f|0|\s*$/i;
const asBool = (any) => (typeof any === "string" ? !falseRE.test(any) : !!any);
const equals = (a, b) => {
  if (a === b) return true;

  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();

  if (!a || !b || (typeof a !== "object" && typeof b !== "object"))
    return a === b;

  if (a.prototype !== b.prototype) return false;

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;

  return keys.every((k) => equals(a[k], b[k]));
};
const dotNoteRE = /^[\w|\$|\_][\w|\$|\_|0-9]+/;
const dotOrBox = (v) =>
  dotNoteRE.test(v) ? `${v}.` : `[${v.replaceAll('"', '\\"')}].`;

const flattenObject = (obj, c) => {
  const { prefix, join } = Object.assign({ prefix: "", join: dotOrBox }, c);
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? `${prefix}` : "";
    if (
      typeof obj[k] === "object" &&
      obj[k] !== null &&
      Object.keys(obj[k]).length > 0
    )
      Object.assign(
        acc,
        flattenObject(obj[k], { prefix: pre + join(k), join })
      );
    else acc[pre + k] = obj[k];
    return acc;
  }, {});
};

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
    const result = await Promise.resolve(fn(...args));
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

const inlineFunction =
  (attrName, ...argNames) =>
  (el, ...argValues) => {
    if (!(attrName in el)) {
      const fn = Function(...argNames, el.getAttribute(attrName)).bind(el);
      el[attrName] = fn;
    }
    return el[attrName](...argValues);
  };
const cleanPathRE = /^[\.\[]/;
const inlinePath = (attrName, obj) => (el) => {
  if (!(attrName in el)) {
    const path = el.getAttribute(attrName);
    const cleanPath = cleanPathRE.test(path) ? path : "." + path;

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
        }, () => console.error("failed to resolve ${path}"));`
    )(maybe, obj);
  }
  return el[attrName];
};

const resolve = {
  event: (attrName) => (event) =>
    inlineFunction(attrName, "event")(event.target, event),
  entry: (attrName) => (entry) =>
    inlineFunction(attrName, "entry")(entry.target, entry),
  js: inlineFunction,
  path: inlinePath,
};

const attr = (...args) => attrPatternMatch[args.length](args);
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
  resolve,
  asEl,
  sortEls,
  css,
  invoke,
  equals,
  flattenObject,
  perf,
  attr,
  maybe,
  noop,
  identity,
  falseRE,
  asBool,
  kebabToCamel,
  camelToKebab,
};
