// CACHING INTERNALS (essentially thunks)
const buildBatch = (state) => (mode) => {
  const { plugins } = state;
  const { loop } = util;
  const modeFilter = (p) =>
    (!p.media || matchMedia(p.media)) &&
    (mode === "select" ? p.select : p[mode] && [p.select, p[mode]]);
  state.batch[mode] = loop(modeFilter)([...plugins], { filter: true });
};

const build_matchThunk = (plugin) => {
  if (plugin.thunk[matchThunk]) return;
  const { select } = plugin;
  const matchesElement = ({ elem }) => elem.matches(select);
  const matchesOldClass = ({ attr }) =>
    attr.class.find((className) =>
      className.split(" ").find((_class) => select.contains(_class))
    );
  const matchesOldId = ({ attr }) => select.contains(attr.id);
  const oldMatchers = [
    select.contains(".") && matchesOldClass,
    select.contains("#") && matchesOldId,
  ].filter(identity);
  const matcher = oldMatchers.length
    ? (...a) => [matchesElement, ...oldMatchers].find((fn) => fn(...a))
    : matchesElement;
  // set buildMatch
  plugin.thunk[matchThunk] = matcher;
};
const declareMedia = (plugin) => (cb) => {
  if (cb.matches === plugin.thunk.mediaMatches) {
    // build the plugin matcher if the media plugin.matches
    cb.matches && build_matchThunk(plugin);
    // if thunk has been built, init or stop the plugin
    plugin.thunk[matchThunk] && plugin[cb.matches ? "init" : "stop"]?.();
  }
  return plugin;
};
const build_mediaThunk = (plugin) => {
  const mediaQueryList = window.matchMedia(plugin.media);
  plugin.thunk.mediaMatches = mediaQueryList.matches;
  declareMedia(plugin)(mediaQueryList);
  mediaQueryList.addEventListener("change", declareMedia(plugin));
  return plugin;
};
const pluginThunker = (plugin) => {
  if (plugin.thunk) return;
  plugin.thunk = {};
  // if no media arg is provided, just build the matcher
  (plugin.media ? build_mediaThunk : build_matchThunk)(plugin);
};

const roster = (config) => {
  const thunkedPlugins = loop(pluginThunker)(config.plugins);
  pluginMap;
  const proxyMap = { get(target, prop, receiver) {} };
  return {
    add() {},
    remove() {},
    entries() {},
  };
};

// matches fails to work on removed attrs because it tries to match before running the plugin and because the attr was removed, the fn is never called. if select contains attributeName between [], (check oldVal too if select contains an unescaped . or #), call the fn, despite it not techincally matching any more.
// a lot of this could be thunked and done on plugin hookup.
// check if a selector contains [attr], .class, or #id and then if it doesn't you can skip testing for those oldValues or attributeNames right now I'm doing all three on the microtask, if I can determine on init, that I don't need to check all 3, I can save some compute.
const attrShorthandRegex = /^(class|id)$/i;
const matchRemovedAttributes = (sel, attrs) =>
  Object.entries(attrs).find(
    ([a, v]) =>
      // checks if old id or class is in the selector
      (attrShorthandRegex.test(a) && sel.indexOf(v) !== -1) ||
      // checks if the old attribute is in the selector
      sel.indexOf(a) !== -1
  );

const applyOnMatch =
  ([select, fn]) =>
  (el, details, ...rest) =>
    (el?.matches?.(select) ||
      (details.attributes &&
        matchRemovedAttributes(select, details.attributes))) &&
    fn(el, details, ...rest);

const buildApply = (state) => (mode) => {
  const { batch } = state;
  const { loop } = util;
  const modeFns = batch[mode].map(applyOnMatch);
  state.apply[mode] = (...args) => loop((fn) => fn(...args))(modeFns);
};

// main cache refresh
const buildCaches = (state) => {
  const TIMING_MODES = ["render", "capture", "passive"];

  state.batch = {};
  ["select", ...TIMING_MODES].forEach(buildBatch(state));

  state.select = state.batch.select?.join(", ") || "*";

  state.apply = {};
  TIMING_MODES.forEach(buildApply(state));
};

