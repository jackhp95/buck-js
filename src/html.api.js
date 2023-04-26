import { accessor } from "./utils.js";
// Misc (debug, split, loop.first, loop.last, loop.key, loop.value, filter, min, max, loop.length, sort)

// Text Formatting (dates, json, md, currency, encoding)

// One Way Properties (clientHeight, onclick)

// Boolean Properties (Hidden, Required)

// Strange Dual Properties (Value, Id)

// Object Properties (ClassList, Attributes)

// String Properties (ClassName, innerHTML)

// I think this is all aria attributes
const aria = {
  Atomic: accessor.String("ariaAtomic"),
  AutoComplete: accessor.String("ariaAutoComplete"),
  Busy: accessor.String("ariaBusy"),
  Checked: accessor.String("ariaChecked"),
  ColCount: accessor.String("ariaColCount"),
  ColIndex: accessor.String("ariaColIndex"),
  ColIndexText: accessor.String("ariaColIndexText"),
  ColSpan: accessor.String("ariaColSpan"),
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
  RowCount: accessor.String("ariaRowCount"),
  RowIndex: accessor.String("ariaRowIndex"),
  RowIndexText: accessor.String("ariaRowIndexText"),
  RowSpan: accessor.String("ariaRowSpan"),
  Selected: accessor.String("ariaSelected"),
  SetSize: accessor.String("ariaSetSize"),
  Sort: accessor.String("ariaSort"),
  ValueMax: accessor.String("ariaValueMax"),
  ValueMin: accessor.String("ariaValueMin"),
  ValueNow: accessor.String("ariaValueNow"),
  ValueText: accessor.String("ariaValueText"),
};
// Window doesn't make much sense.
// if values change, there's no way to listen for it.
// unless you set up an event/observer, at which point,
// just use that observer/event
const window = {
  self: accessor.Object("self"),
  name: accessor.String("name"),
  history: accessor.Object("history"),
  customElements: accessor.Object("customElements"),
  locationbar: accessor.Object("locationbar"),
  menubar: accessor.Object("menubar"),
  personalbar: accessor.Object("personalbar"),
  scrollbars: accessor.Object("scrollbars"),
  statusbar: accessor.Object("statusbar"),
  toolbar: accessor.Object("toolbar"),
  status: accessor.String("status"),
  closed: accessor.Boolean("closed"),
  frames: accessor.Object("frames"),
  length: accessor.Number("length"),
  opener: accessor.Object("opener"),
  parent: accessor.Object("parent"),
  frameElement: accessor.Object("frameElement"),
  navigator: accessor.Object("navigator"),
  clientInformation: accessor.Object("clientInformation"),
  external: accessor.Object("external"),
  screen: accessor.Object("screen"),
  innerWidth: accessor.Number("innerWidth"),
  innerHeight: accessor.Number("innerHeight"),
  scrollX: accessor.Number("scrollX"),
  pageXOffset: accessor.Number("pageXOffset"),
  scrollY: accessor.Number("scrollY"),
  pageYOffset: accessor.Number("pageYOffset"),
  screenLeft: accessor.Number("screenLeft"),
  screenTop: accessor.Number("screenTop"),
  screenX: accessor.Number("screenX"),
  screenY: accessor.Number("screenY"),
  outerWidth: accessor.Number("outerWidth"),
  outerHeight: accessor.Number("outerHeight"),
  performance: accessor.Object("performance"),
  mozInnerScreenX: accessor.Number("mozInnerScreenX"),
  mozInnerScreenY: accessor.Number("mozInnerScreenY"),
  devicePixelRatio: accessor.Number("devicePixelRatio"),
  scrollMaxX: accessor.Number("scrollMaxX"),
  scrollMaxY: accessor.Number("scrollMaxY"),
  fullScreen: accessor.Boolean("fullScreen"),
  content: accessor.Object("content"),
  sidebar: accessor.Object("sidebar"),
  visualViewport: accessor.Object("visualViewport"),
  crypto: accessor.Object("crypto"),
  speechSynthesis: accessor.Object("speechSynthesis"),
  localStorage: accessor.Object("localStorage"),
  origin: accessor.String("origin"),
  crossOriginIsolated: accessor.Boolean("crossOriginIsolated"),
  isSecureContext: accessor.Boolean("isSecureContext"),
  indexedDB: accessor.Object("indexedDB"),
  caches: accessor.Object("caches"),
  sessionStorage: accessor.Object("sessionStorage"),
  window: accessor.Object("window"),
  document: accessor.Object("document"),
  location: accessor.Object("location"),
  top: accessor.Object("top"),
  netscape: accessor.Object("netscape"),
  console: accessor.Object("console"),
  globalThis: accessor.Object("globalThis"),
};
// useful!
// this is basically how codecs work.
// set an html attribute to bind a prop and data
// the props generally live on the element.
// data changes and dom changes are monitored and synced
const dom = {
  version: accessor.String("version"),
  title: accessor.String("title"),
  lang: accessor.String("lang"),
  dir: accessor.String("dir"),
  innerText: accessor.String("innerText"),
  hidden: accessor.Boolean("hidden"),
  accessKey: accessor.String("accessKey"),
  accessKeyLabel: accessor.String("accessKeyLabel"),
  draggable: accessor.Boolean("draggable"),
  contentEditable: accessor.String("contentEditable"),
  isContentEditable: accessor.Boolean("isContentEditable"),
  spellcheck: accessor.Boolean("spellcheck"),
  nonce: accessor.String("nonce"),
  offsetParent: accessor.Object("offsetParent"),
  offsetTop: accessor.Number("offsetTop"),
  offsetLeft: accessor.Number("offsetLeft"),
  offsetWidth: accessor.Number("offsetWidth"),
  offsetHeight: accessor.Number("offsetHeight"),
  dataset: accessor.Object("dataset"),
  tabIndex: accessor.Number("tabIndex"),
  onerror: accessor.Object("onerror"),
  namespaceURI: accessor.String("namespaceURI"),
  prefix: accessor.Object("prefix"),
  localName: accessor.String("localName"),
  tagName: accessor.String("tagName"),
  id: accessor.String("id"),
  className: accessor.String("className"),
  classList: accessor.Object("classList"),
  part: accessor.Object("part"),
  attributes: accessor.Object("attributes"),
  scrollTop: accessor.Number("scrollTop"),
  scrollLeft: accessor.Number("scrollLeft"),
  scrollWidth: accessor.Number("scrollWidth"),
  scrollHeight: accessor.Number("scrollHeight"),
  clientTop: accessor.Number("clientTop"),
  clientLeft: accessor.Number("clientLeft"),
  clientWidth: accessor.Number("clientWidth"),
  clientHeight: accessor.Number("clientHeight"),
  scrollTopMax: accessor.Number("scrollTopMax"),
  scrollLeftMax: accessor.Number("scrollLeftMax"),
  html: accessor.String("innerHTML"),
  outerHTML: accessor.String("outerHTML"),
  shadowRoot: accessor.Object("shadowRoot"),
  assignedSlot: accessor.Object("assignedSlot"),
  slot: accessor.String("slot"),
  previousElementSibling: accessor.Object("previousElementSibling"),
  nextElementSibling: accessor.Object("nextElementSibling"),
  children: accessor.Object("children"),
  firstElementChild: accessor.Object("firstElementChild"),
  lastElementChild: accessor.Object("lastElementChild"),
  childElementCount: accessor.Number("childElementCount"),
  nodeType: accessor.Number("nodeType"),
  nodeName: accessor.String("nodeName"),
  baseURI: accessor.String("baseURI"),
  isConnected: accessor.Boolean("isConnected"),
  ownerDocument: accessor.Object("ownerDocument"),
  parentNode: accessor.Object("parentNode"),
  parentElement: accessor.Object("parentElement"),
  childNodes: accessor.Object("childNodes"),
  firstChild: accessor.Object("firstChild"),
  lastChild: accessor.Object("lastChild"),
  previousSibling: accessor.Object("previousSibling"),
  nextSibling: accessor.Object("nextSibling"),
  nodeValue: accessor.Object("nodeValue"),
  text: accessor.String("textContent"),
  name: accessor.String("name"),
  httpEquiv: accessor.String("httpEquiv"),
  content: accessor.String("content"),
  scheme: accessor.String("scheme"),
  textProperty: accessor.String("text"),
  disabled: accessor.Boolean("disabled"),
  href: accessor.String("href"),
  crossOrigin: accessor.Object("crossOrigin"),
  rel: accessor.String("rel"),
  relList: accessor.Object("relList"),
  media: accessor.String("media"),
  hreflang: accessor.String("hreflang"),
  type: accessor.String("type"),
  referrerPolicy: accessor.String("referrerPolicy"),
  sizes: accessor.String("sizes"),
  imageSrcset: accessor.String("imageSrcset"),
  imageSizes: accessor.String("imageSizes"),
  charset: accessor.String("charset"),
  rev: accessor.String("rev"),
  target: accessor.String("target"),
  integrity: accessor.String("integrity"),
  as: accessor.String("as"),
  sheet: accessor.Object("sheet"),
  link: accessor.String("link"),
  vLink: accessor.String("vLink"),
  aLink: accessor.String("aLink"),
  bgColor: accessor.String("bgColor"),
  background: accessor.String("background"),
  align: accessor.String("align"),
  download: accessor.String("download"),
  ping: accessor.String("ping"),
  coords: accessor.String("coords"),
  shape: accessor.String("shape"),
  origin: accessor.String("origin"),
  protocol: accessor.String("protocol"),
  username: accessor.String("username"),
  password: accessor.String("password"),
  host: accessor.String("host"),
  hostname: accessor.String("hostname"),
  port: accessor.String("port"),
  pathname: accessor.String("pathname"),
  search: accessor.String("search"),
  hash: accessor.String("hash"),
  compact: accessor.Boolean("compact"),
  color: accessor.String("color"),
  noShade: accessor.Boolean("noShade"),
  size: accessor.String("size"),
  width: accessor.String("width"),
  reversed: accessor.Boolean("reversed"),
  start: accessor.Number("start"),
  acceptCharset: accessor.String("acceptCharset"),
  action: accessor.String("action"),
  autocomplete: accessor.String("autocomplete"),
  enctype: accessor.String("enctype"),
  encoding: accessor.String("encoding"),
  method: accessor.String("method"),
  noValidate: accessor.Boolean("noValidate"),
  elements: accessor.Object("elements"),
  length: accessor.Number("length"),
  form: accessor.Object("form"),
  willValidate: accessor.Boolean("willValidate"),
  validity: accessor.Object("validity"),
  validationMessage: accessor.String("validationMessage"),
  htmlFor: accessor.String("htmlFor"),
  control: accessor.Object("control"),
  accept: accessor.String("accept"),
  alt: accessor.String("alt"),
  autofocus: accessor.Boolean("autofocus"),
  defaultChecked: accessor.Boolean("defaultChecked"),
  checked: accessor.Boolean("checked"),
  files: accessor.Object("files"),
  formAction: accessor.String("formAction"),
  formEnctype: accessor.String("formEnctype"),
  formMethod: accessor.String("formMethod"),
  formNoValidate: accessor.Boolean("formNoValidate"),
  formTarget: accessor.String("formTarget"),
  height: accessor.String("height"),
  indeterminate: accessor.Boolean("indeterminate"),
  list: accessor.Object("list"),
  max: accessor.Number("max"),
  maxLength: accessor.Number("maxLength"),
  min: accessor.Number("min"),
  minLength: accessor.Number("minLength"),
  multiple: accessor.Boolean("multiple"),
  pattern: accessor.String("pattern"),
  placeholder: accessor.String("placeholder"),
  readOnly: accessor.Boolean("readOnly"),
  required: accessor.Boolean("required"),
  src: accessor.String("src"),
  step: accessor.String("step"),
  defaultValue: accessor.String("defaultValue"),
  valueAsDate: accessor.Object("valueAsDate"),
  valueAsNumber: accessor.Number("valueAsNumber"),
  labels: accessor.Object("labels"),
  selectionStart: accessor.Object("selectionStart"),
  selectionEnd: accessor.Object("selectionEnd"),
  selectionDirection: accessor.Object("selectionDirection"),
  useMap: accessor.String("useMap"),
  textLength: accessor.Number("textLength"),
  webkitEntries: accessor.Object("webkitEntries"),
  webkitdirectory: accessor.Boolean("webkitdirectory"),
  options: accessor.Object("options"),
  selectedOptions: accessor.Object("selectedOptions"),
  selectedIndex: accessor.Number("selectedIndex"),
  label: accessor.String("label"),
  defaultSelected: accessor.Boolean("defaultSelected"),
  selected: accessor.Boolean("selected"),
  index: accessor.Number("index"),
  cols: accessor.Number("cols"),
  rows: accessor.Object("rows"),
  wrap: accessor.String("wrap"),
  cite: accessor.String("cite"),
  position: accessor.Number("position"),
  low: accessor.Number("low"),
  high: accessor.Number("high"),
  optimum: accessor.Number("optimum"),
  dateTime: accessor.String("dateTime"),
  srcset: accessor.String("srcset"),
  isMap: accessor.Boolean("isMap"),
  decoding: accessor.String("decoding"),
  loading: accessor.String("loading"),
  naturalWidth: accessor.Number("naturalWidth"),
  naturalHeight: accessor.Number("naturalHeight"),
  complete: accessor.Boolean("complete"),
  hspace: accessor.Number("hspace"),
  vspace: accessor.Number("vspace"),
  longDesc: accessor.String("longDesc"),
  border: accessor.String("border"),
  currentSrc: accessor.String("currentSrc"),
  lowsrc: accessor.String("lowsrc"),
  x: accessor.Number("x"),
  y: accessor.Number("y"),
  caption: accessor.Object("caption"),
  tHead: accessor.Object("tHead"),
  tFoot: accessor.Object("tFoot"),
  tBodies: accessor.Object("tBodies"),
  frame: accessor.String("frame"),
  rules: accessor.String("rules"),
  summary: accessor.String("summary"),
  cellPadding: accessor.String("cellPadding"),
  cellSpacing: accessor.String("cellSpacing"),
  ch: accessor.String("ch"),
  chOff: accessor.String("chOff"),
  vAlign: accessor.String("vAlign"),
  rowIndex: accessor.Number("rowIndex"),
  sectionRowIndex: accessor.Number("sectionRowIndex"),
  cells: accessor.Object("cells"),
  colSpan: accessor.Number("colSpan"),
  rowSpan: accessor.Number("rowSpan"),
  headers: accessor.String("headers"),
  cellIndex: accessor.Number("cellIndex"),
  abbr: accessor.String("abbr"),
  scope: accessor.String("scope"),
  axis: accessor.String("axis"),
  noWrap: accessor.Boolean("noWrap"),
};

