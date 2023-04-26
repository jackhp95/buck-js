import { parseHTML } from "https://raw.githubusercontent.com/WebReflection/linkedom/main/worker.js";

const linkedom = parseHTML(`
    <!doctype html>
    <html lang="en">
      <head>
        <title>Hello SSR</title>
      </head>
      <body>
        <h1 x-text="greet"></h1>
      </body>
    </html>
  `);

const {
  //   // note, these are *not* globals
  //   window,
  document,
  //   customElements,
  //   HTMLElement,
  //   Event,
  //   CustomEvent,
  //   // other exports ..
} = linkedom;

import { dom, attr } from "./dist/html.api.js";

const prefix = "x";
const model = { greet: "Hello World!" };
Object.entries({ ...dom, ...attr }).forEach((codec) => {
  const [select, accessor] = codec;

  document.querySelectorAll(`[${prefix}-${select}]`).forEach((el) => {
    const dataPath = el.getAttribute(`${prefix}-${select}`);
    const newValue = model[dataPath];
    // Apply Data to DOM
    accessor(el)(newValue);
  });
});

console.log(document.toString());
console.log("HELLO!");
