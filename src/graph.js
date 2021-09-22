const Graph = (entries = []) => {
  const err = (...xs) => console.warn(...xs);
  const g = new Map(entries);
  return {
    clear: () => g.clear(),
    delete: (k) => {
      if (g.has(k)) {
        const vs = g.get(k);
        vs.forEach((v) => {
          const ks = g.get(v);
          ks.delete(k);
          if (!ks.size) {
            g.delete(v);
          }
        });
        g.delete(k);
        return vs;
      }
    },
    remove: (k) => (v) => {
      if (g.has(k)) {
        const vs = g.get(k);
        vs.delete(v);
        if (!vs.size) {
          g.delete(k);
        }
      }
      if (g.has(v)) {
        const ks = g.get(v);
        ks.delete(k);
        if (!ks.size) {
          g.delete(v);
        }
      }
    },
    size: () => g.size,
    has: (k) => {
      if (g.has(k)) {
        const vs = g.get(k);
        // functions are truthy,
        // this allows us to have optional edge checking via closure.
        return (v) => new Set(vs).has(v);
      }
      return false;
    },
    // spread operator prevents mutation to graph internals
    get: (x) => (g.has(x) ? new Set(g.get(x)) : undefined),
    set: (k) => (v) => {
      if (g.has(k)) {
        g.get(k).add(v);
      } else {
        g.set(k, new Set([v]));
      }
      if (g.has(v)) {
        g.get(v).add(k);
      } else {
        g.set(v, new Set([k]));
      }
    },
    nodes: () => new Set(g.keys()),
    edges: () => {
      const e = new Map();
      g.forEach(([k, vs]) => vs.forEach((v) => e.set(k, v)));
      return e;
    },
    tidy: () => {
      g.entries().map(([k, vs]) => {
        loop((v) => {
          if (g.has(v)) {
            if (!g.get(v).has(k)) {
              err("non-bidirectional | exists in set, not in map: ", k);
            }
          } else {
            err("non-bidirectional | exists in map, not in set: ", v);
          }
        })(vs);
      });
    },
  };
};

export { Graph };