// handy, but _generally_ one way.
// maybe triggering a scroll,
// but triggering a click or shake doesn't make sense
const events = [
  "onabsolutedeviceorientation",
  "ondevicemotion",
  "ondeviceorientation",
  "onvrdisplayactivate",
  "onvrdisplayconnect",
  "onvrdisplaydeactivate",
  "onvrdisplaydisconnect",
  "onvrdisplaypresentchange",
  "onabort",
  "onafterprint",
  "onanimationcancel",
  "onanimationend",
  "onanimationiteration",
  "onanimationstart",
  "onauxclick",
  "onbeforeinput",
  "onbeforeprint",
  "onbeforeunload",
  "onblur",
  "oncanplay",
  "oncanplaythrough",
  "onchange",
  "onclick",
  "onclose",
  "oncontextmenu",
  "oncopy",
  "oncuechange",
  "oncut",
  "ondblclick",
  "ondrag",
  "ondragend",
  "ondragenter",
  "ondragexit",
  "ondragleave",
  "ondragover",
  "ondragstart",
  "ondrop",
  "ondurationchange",
  "onemptied",
  "onended",
  "onerror",
  "onfocus",
  "onformdata",
  "onfullscreenchange",
  "onfullscreenerror",
  "ongamepadconnected",
  "ongamepaddisconnected",
  "ongotpointercapture",
  "onhashchange",
  "oninput",
  "oninvalid",
  "onkeydown",
  "onkeypress",
  "onkeyup",
  "onlanguagechange",
  "onload",
  "onloadeddata",
  "onloadedmetadata",
  "onloadend",
  "onloadstart",
  "onlostpointercapture",
  "onmessage",
  "onmessageerror",
  "onmousedown",
  "onmouseenter",
  "onmouseleave",
  "onmousemove",
  "onmouseout",
  "onmouseover",
  "onmouseup",
  "onoffline",
  "ononline",
  "onpagehide",
  "onpageshow",
  "onpaste",
  "onpause",
  "onplay",
  "onplaying",
  "onpointercancel",
  "onpointerdown",
  "onpointerenter",
  "onpointerleave",
  "onpointermove",
  "onpointerout",
  "onpointerover",
  "onpointerup",
  "onpopstate",
  "onprogress",
  "onratechange",
  "onrejectionhandled",
  "onreset",
  "onresize",
  "onscroll",
  "onseeked",
  "onseeking",
  "onselect",
  "onselectionchange",
  "onselectstart",
  "onstalled",
  "onstorage",
  "onsubmit",
  "onsuspend",
  "ontimeupdate",
  "ontoggle",
  "ontransitioncancel",
  "ontransitionend",
  "ontransitionrun",
  "ontransitionstart",
  "onunhandledrejection",
  "onunload",
  "onvolumechange",
  "onwaiting",
  "onwheel",
];

