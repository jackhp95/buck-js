import {
  reactive,
  effect,
  stop,
} from "https://jackhpeterson.com/__/esm/@vue/reactivity";
import { aria, attr, dom } from "./html.api.js";
import { then } from "./orca.js";
import {
  camelToKebab,
  flattenObject,
  equals,
  QSA,
  QS,
  log,
  maybe,
  loop,
} from "./utils.js";

const memoize =
  (fn) =>
  (attrName, ...argNames) =>
  (el, ...argValues) => {
    if (!(attrName in el)) {
      el[attrName] = fn(attrName, ...argNames)(el, ...argValues);
    }
    return el[attrName](...argValues);
  };

// IIFE: Sets up the static parts once, so dynamic parts can be faster.
const [xTemplate] = ["x-template"];
const selectorList = ["x-scope", "x-ref", "x-each", "x-key"];
const [scope, ref, each, key] = selectorList;
const sel = selectorList.map((a) => `[${a}]`).join();

const getScope = (el, root, attrName) => {
  const anc = el.closest(sel);
  if (anc) {
    // includes statements prevents reccursion on self
    if (![ref, scope, each, key].includes(attrName) && anc[key])
      return anc[key]();
    if (![ref, scope, each].includes(attrName) && anc[each]) return anc[each]();
    if (![ref, scope].includes(attrName) && anc[scope]) return anc[scope]();
    if (![ref].includes(attrName) && anc[ref]) return anc[ref]();
    // all paths have been evaluated on on the current el, so move to parent
    return getScope(el.parentElement, root, attrName);
  }
  return root;
};
const isInt = (val) => {
  const maybeInt = parseInt(val);
  return !(maybeInt !== maybeInt);
};
const inlinePath = (attrName, root) => (el) => {
  const val = el.getAttribute(attrName);
  const path = isInt(val) ? `[${val}]` : val;
  const okFn = `(...a) => a.length ? (obj${path} = a[0]) : obj${path}`;
  const errFn = `(e) => console.error("failed to resolve ${path} on", obj, "\\nERROR:", e)`;
  const result = `return maybe( ${okFn}, ${errFn} );`;
  return Function("maybe", "obj", result)(maybe, getScope(el, root, attrName));
};

const inlineFn =
  (attrName, ...argNames) =>
  (el, ...argValues) =>
    Function(...argNames, el.getAttribute(attrName)).bind(el);

const resolve = {
  event: (attrName) => (event) =>
    memoize(inlineFn)(attrName, "event")(event.target, event),
  entry: (attrName) => (entry) =>
    memoize(inlineFn)(attrName, "entry")(entry.target, entry),
  js: memoize(inlineFn),
  path: memoize(inlinePath),
};

const getEachMap = (el) =>
  QSA.children(el, "*:not(template)").reduce((m, elem) => {
    const k = elem.getAttribute(key);
    m.has(k) ? m.get(k).push(elem) : m.set(k, [elem]);
    return m;
  }, new Map());

const templateOfEach = (el) => {
  const childTemplates = QSA.children(el, "template");
  const idTemplate = QS(`template#${el.getAttribute(xTemplate)}`);
  const tmpls = [idTemplate, ...childTemplates]
    .filter((x) => x)
    .flatMap((t) => [...t.content.children]);
  return (k) =>
    tmpls.map((te) => {
      const x = te.cloneNode(true);
      x.setAttribute(key, k);
      return x;
    });
};

const insertKeyedChild = (el, domMap, objKeys) => {
  const templateFor = templateOfEach(el);
  const appendKeyedEl = (dki) => {
    const priorKeyEls = domMap.get(objKeys[dki - 1]);
    const priorEl = priorKeyEls[priorKeyEls.length - 1];
    return (kel) => priorEl.insertAdjacentElement("afterend", kel);
  };
  return (domKey) => {
    const tmpl = templateFor(domKey);
    const dki = objKeys.indexOf(domKey);
    dki ? tmpl.forEach(appendKeyedEl(dki)) : el.prepend(...tmpl);
    domMap.set(domKey, tmpl);
  };
};
const removeKeyedChild = (domMap) => (domKey) => {
  const elArr = domMap.get(domKey);
  elArr.forEach((x) => x.remove());
  elArr.length = 0;
  domMap.delete(domKey);
};

