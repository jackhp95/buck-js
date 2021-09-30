import { asBool } from "./utils.js";

const accessor = {
  Value:
    (prop) =>
    (el) =>
    (...a) =>
      a.length ? (el[prop] = a[0]) : el[prop],
  String:
    (prop) =>
    (el) =>
    (...a) =>
      a.length ? (el[prop] = (a[0]) || "") : el[prop] || "",
  Boolean:
    (prop) =>
    (el) =>
    (...a) =>
      a.length ? (el[prop] = asBool(a[0])) : !!el[prop],
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

const aria = {
  Atomic: accessor.String("ariaAtomic"),
  AutoComplete: accessor.String("ariaAutoComplete"),
  Busy: accessor.String("ariaBusy"),
  Checked: accessor.String("ariaChecked"),
  Col: {
    Count: accessor.String("ariaColCount"),
    Index: accessor.String("ariaColIndex"),
    IndexText: accessor.String("ariaColIndexText"),
    Span: accessor.String("ariaColSpan"),
  },
  Current: accessor.String("ariaCurrent"),
  Description: accessor.String("ariaDescription"),
  Disabled: accessor.String("ariaDisabled"),
  Expanded: accessor.String("ariaExpanded"),
  HasPopup: accessor.String("ariaHasPopup"),
  Hidden: accessor.String("ariaHidden"),
  KeyShortcuts: accessor.String("ariaKeyShortcuts"),
  Label: accessor.String("ariaLabel"),
  Level: accessor.String("ariaLevel"),
  Live: accessor.String("ariaLive"),
  Modal: accessor.String("ariaModal"),
  Multiline: accessor.String("ariaMultiline"),
  MultiSelectable: accessor.String("ariaMultiSelectable"),
  Orientation: accessor.String("ariaOrientation"),
  Placeholder: accessor.String("ariaPlaceholder"),
  PosInSet: accessor.String("ariaPosInSet"),
  Pressed: accessor.String("ariaPressed"),
  ReadOnly: accessor.String("ariaReadOnly"),
  Relevant: accessor.String("ariaRelevant"),
  Required: accessor.String("ariaRequired"),
  RoleDescription: accessor.String("ariaRoleDescription"),
  Row: {
    Count: accessor.String("ariaRowCount"),
    Index: accessor.String("ariaRowIndex"),
    IndexText: accessor.String("ariaRowIndexText"),
    Span: accessor.String("ariaRowSpan"),
  },
  Selected: accessor.String("ariaSelected"),
  SetSize: accessor.String("ariaSetSize"),
  Sort: accessor.String("ariaSort"),
  Value: {
    Max: accessor.String("ariaValueMax"),
    Min: accessor.String("ariaValueMin"),
    Now: accessor.String("ariaValueNow"),
    Text: accessor.String("ariaValueText"),
  },
};

const dom = {
  // self
  localName: "localName",
  tagName: "tagName",
  nodeType: "nodeType",
  nodeName: "nodeName",
  nodeValue: "nodeValue",
  // Children
  children: "children",
  childNodes: "childNodes",
  firstElementChild: "firstElementChild",
  lastElementChild: "lastElementChild",
  childElementCount: "childElementCount",
  firstChild: "firstChild",
  lastChild: "lastChild",
  // Web Component
  is: "is",
  part: "part",
  slot: "slot",
  shadowRoot: "shadowRoot",
  assignedSlot: "assignedSlot",
  // Hierarchy
  ownerDocument: "ownerDocument",
  isConnected: "isConnected",
  parentElement: "parentElement",
  parentNode: "parentNode",
  previousElementSibling: "previousElementSibling",
  previousSibling: "previousSibling",
  nextElementSibling: "nextElementSibling",
  nextSibling: "nextSibling",
};

const visual = {
  style: "style",
  bgColor: "bgColor",
  background: "background",
  scroll: {
    Top: "scrollTop",
    Left: "scrollLeft",
    Width: "scrollWidth",
    Height: "scrollHeight",
    TopMax: "scrollTopMax",
    LeftMax: "scrollLeftMax",
  },
  client: {
    Top: "clientTop",
    Left: "clientLeft",
    Width: "clientWidth",
    Height: "clientHeight",
  },
  offset: {
    Parent: "offsetParent",
    Top: "offsetTop",
    Left: "offsetLeft",
    Width: "offsetWidth",
    Height: "offsetHeight",
  },
};

const events = {
  abort: "onabort",
  autocomplete: "onautocomplete",
  autocompleteerror: "onautocompleteerror",
  blur: "onblur",
  cancel: "oncancel",
  canplay: "oncanplay",
  canplaythrough: "oncanplaythrough",
  change: "onchange",
  click: "onclick",
  close: "onclose",
  contextmenu: "oncontextmenu",
  cuechange: "oncuechange",
  dblclick: "ondblclick",
  drag: "ondrag",
  drag: {
    end: "ondragend",
    enter: "ondragenter",
    leave: "ondragleave",
    over: "ondragover",
    start: "ondragstart",
  },
  drop: "ondrop",
  durationchange: "ondurationchange",
  emptied: "onemptied",
  ended: "onended",
  error: "onerror",
  focus: "onfocus",
  input: "oninput",
  invalid: "oninvalid",
  key: { down: "onkeydown", press: "onkeypress", up: "onkeyup" },
  load: "onload",
  loadeddata: "onloadeddata",
  loadedmetadata: "onloadedmetadata",
  loadstart: "onloadstart",
  pointer: {
    down: "onpointerdown",
    enter: "onpointerenter",
    leave: "onpointerleave",
    move: "onpointermove",
    out: "onpointerout",
    over: "onpointerover",
    up: "onpointerup",
  },
  touch: {
    down: "ontouchdown",
    enter: "ontouchenter",
    leave: "ontouchleave",
    move: "ontouchmove",
    out: "ontouchout",
    over: "ontouchover",
    up: "ontouchup",
  },
  mouse: {
    down: "onmousedown",
    enter: "onmouseenter",
    leave: "onmouseleave",
    move: "onmousemove",
    out: "onmouseout",
    over: "onmouseover",
    up: "onmouseup",
    wheel: "onmousewheel",
  },
  pause: "onpause",
  play: "onplay",
  playing: "onplaying",
  progress: "onprogress",
  ratechange: "onratechange",
  reset: "onreset",
  resize: "onresize",
  scroll: "onscroll",
  seeked: "onseeked",
  seeking: "onseeking",
  select: "onselect",
  show: "onshow",
  sort: "onsort",
  stalled: "onstalled",
  submit: "onsubmit",
  suspend: "onsuspend",
  timeupdate: "ontimeupdate",
  toggle: "ontoggle",
  volumechange: "onvolumechange",
  waiting: "onwaiting",
};

const microdata = {
  item: {
    id: accessor.String("itemid"),
    prop: accessor.String("itemprop"),
    ref: accessor.String("itemref"),
    scope: accessor.String("itemscope"),
    type: accessor.String("itemtype"),
  },
};

const element = {
  title: accessor.String("title"),
  id: accessor.String("id"),
  html: accessor.Value("innerHTML"),
  text: accessor.Value("textContent"),
  className: accessor.String("className"),
  // Obj
  // classList: accessor.Array("classList"),
  // data: accessor.Object("dataset"),
  // attributes: accessor.Attributes,
  // bool
  hidden: accessor.Boolean("hidden"),
  checked: accessor.Boolean("checked"),
  draggable: accessor.Boolean("draggable"),
  contentEditable: accessor.Boolean("contenteditable"),
  spellcheck: accessor.Boolean("spellcheck"),
  autocapitalize: accessor.Boolean("autocapitalize"),
  autocomplete: accessor.Boolean("autocomplete"),
  autofocus: accessor.Boolean("autofocus"),
  // Keyboard
  accesskey: accessor.String("accesskey"),
  enterkeyhint: accessor.String("enterkeyhint"),
  inputMode: accessor.String("inputmode"),
  tabIndex: accessor.String("tabIndex"),
  // i18n
  lang: accessor.String("lang"),
  translate: accessor.String("translate"),
  dir: accessor.String("dir"),
};

const input = {
  accept: accessor.String("accept"),
  alt: accessor.String("alt"),
  autocomplete: accessor.String("autocomplete"),
  autofocus: accessor.String("autofocus"),
  capture: accessor.String("capture"),
  checked: accessor.String("checked"),
  dirname: accessor.String("dirname"),
  disabled: accessor.String("disabled"),
  form: accessor.String("form"),
  formaction: accessor.String("formaction"),
  formenctype: accessor.String("formenctype"),
  formmethod: accessor.String("formmethod"),
  formnovalidate: accessor.String("formnovalidate"),
  formtarget: accessor.String("formtarget"),
  height: accessor.String("height"),
  list: accessor.String("list"),
  max: accessor.String("max"),
  maxlength: accessor.String("maxlength"),
  min: accessor.String("min"),
  minlength: accessor.String("minlength"),
  multiple: accessor.String("multiple"),
  name: accessor.String("name"),
  pattern: accessor.String("pattern"),
  placeholder: accessor.String("placeholder"),
  readonly: accessor.String("readonly"),
  required: accessor.String("required"),
  size: accessor.String("size"),
  src: accessor.String("src"),
  step: accessor.String("step"),
  type: accessor.String("type"),
  value: accessor.Value("value"),
  width: accessor.String("width"),
};

const validation = {
  validationMessage: accessor.String("validationMessage"),
  willValidate: true,
  validity: {
    badInput: false,
    customError: true,
    patternMismatch: true,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: false,
    valueMissing: false,
  },
  attrValue: accessor.String(""),
  value: accessor.String(""),
  valueAsDate: null,
  valueAsNumber: NaN,
};

export { aria, dom, visual, events, microdata, element, input, validation };
