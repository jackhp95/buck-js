const loop = (fn) => (xs) => {
  for (const x of xs) {
    fn(x);
  }
};
const log = (x) => (console.log(x), x);

const extendQuery = (filterOrFind) => ({
  children: (el, sel = "*") =>
    [...el.children][filterOrFind]((x) => x.matches(sel)),
  siblings: (el, sel = "*") =>
    [...el.parentElement.children][filterOrFind]((x) => x.matches(sel)),
});
extendQuery.index = (el, sel) => extendQSA.children(el, sel).indexOf(el);

const QSA = Object.assign(
  (sel, el = document) => el.querySelectorAll(sel),
  extendQuery("filter")
);

const QS = Object.assign(
  (sel, el = document) => el.querySelector(sel),
  extendQuery("find")
);

const asEl = (node) => (node.tagName ? node : node.parentElement);
const invoke = (fn, ...args) => fn(...args);
const noop = () => {};
const identity = (x) => x;
const kebabToCamel = (str) => str.replace(/-./g, (m) => m.toUpperCase()[1]);
const camelToKebab = (str) =>
  str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const parseNumber = (value, locales = navigator.languages) => {
  const example = Intl.NumberFormat(locales).format("1.1");
  const cleanPattern = new RegExp(`[^-+0-9${example.charAt(1)}]`, "g");
  const cleaned = value.replace(cleanPattern, "");
  const normalized = cleaned.replace(example.charAt(1), ".");

  return parseFloat(normalized);
};

const accessor = {
  Value:
    (prop) =>
    (el) =>
    (...a) =>
      a.length ? (el[prop] = a[0]) : el[prop],
  Number:
    (prop) =>
    (el) =>
    (...a) =>
      a.length ? (el[prop] = Number(a[0])) : Number(el[prop]),
  String:
    (prop) =>
    (el) =>
    (...a) =>
      a.length ? (el[prop] = a[0] || "") : el[prop] || "",
  Boolean:
    (prop) =>
    (el) =>
    (...a) =>
      a.length ? (el[prop] = !!a[0]) : !!el[prop],
  Object:
    (prop) =>
    (el) =>
    (...a) =>
      a.length ? Object.assign(el[prop], a[0]) : el[prop],
  Array:
    (prop) =>
    (el) =>
    (...a) =>
      a.length ? (el[prop] = a[0]) : [...el[prop]],
  ContentEditable:
    (el) =>
    (...a) =>
      a.length
        ? (el.contentEditable = a[0] ? "true" : "false")
        : el.isContentEditable,
  Attributes:
    (el) =>
    (...a) => {
      const set = () =>
        Object.entries(a[0]).reduce((obj, [k, v]) => {
          el.setAttribute(k, v);
          obj[k] = v;
          return obj;
        }, {});
      const get = () =>
        [...el.attributes].reduce((obj, x) => {
          obj[x.name] = x.value;
          return obj;
        }, {});
      return a.length ? set() : get();
    },
};

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
  asBool,
  kebabToCamel,
  camelToKebab,
  accessor,
};
