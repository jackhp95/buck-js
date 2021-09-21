const loop = (fn) => (xs) => {
  for (const x of xs) {
    fn(x);
  }
};
const log = (x) => (console.log(x), x);
const QSA = (sel, el = document) => el.querySelectorAll(sel);
const asEl = (node) => (node.tagName ? node : node.parentElement);
const invoke = (fn, ...args) => fn(...args);
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

export { loop, log, QSA, asEl, sortEls, invoke };
