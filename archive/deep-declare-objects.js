// I need to find a way to undefine the preceeding GETS, IF SET is never called. 
// It's tricky to find HOW to do that. If I figure that out, I can build objects WITHOUT
// Needing Nullish coalesing which will make it much nicer to build deep objects. 

// Right now calling a bunch of non-existing paths will return an empty proxy, 
// instead of undefined, which it should be doing.


const PROX_FLAG = "___PROX_FLAG___";
const handler = {
  get(o, k, r) {
    console.log("GET", k)
    if ([PROX_FLAG, "toJSON"].includes(k)) return true;
    if (o[k] === undefined) return (o[k] = new Proxy({}, handler));
    if (o[PROX_FLAG]) return (o[k] = new Proxy(o[k], handler));
    return o[k];
  },
  set(o, k, v, r) {
    console.log("SET", k, v)
    if (k === PROX_FLAG) return false;
    if (v === undefined) {
      delete o[k];
      return true;
    }
    if (o[k] !== v) o[k] = v;
    return true;
  }
};
const prox = new Proxy({}, handler);

prox.foo.bar.baz = "Hello World";
console.log(prox.foo.bar.baz);

prox.foo.bar.baz = undefined;
console.log(JSON.stringify(prox));