const diffKeys = (el) => {
  const obj = el[each]();
  const objKeys = Object.keys(Array.isArray(obj) ? [...obj] : { ...obj });
  const dom = getEachMap(el);
  const domKeys = [...dom.keys()];
  const justDom = domKeys.filter((dk) => !objKeys.includes(dk));
  const justObj = objKeys.filter((dk) => !domKeys.includes(dk));
  return { obj, objKeys, dom, domKeys, justDom, justObj };
};
const eachToDom = (el) => {
  const { justDom, justObj, dom, objKeys } = diffKeys(el);
  justObj.length && justObj.forEach(insertKeyedChild(el, dom, objKeys));
  justDom.length && justDom.forEach(removeKeyedChild(dom));
};

const eachToData = (el) => {
  const { justDom, justObj, obj } = diffKeys(el);
  justDom.length && justDom.forEach((dk) => (obj[dk] = isInt(dk) ? [] : {}));
  justObj.length && justObj.forEach((ok) => delete obj[ok]);
};

// Custom Templating (if, else, each, scope/ref, include, await, )
const templatePlugins = (prefix) => ({
  // scope: () => {},
  // ref: () => {},
  // if: () => {},
  // elseif: () => {},
  // else: () => {},
  each: (model) => {
    const localMap = new Map();
    return {
      select: `[${each}]`,
      update: (el) => {
        if (el.isConnected && el.hasAttribute(each)) {
          resolve.path(each, model)(el);
          // Dom updates Data
          eachToData(el);
          // set up reactive effect
          if (!localMap.has(el)) {
            // Data updates Dom
            const fx = effect(() => eachToDom(el));
            localMap.set(el, fx);
          }
        } else {
          // stop applying the reactive effect on the element
          if (localMap.has(el)) stop(localMap.get(el));
          // remove the element from storage (avoid mem leak)
          localMap.delete(el);
        }
      },
    };
  },
  key: (model) => {
    const wasInit = new Set();
    // Undo Template Data Changes
    const undo = (el) => {
      const prior = { ...el[key]() };
      const undoData = () => Object.assign(el[key](), prior);
      return then(undoData)();
    };
    return {
      select: `[${key}]`,
      update: (el) => {
        if (el.isConnected && el.hasAttribute(key)) {
          // memoize resolver if needed
          resolve.path(key, model)(el);
          wasInit.has(el) || undo(el);
        } else {
          wasInit.delete(el);
        }
      },
    };
  },
  // include: () => {},
  // await: () => {},
  // then: () => {},
});

const revise = (truthAccessor, compareAccessor) => {
  const trueValue = truthAccessor();
  if (!equals(trueValue, compareAccessor())) {
    compareAccessor(trueValue);
  }
};
const definePlugin = (attr, accessDom) => (model) => {
  const localMap = new Map();
  return {
    select: `[${attr}]`,
    update: (el) => {
      if (el.isConnected && el.hasAttribute(attr)) {
        // memoize resolver if needed
        resolve.path(attr, model)(el);
        // Dom updates Data
        revise(accessDom(el), el[attr]);
        // set up reactive effect
        if (!localMap.has(el)) {
          // Data updates Dom
          const fx = effect(() => revise(el[attr], accessDom(el)));
          localMap.set(el, fx);
        }
      } else {
        // stop applying the reactive effect on the element
        if (localMap.has(el)) stop(localMap.get(el));
        // remove the element from storage (avoid mem leak)
        localMap.delete(el);
      }
    },
  };
};

const plugins = (prefix = "x-") => {
  const apis = Object.assign({}, { aria }, attr, dom);
  const apiPlugins = Object.entries(
    flattenObject(apis, { join: (x) => `${x}-` })
  ).map(([a, p]) => {
    const attr = prefix + camelToKebab(a);
    const prop = p;
    return definePlugin(attr, prop);
  });
  return [...Object.values(templatePlugins(prefix)), ...apiPlugins];
};

const init = (_config) => {
  const _defaults = { model: reactive({}), plugins, prefix: "x-" };
  const c = Object.assign(_defaults, _config);
  return c.plugins(c.prefix).map((fn) => fn(model));
};

export { init, plugins };
