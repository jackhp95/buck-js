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
import { camelToKebab, flattenObject } from "./utils.js";

const hook = (resolver) => {
  const set = resolver();
  const isFn = typeof resolvedValue === "function";
  const val = isFn ? resolvedValue() : resolvedValue;
  return [val, set];
};

const definePlugin = (attr, prop) => (model) => {
  const localMap = new Map();

  return {
    select: `[${attr}]`,
    update: (el) => {
      if (el.isConnected && el.hasAttribute(attr)) {
        attr.resolve(attr, model)(el);
        // set up reactive effect
        if (!localMap.has(el)) {
          // Data change will update DOM
          const fx = effect(() => {
            const [val] = hook(el[attr]);
            if (val != el[prop]) el[prop] = val;
          });
          localMap.set(el, fx);
        }
        // DOM change will update Data
        const [val, set] = hook(el[attr]);
        if (val != el[prop]) set(el[prop]);
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
      console.log(attr, prop);
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
