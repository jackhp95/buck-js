var E=(n=[])=>{let s=(...e)=>console.warn(...e),t=new Map(n);return{clear:()=>t.clear(),delete:e=>{if(t.has(e)){let r=t.get(e);return r.forEach(c=>{let u=t.get(c);u.delete(e),u.size||t.delete(c)}),t.delete(e),r}},remove:e=>r=>{if(t.has(e)){let c=t.get(e);c.delete(r),c.size||t.delete(e)}if(t.has(r)){let c=t.get(r);c.delete(e),c.size||t.delete(r)}},size:()=>t.size,has:e=>{if(t.has(e)){let r=t.get(e);return c=>new Set(r).has(c)}return!1},get:e=>t.has(e)?new Set(t.get(e)):void 0,set:e=>r=>{t.has(e)?t.get(e).add(r):t.set(e,new Set([r])),t.has(r)?t.get(r).add(e):t.set(r,new Set([e]))},nodes:()=>new Set(t.keys()),edges:()=>{let e=[];return t.forEach((r,c)=>r.forEach(u=>e.push([c,u]))),e},tidy:()=>{t.entries().map(([e,r])=>{loop(c=>{t.has(c)?t.get(c).has(e)||s("non-bidirectional | exists in set, not in map: ",e):s("non-bidirectional | exists in map, not in set: ",c)})(r)})}}};var i=n=>s=>{for(let t of s)n(t)},G=n=>(console.log(n),n),m=(n,s=document)=>s.querySelectorAll(n),z=(n,s=document)=>s.querySelector(n),b=n=>n.tagName?n:n.parentElement,w=(n,...s)=>n(...s),T=()=>{},F=(n,s=T)=>(...t)=>{try{return n(...t)}catch(e){return s(e,...t)}},L=(n,s)=>async(...t)=>{let e=s||n.name;performance.mark("a");let r=typeof n?.then=="function"?await n(...t):n(...t);return performance.mark("b"),performance.measure(e,"a","b"),i(console.log)(performance.getEntriesByName(e,"measure")),r},R=(n,s)=>{if(n===s)return 0;var t=n.compareDocumentPosition(s);return t&Node.DOCUMENT_POSITION_FOLLOWING||t&Node.DOCUMENT_POSITION_CONTAINED_BY?-1:t&Node.DOCUMENT_POSITION_PRECEDING||t&Node.DOCUMENT_POSITION_CONTAINS?1:0},I=n=>("sort"in n?n:[...n]).sort(R),k=(...n)=>{let[s,t,e]=n;return{1:()=>{let r={};return i(c=>{r[c.name]=c.value})(s.attributes),r},2:()=>s.getAttribute(t),3:()=>s.setAttribute(t,e)}[n.length]()},A=(n,...s)=>(t,...e)=>{if(!(n in t)){let r=Function(...s,t.getAttribute(n)).bind(t);t[n]=r}return t[n](...e)},B=(n,s)=>t=>(n in t||(t[n]=Function("maybe","obj",`return maybe(() => obj${path.startsWith(/\.\[/)?path:"."+path});`)(F,s)),t[n]),H={event:n=>s=>A(n,"event")(s.target,s),entry:n=>s=>A(n,"entry")(s.target,s),js:A,resolve:B},W=Object.assign(k,H);var V=async n=>{let s={root:n.root||document,scheduleInit:n.scheduleInit||(o=>addEventListener("DOMContentLoaded",o,{once:!0})),scheduleQueue:n.scheduleQueue||(o=>o())},t={attributes:!0,attributeOldValue:!0,childList:!0,subtree:!0},e={graph:E(),match:new Set,query:new Set,queue:new Set,after:new Set,plugins:new Set(n.plugins||[]),allSelect:""},r=()=>{e.allSelect=[...e.plugins].map(o=>o.select).join()},c=()=>{e.match.clear(),e.query.clear(),e.queue.clear(),e.after.clear()},u=o=>()=>{o.isConnected||(i(a=>e.graph.delete(a))(m("*",o)),e.graph.delete(o))},f=o=>{let a=e.graph.get(o);!a||(i(p=>p.update(o))(a),e.after.add(u(o)))},l=({parentElement:o})=>{!o||e.queue.has(o)||(l(o),e.graph.has(o)&&e.queue.add(o))},g=o=>a=>{let p=o.matches(a.select),d=e.graph.has(a,o);d!==p&&(p?e.graph.set(a)(o):e.after.add(()=>{e.graph.remove(a)(o)})),(d||p)&&e.queue.add(o)},S=o=>[...e.plugins].map(g(o)),N=o=>{(o.matches(e.allSelect)||e.graph.has(o))&&e.match.add(o),i(a=>e.match.add(a))(m(e.allSelect,o)),i(a=>e.graph.has(a)&&e.match.add(a))(m("*",o))},j=()=>{i(N)(e.query),i(S)(e.match),i(l)(e.queue),i(f)(I(e.queue)),i(w)(e.after),c()},M=i(o=>{let a=b(o);a&&e.query.add(a)}),D=o=>{o.type==="attributes"&&(e.match.add(b(o.target)),o.attributeName in Object.getPrototypeOf(o.target)||delete o.target[attributeName]),o.addedNodes.length&&M(o.addedNodes),o.removedNodes.length&&M(o.removedNodes),e.match.add(b(o.target))},v=o=>{!e.allSelect||(i(D)(o),s.scheduleQueue(j))},x=new MutationObserver(v),_=o=>a=>{e.graph.set(o)(a),o.update(a)},q=o=>o.select&&i(_(o))(m(o.select,s.root)),Q=()=>{let p=Object.assign(d=>[...e.graph.get(d)],{add:d=>{e.plugins.add(d),q(d)},clear:()=>{c(),e.graph.clear()},delete:d=>{e.plugins.delete(d),e.graph.delete(d)},has:d=>e.graph.has(d)});return n.debug?Object.assign(p,{debug:e}):p},U=async o=>{i(q)(e.plugins),r(),x.observe(s.root,t),o(Q())};return new Promise(o=>s.scheduleInit(()=>U(o)))};var O=(n,s)=>new Proxy(n,{get:(t,e)=>s[e].bind(s),apply:function(t,e,r){return n(...r)}}),y=new Map;function C(n){y.has(n)||y.set(n,new Map);let s=y.get(n);return O(e=>{s.has(e)||s.set(e,new Map);let r=s.get(e);return O((u,f)=>{let l=y.get(e),g=(...S)=>{let N=l.has(u)?f(l.get(u),S):S;l.set(u,N)};return n(e,l),O(g,l)},r)},s)}var Y=(n,s)=>n(()=>{let t=([e,r])=>e(...r);s.entries().forEach(t),s.clear()}),$=C(Y),P=(n,s)=>{n(()=>{let[t,e]=s.entries().next().value;t(...e),s.delete(t),P(n,s)})},J=C(P),h=n=>s=>{let t={fn:s,canceled:!1};return t.cancel=()=>t.canceled=!0,t.throttler=e=>{t.throttle=()=>{t.throttled||(e(()=>t.throttled=!1)(),t.throttled=!0)}},function(...e){t.args=e,t.debounce&&(t.debounce=Date.now()),t.callback=()=>t.fn(...t.args);let r=(f,l)=>[t.canceled,t.throttled,t.debounce&&t.debounce!==f,()=>l(t.callback())].find(g=>g),c=f=>l=>{let g=[r(f,l),t];g.length=n.length,n(...g)};t.throttle&&t.throttle();let u=new Promise(c(t.debounce));return O(this,Object.assign(u,t))}},K=h(n=>n),X=h(queueMicrotask),Z=h(setTimeout),ee=h(requestAnimationFrame),te=h(n=>requestAnimationFrame(()=>requestAnimationFrame(n))),ne=h(requestIdleCallback),oe=(n=0)=>h(s=>setTimeout(s,n)),se=h((n,s)=>{n(),s.cancel()});export{E as Graph,z as QS,m as QSA,b as asEl,W as attr,$ as batch,O as extendFunction,ne as idle,w as invoke,G as log,i as loop,F as maybe,te as next,T as noop,V as onDom,se as once,h as orca,L as perf,J as recur,I as sortEls,K as sync,Z as task,X as then,ee as tick,oe as wait};
//# sourceMappingURL=index.js.map
