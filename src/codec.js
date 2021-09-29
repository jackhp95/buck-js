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
import { camelToKebab, flattenObject, attr, log } from "./utils.js";


// Misc (debug, split, loop.first, loop.last, loop.key, loop.value, filter, min, max, loop.length, sort)

// Text Formatting (dates, json, md, currency, encoding)

// Custom Templating (if, else, each, scope/ref, include, await, )


// One Way Properties (clientHeight, onclick)

// Boolean Properties (Hidden, Required) 

// Strange Dual Properties (Value, Id)

// Object Properties (ClassList, Attributes)

// String Properties (ClassName, innerHTML)
const definePlugin = (elAttr, prop) => (model) => {
  const localMap = new Map();

  return {
    select: `[${elAttr}]`,
    update: (el) => {
      if (el.isConnected && el.hasAttribute(elAttr)) {
        attr.resolve(elAttr, model)(el);
        // DOM change will update Data
        const resolver = el[elAttr];
        if (resolver() != el[prop]) resolver(el[prop]);
        // set up reactive effect
        if (!localMap.has(el)) {
          // Data change will update DOM
          const fx = effect(() => {
            const resolver = el[elAttr];
            if (resolver() != el[prop]) el[prop] = resolver();
          });
          localMap.set(el, fx);
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