// RUNTIME
const runtime = (config = {}) => {
  const { QSA, loop, asEl, oncePerFrame, oncePerIdle, upsertMap } = util;
  // incrementally build state to allow state to be it's own input
  const state = {};
  (state.plugins = new Set(config.plugins || [])),
    (state.root = config.root || document),
    (state.MutationObserverConfig = {
      attributes: true,
      attributeOldValue: true,
      childList: true,
      subtree: true,
    });
  // refreshes when plugin is changed
  buildCaches(state);

  const map = {
    // called immediately
    capture: new Map(),
    // called on frame
    render: new Map(),
    // non-blocking and called on idle
    passive: new Map(),
  };
  map.upsert = (v) => (k) => {
    upsertMap(map.capture)(v)(k);
    upsertMap(map.render)(v)(k);
    upsertMap(map.passive)(v)(k);
  };

  // allows function to only be declared once
  const __upsertRemovedNodeChanges = (upsert) => (node) => {
    const el = util.asEl(node);
    if (!el) return;
    // removed element matches
    el.matches(state.batch.select) && upsert({ detached: true })(el);
    // removed element children match
    loop(map.upsert({ detached: true }))(QSA(state.batch.select, el));
  };
  const __upsertAddedNodeChanges = (upsert) => (node) => {
    const el = util.asEl(node);
    if (!el) return;
    // added element matches
    el.matches(state.batch.select) && upsert({ attached: true })(el);
    // added element children match
    loop(map.upsert({ attached: true }))(QSA(state.batch.select, el));
  };
  const captureDomChanges = (mr) => {
    const target = asEl(mr.target);
    target.matches(state.batch.select) && map.upsert({ target: true })(target);
    // collect the target if it's relevant
    mr.attributeName &&
      map.upsert({ attributes: { [mr.attributeName]: mr.oldValue } })(target);
    // collect relevant addedElements
    mr.addedNodes.length &&
      loop(__upsertAddedNodeChanges(map.upsert))(mr.addedNodes);
    // collect relevant removedElements
    mr.removedNodes.length &&
      loop(__upsertRemovedNodeChanges(map.upsert))(mr.removedNodes);
    // This function is basically where the {details} are designed. There are a bunch of things you COULD do here. However, this function should _really_ be reserved for essential mutation info gathering. Then use your callbacks to take this info, and do whatever you'd need. Extending this function could be useful in rare situations, so I think I may expose this? or at least provide a method to modify it. After moving capture calls out of this function, you're unable to access the mutationRecord. Which may be a problem. unlikely, but possible. Extending this would allow you to access mutRec
  };

  const applyDomChangesCapture = () => {
    map.capture.forEach((details, el) => state.apply.capture(el, details));
    map.capture.clear();
  };
  // this const ensures oncePerFrame is only defined once so the debouncing works right.
  const applyDomChangesOnFrame = oncePerFrame(() => {
    map.render.forEach((details, el) => state.apply.render(el, details));
    map.render.clear();
  });
  const applyDomChangesOnIdle = oncePerIdle(() => {
    map.passive.forEach((details, el) => state.apply.passive(el, details));
    map.passive.clear();
  });
  const queueApplies = () => {
    // run capture events immediately.
    map.capture.size && applyDomChangesCapture();
    // queues the regular events to run on frame.
    map.render.size && applyDomChangesOnFrame();
    // queues the regular events to run on idle cpu time.
    map.passive.size && applyDomChangesOnIdle();
  };
  // this recieves mutation records, transforms and filters them, then queues non-capture events
  const onMutationRecords = (mrs) => {
    // finds relevant elements and runs capture events
    loop((mr) => requestIdleCallback(() => captureDomChanges(mr)))(mrs);
    // console.log(mrs);
    requestIdleCallback(() => queueApplies());
  };

  // API
  const observer = new MutationObserver((mrs) =>
    requestIdleCallback(() => onMutationRecords(mrs))
  );

  // initialization is important.
  // perhaps this needs to be better considered
  // things like adding a plugin ARE important
  // this will require more thoughtful consideration of how to say:
  // hey! initialize THESE plugins!
  const initialize = () => {
    loop(map.upsert({ attached: true, initial: true }))(
      QSA(state.batch.select, state.root)
    );
    queueApplies();
    observer.observe(state.root, state.MutationObserverConfig);
  };
  state.eager ? initialize() : addEventListener("DOMContentLoaded", initialize);

  return {
    observer,
    stop: () => observer.disconnect(),
    // essentially, I want to proxy the PluginSet to reset the cache when changed.
    has: () => {},
    add: () => {},
    remove: () => {},
    clear: () => {},
  };
};
