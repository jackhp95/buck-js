import { Graph } from "./graph.js";
import { log, loop, QSA, asEl, sortEls, invoke } from "./utils.js";

const onDom = (c) => {
  // STATE
  const config = {
    root: c.root || document,
    scheduleInit:
      c.scheduleInit ||
      ((fn) =>
        addEventListener("DOMContentLoaded", fn, {
          once: true,
        })),
    scheduleQueue: c.scheduleQueue || ((fn) => fn()),
  };
  const observerConfig = {
    attributes: true,
    attributeOldValue: true,
    childList: true,
    subtree: true,
  };
  const state = {
    // state
    graph: Graph(), // all known relevant elements
    match: new Set(), // needs to rematch plugins because element moved/mutated
    query: new Set(), // needs to query
    queue: new Set(), // contents updated
    after: new Set(), // contents updated
    plugins: new Set(c.plugins || []),
    active: new Set(),
    allSelect: "*",
  };
  // SETUP
  const maybeActivatePlugin = (p) => {
    let init;
    if (p.media) {
      init = matchMedia(p.media);
    }
    const checkRelevance = (when) => {
      if (when.matches) {
        state.active.add(p);
        initPlugin(p);
      } else {
        if (state.graph.has(p)) {
          state.graph.get(p).forEach(p.update);
          state.graph.delete(p);
          state.active.delete(p);
        }
      }
    };
    if (init) {
      checkRelevance(init);
      // ideally, this would be responsive.
      // yet it isn't, and I don't wanna debug tonight.
      init.addEventListener("changes", checkRelevance);
    } else {
      state.active.add(p);
      initPlugin(p);
    }
  };
  const refreshAllSelect = () => {
    state.allSelect = [...state.active].map((p) => p.select).join();
  };
  const clearRuntime = () => {
    state.match.clear();
    state.query.clear();
    state.queue.clear();
    state.after.clear();
  };
  const deleteFromGraph = (el) => () => {
    if (!el.isConnected) {
      loop((x) => state.graph.delete(x))(QSA("*", el));
      state.graph.delete(el);
    }
  };
  const runUpdate = (el) => {
    if (!state.graph.has(el)) return console.log(el, "doesn't have a plugin");
    const plugins = state.graph.get(el);
    loop((p) => p.update(el))(plugins);
    // remove element from graph if it doesn't exist after the update.
    state.after.add(deleteFromGraph(el));
  };
  const queueAncestors = ({ parentElement }) => {
    if (!parentElement || state.queue.has(parentElement)) return;
    queueAncestors(parentElement);
    if (state.graph.has(parentElement)) {
      state.queue.add(parentElement);
    }
  };
  const maybeEdge = (el) => (p) => {
    const matches = el.matches(p.select);
    const hasEdge = state.graph.has(p, el);
    if (hasEdge !== matches) {
      matches
        ? state.graph.set(p)(el)
        : // allows non-matching elements to run one last time to clean-up.
          state.after.add(() => {
            state.graph.remove(p)(el);
          });
    }
    if (hasEdge || matches) {
      state.queue.add(el);
    }
  };
  const matchElement = (el) => [...state.active].map(maybeEdge(el));
  const queryElement = (el) => {
    // self matches
    (el.matches(state.allSelect) || state.graph.has(el)) && state.match.add(el);
    // child matches
    // finds current matches
    loop((x) => state.match.add(x))(QSA(state.allSelect, el));
    // finds previous matches
    loop((x) => state.graph.has(x) && state.match.add(x))(QSA("*", el));
  };
  const onQueue = () => {
    loop(queryElement)(state.query);
    loop(matchElement)(state.match);
    loop(queueAncestors)(state.queue);
    loop(runUpdate)(sortEls(state.queue));
    loop(invoke)(state.after);
    clearRuntime();
  };
  const addElementsToQuery = loop((n) => {
    const el = asEl(n);
    el && state.query.add(el);
  });
  const onMutationRecord = (mr) => {
    mr.type === "attributes" && state.match.add(asEl(mr.target));
    mr.addedNodes.length && addElementsToQuery(mr.addedNodes);
    mr.removedNodes.length && addElementsToQuery(mr.removedNodes);
    state.match.add(asEl(mr.target));
  };
  const onMutationRecords = (mrs) => {
    loop(onMutationRecord)(mrs);
    config.scheduleQueue(onQueue);
  };
  const observer = new MutationObserver(onMutationRecords);
  const initElement = (p) => (el) => {
    state.graph.set(p)(el);
    p.update(el);
  };
  const initPlugin = (p) => {
    refreshAllSelect();
    loop(initElement(p))(QSA(p.select, config.root));
  };

  // Initialize
  config.scheduleInit(() => {
    state.plugins.forEach(maybeActivatePlugin);
    observer.observe(config.root, observerConfig);
  });

  // API
  const MAIN_FUNCTION = (x) => state.graph.get(x);
  const METHODS = {
    add: (p) => {
      state.plugins.add(p);
      maybeActivatePlugin(p);
    },
    clear: () => {
      clearRuntime();
      state.graph.clear();
    },
    delete: (p) => {
      state.plugins.delete(p);
      state.graph.delete(p);
    },
    has: (p) => state.graph.has(p),
    active: () => [...state.active],
  };
  const API = Object.assign(MAIN_FUNCTION, METHODS);

  return c.debug ? Object.assign(API, { debug: state }) : API;
};

export { onDom };
