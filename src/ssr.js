import { parseHTML } from "https://raw.githubusercontent.com/WebReflection/linkedom/main/worker.js";
import { dom, attr } from "html.api.js";


const getPath = (path, _default) => (data) =>
  path
    .split(/[.[\]]/)
    .filter(Boolean)
    .reduce((value, key) => value?.[key], data);

const template = (prefix) => ({
  // scope: () => {},
  // ref: () => {},
  // if: () => {},
  // elseif: () => {},
  // else: () => {},
  each: (el) => (value) => Object.entries(value).forEach(
    ([k,v]) => {

    }
  ),
  // include: () => {},
  // await: () => {},
  // then: () => {},
});

const ssr = (_config) => (html) => (model) => {
  const config = { prefix: "x-", model: {}};
  Object.assign(config, _config);
  const { prefix, model } = config;
  const { document } = parseHTML(html);

  Object.entries({ ...dom, ...attr }).forEach((codec) => {
    const [select, accessor] = codec;
    document.querySelectorAll(`[${prefix}${select}]`).forEach((el) => {
      const dataPath = el.getAttribute(`${prefix}${select}`);
      const newValue = get(dataPath)(model);
      // Apply Data to DOM
      accessor(el)(newValue);
    });
  });
  return document.toString()
};

export { ssr };
