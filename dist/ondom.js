var S=(a=[])=>{let c=(...e)=>console.warn(...e),s=new Map(a);return{clear:()=>s.clear(),delete:e=>{if(s.has(e)){let n=s.get(e);return n.forEach(r=>{let u=s.get(r);u.delete(e),u.size||s.delete(r)}),s.delete(e),n}},remove:e=>n=>{if(s.has(e)){let r=s.get(e);r.delete(n),r.size||s.delete(e)}if(s.has(n)){let r=s.get(n);r.delete(e),r.size||s.delete(n)}},size:()=>s.size,has:e=>{if(s.has(e)){let n=s.get(e);return r=>new Set(n).has(r)}return!1},get:e=>s.has(e)?new Set(s.get(e)):void 0,set:e=>n=>{s.has(e)?s.get(e).add(n):s.set(e,new Set([n])),s.has(n)?s.get(n).add(e):s.set(n,new Set([e]))},nodes:()=>new Set(s.keys()),edges:()=>{let e=new Map;return s.forEach(([n,r])=>r.forEach(u=>e.set(n,u))),e},tidy:()=>{s.entries().map(([e,n])=>{loop(r=>{s.has(r)?s.get(r).has(e)||c("non-bidirectional | exists in set, not in map: ",e):c("non-bidirectional | exists in map, not in set: ",r)})(n)})}}};var d=a=>c=>{for(let s of c)a(s)};var l=(a,c=document)=>c.querySelectorAll(a),g=a=>a.tagName?a:a.parentElement,O=(a,...c)=>a(...c),D=(a,c)=>{if(a===c)return 0;var s=a.compareDocumentPosition(c);return s&Node.DOCUMENT_POSITION_FOLLOWING||s&Node.DOCUMENT_POSITION_CONTAINED_BY?-1:s&Node.DOCUMENT_POSITION_PRECEDING||s&Node.DOCUMENT_POSITION_CONTAINS?1:0},E=a=>("sort"in a?a:[...a]).sort(D);var G=a=>{let c={root:a.root||document,scheduleInit:a.scheduleInit||(t=>addEventListener("DOMContentLoaded",t,{once:!0})),scheduleQueue:a.scheduleQueue||(t=>t())},s={attributes:!0,attributeOldValue:!0,childList:!0,subtree:!0},e={graph:S(),match:new Set,query:new Set,queue:new Set,after:new Set,plugins:new Set(a.plugins||[]),active:new Set,allSelect:"*"},n=t=>{let o;t.media&&(o=matchMedia(t.media));let i=h=>{h.matches?(e.active.add(t),p(t)):e.graph.has(t)&&(e.graph.get(t).forEach(t.update),e.graph.delete(t),e.active.delete(t))};o?(i(o),o.addEventListener("changes",i)):(e.active.add(t),p(t))},r=()=>{e.allSelect=[...e.active].map(t=>t.select).join()},u=()=>{e.match.clear(),e.query.clear(),e.queue.clear(),e.after.clear()},I=t=>()=>{t.isConnected||(d(o=>e.graph.delete(o))(l("*",t)),e.graph.delete(t))},v=t=>{if(!e.graph.has(t))return console.log(t,"doesn't have a plugin");let o=e.graph.get(t);d(i=>i.update(t))(o),e.after.add(I(t))},f=({parentElement:t})=>{!t||e.queue.has(t)||(f(t),e.graph.has(t)&&e.queue.add(t))},b=t=>o=>{let i=t.matches(o.select),h=e.graph.has(o,t);h!==i&&(i?e.graph.set(o)(t):e.after.add(()=>{e.graph.remove(o)(t)})),(h||i)&&e.queue.add(t)},w=t=>[...e.active].map(b(t)),M=t=>{(t.matches(e.allSelect)||e.graph.has(t))&&e.match.add(t),d(o=>e.match.add(o))(l(e.allSelect,t)),d(o=>e.graph.has(o)&&e.match.add(o))(l("*",t))},T=()=>{d(M)(e.query),d(w)(e.match),d(f)(e.queue),d(v)(E(e.queue)),d(O)(e.after),u()},m=d(t=>{let o=g(t);o&&e.query.add(o)}),q=t=>{t.type==="attributes"&&e.match.add(g(t.target)),t.addedNodes.length&&m(t.addedNodes),t.removedNodes.length&&m(t.removedNodes),e.match.add(g(t.target))},C=t=>{d(q)(t),c.scheduleQueue(T)},y=new MutationObserver(C),A=t=>o=>{e.graph.set(t)(o),t.update(o)},p=t=>{r(),d(A(t))(l(t.select,c.root))};c.scheduleInit(()=>{e.plugins.forEach(n),y.observe(c.root,s)});let N=Object.assign(t=>[...e.graph.get(t)],{add:t=>{e.plugins.add(t),n(t)},clear:()=>{u(),e.graph.clear()},delete:t=>{e.plugins.delete(t),e.graph.delete(t)},has:t=>e.graph.has(t),active:()=>[...e.active]});return a.debug?Object.assign(N,{debug:e}):N};export{G as onDom};
//# sourceMappingURL=ondom.js.map