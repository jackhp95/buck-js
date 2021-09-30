import {
  reactive,
  effect,
  computed,
} from "https://jackhpeterson.com/__/esm/@vue/reactivity";
import {
  aria,
  dom,
  visual,
  events,
  microdata,
  element,
  input,
  validation,
} from "./html.api.js";
import {
  camelToKebab,
  flattenObject,
  resolve,
  equals,
  log,
  loop,
} from "./utils.js";
import { then } from "./orca.js";

// Misc (debug, split, loop.first, loop.last, loop.key, loop.value, filter, min, max, loop.length, sort)

// Text Formatting (dates, json, md, currency, encoding)

// Custom Templating (if, else, each, scope/ref, include, await, )

// One Way Properties (clientHeight, onclick)

// Boolean Properties (Hidden, Required)

// Strange Dual Properties (Value, Id)

// Object Properties (ClassList, Attributes)

// String Properties (ClassName, innerHTML)

// perhaps this should be reworked:
// resolver should be renamed to access
// access = (?setNew) = value
// resolver should JUST mean taking an attribute string, and resolving where that data exists.
// once you resolve what data your attribute value (string) is referencing, you can access it.
// 1) Compare dom/data
// isEq(accessDom(), accessData()) // use vue equality
// 2) Pull Data from Dom (use _.set or something to create new Data Structures)
// update = () => compare || accessData(accessDom())
// 3) Establish Data Binding
// effect = () => compare || accessDom(accessData())
//
// The effect and update api could be unified
// revise = (truthAccessor, compareAccessor) = () => {
//    const truth = truthAccessor();
//    isEq(trueValue, compareAccessor()) || compareAccessor(trueValue);
// }
// effect(revise(dataAccessor, domAccessor))
// update(manageCodec(revise(dataAccessor, domAccessor)))
//
// manageCodec tracks the element avoids mem leaks
// erases removed/irrelevant elements and closes effects
// only applies revise when relevant.
//
// accessData === attr.access =
// { path: "current attr.resolve"
// , obj: JSON.parse()
// , fetch: fetch()
// , dom: QS(), QSA()
// , js: inline
// , method: runs JS method (Safer than inline JS [TEA Msg])
// }
// accessDom === prop.access =
// { String: current definePlugin // { attr: false, prop: true }
// , Object: dataset
// , Map: attributes, classlist
// , Bool: hidden, draggable
// }

// definePlugin = (xAttr, accessDom, resolve.path) => (model) => {
// select = `[${xAttr}]`;
// update = (el) => {
// create cached accessData from resolve(attr(el, xAttr)) if one doesn't exist.
// accessData is stored at el[xAttr],
// run revise(accessDom, el[xAttr])()
// create effect (if it doesn't exist)
// pull fresh el[xAttr] inside effect. (needed for reactivity AND helps avoid mutation issues)
// effect(revise(el[xAttr],accessDom))
// }
// }

const revise = (truthAccessor, compareAccessor) => {
  const trueValue = truthAccessor();
  if (!equals(trueValue, compareAccessor())) {
    compareAccessor(trueValue);
    console.log("settingHTML", trueValue, compareAccessor());
  }
};
const definePlugin = (attr, accessDom) => (model) => {
  const localMap = new Map();
  return {
    select: `[${attr}]`,
    update: (el) => {
      if (el.isConnected && el.hasAttribute(attr)) {
        // Dom updates Data
        revise(accessDom(el), resolve.path(attr, model)(el));
        // set up reactive effect
        if (!localMap.has(el)) {
          // Data updates Dom
          const thenRevise = () => {
            // needed to set up reactivity
            el[attr]();
            tick(() => revise(el[attr], accessDom(el)))();
          };
          then(effect)(thenRevise).then((fx) => localMap.set(el, fx));
        }
      } else {
        // stop applying the reactive effect on the element
        if (localMap.has(el)) localMap.get(el).stop();
        // remove the element from storage (avoid mem leak)
        localMap.delete(el);
      }
    },
  };
};
const oneWay = { validation, events, dom };

const plugins = (prefix = "x-") => {
  const apis = Object.assign({}, { aria }, microdata, element, input);
  return Object.entries(flattenObject(apis, { join: (x) => `${x}-` })).map(
    ([a, p]) => {
      const attr = prefix + camelToKebab(a);
      const prop = p;
      return definePlugin(attr, prop);
    }
  );
};

const init = (_config) => {
  const _defaults = { model: reactive({}), plugins, prefix: "x-" };
  const c = Object.assign(_defaults, _config);
  return c.plugins(c.prefix).map((fn) => fn(model));
};

export { init, plugins };