// Most of these are IDL.
// There's some value to having the attr change
// without changing the IDL. ie value.
// dom should garner most focus
// attr should be secondary.
// i'd be curious to see which
// attrs don't exist in IDL
const attr = {
  accept: accessor.String("accept"),
  accesskey: accessor.String("accesskey"),
  action: accessor.String("action"),
  align: accessor.String("align"),
  allow: accessor.String("allow"),
  allowfullscreen: accessor.Boolean("allowfullscreen"),
  allowpaymentrequest: accessor.Boolean("allowpaymentrequest"),
  alt: accessor.String("alt"),
  async: accessor.Boolean("async"),
  autocapitalize: accessor.String("autocapitalize"),
  autocomplete: accessor.String("autocomplete"),
  autofocus: accessor.Boolean("autofocus"),
  autoplay: accessor.Boolean("autoplay"),
  background: accessor.String("background"),
  bgcolor: accessor.String("bgcolor"),
  border: accessor.String("border"),
  buffered: accessor.String("buffered"),
  capture: accessor.String("capture"),
  challenge: accessor.String("challenge"),
  acceptCharset: accessor.String("accept-charset"),
  charset: accessor.String("charset"),
  checked: accessor.Boolean("checked"),
  cite: accessor.String("cite"),
  class: accessor.String("class"),
  code: accessor.String("code"),
  codebase: accessor.String("codebase"),
  color: accessor.String("color"),
  cols: accessor.String("cols"),
  colspan: accessor.String("colspan"),
  content: accessor.String("content"),
  contenteditable: accessor.ContentEditable,
  contextmenu: accessor.String("contextmenu"),
  controls: accessor.Boolean("controls"),
  coords: accessor.String("coords"),
  crossorigin: accessor.String("crossorigin"),
  csp: accessor.String("csp"),
  data: accessor.Object("dataset"),
  datetime: accessor.String("datetime"),
  decoding: accessor.String("decoding"),
  default: accessor.Boolean("default"),
  defer: accessor.Boolean("defer"),
  dir: accessor.String("dir"),
  dirname: accessor.String("dirname"),
  disabled: accessor.Boolean("disabled"),
  download: accessor.String("download"),
  draggable: accessor.String("draggable"),
  enctype: accessor.String("enctype"),
  enterkeyhint: accessor.String("enterkeyhint"),
  httpEquiv: accessor.String("http-equiv"),
  for: accessor.String("for"),
  form: accessor.String("form"),
  formaction: accessor.String("formaction"),
  formenctype: accessor.String("formenctype"),
  formmethod: accessor.String("formmethod"),
  formnovalidate: accessor.Boolean("formnovalidate"),
  formtarget: accessor.String("formtarget"),
  headers: accessor.String("headers"),
  height: accessor.String("height"),
  hidden: accessor.Boolean("hidden"),
  high: accessor.String("high"),
  href: accessor.String("href"),
  hreflang: accessor.String("hreflang"),
  icon: accessor.String("icon"),
  id: accessor.String("id"),
  importance: accessor.String("importance"),
  inputmode: accessor.String("inputmode"),
  integrity: accessor.String("integrity"),
  intrinsicsize: accessor.String("intrinsicsize"),
  ismap: accessor.Boolean("ismap"),
  itemid: accessor.String("itemid"),
  itemprop: accessor.String("itemprop"),
  itemref: accessor.String("itemref"),
  itemtype: accessor.String("itemtype"),
  itemscope: accessor.Boolean("itemscope"),
  keytype: accessor.String("keytype"),
  kind: accessor.String("kind"),
  label: accessor.String("label"),
  lang: accessor.String("lang"),
  language: accessor.String("language"),
  list: accessor.String("list"),
  loading: accessor.String("loading"),
  loop: accessor.Boolean("loop"),
  low: accessor.String("low"),
  manifest: accessor.String("manifest"),
  max: accessor.String("max"),
  maxlength: accessor.String("maxlength"),
  media: accessor.String("media"),
  method: accessor.String("method"),
  min: accessor.String("min"),
  minlength: accessor.String("minlength"),
  multiple: accessor.Boolean("multiple"),
  muted: accessor.Boolean("muted"),
  name: accessor.String("name"),
  nomodule: accessor.Boolean("nomodule"),
  novalidate: accessor.Boolean("novalidate"),
  open: accessor.Boolean("open"),
  optimum: accessor.String("optimum"),
  pattern: accessor.String("pattern"),
  ping: accessor.String("ping"),
  placeholder: accessor.String("placeholder"),
  playsinline: accessor.Boolean("playsinline"),
  poster: accessor.String("poster"),
  preload: accessor.String("preload"),
  radiogroup: accessor.String("radiogroup"),
  readonly: accessor.Boolean("readonly"),
  referrerpolicy: accessor.String("referrerpolicy"),
  rel: accessor.String("rel"),
  required: accessor.Boolean("required"),
  reversed: accessor.Boolean("reversed"),
  rows: accessor.String("rows"),
  rowspan: accessor.String("rowspan"),
  sandbox: accessor.String("sandbox"),
  scope: accessor.String("scope"),
  scoped: accessor.String("scoped"),
  selected: accessor.Boolean("selected"),
  shape: accessor.String("shape"),
  size: accessor.String("size"),
  sizes: accessor.String("sizes"),
  slot: accessor.String("slot"),
  span: accessor.String("span"),
  spellcheck: accessor.String("spellcheck"),
  src: accessor.String("src"),
  srcdoc: accessor.String("srcdoc"),
  srclang: accessor.String("srclang"),
  srcset: accessor.String("srcset"),
  start: accessor.String("start"),
  step: accessor.String("step"),
  style: accessor.String("style"),
  summary: accessor.String("summary"),
  tabindex: accessor.String("tabindex"),
  target: accessor.String("target"),
  title: accessor.String("title"),
  translate: accessor.String("translate"),
  truespeed: accessor.Boolean("truespeed"),
  type: accessor.String("type"),
  usemap: accessor.String("usemap"),
  value: accessor.Value("value"),
  width: accessor.String("width"),
  wrap: accessor.String("wrap"),
};

export { aria, dom, events, window, attr, accessor };
