import{r as e,aE as a,aF as t,aG as n,aH as s,aI as r,aJ as i,aK as o,n as l,$ as c,aL as u,aM as d,E as f,D as v,J as m,_ as h,aN as p,aO as x,K as b,q as j,j as g,o as y,B as w,Y as N,Z as E,a0 as R,a1 as C,aP as M,a2 as k,u as V,U as I,V as D}from"./index-CS3RdbcM.js";import{L as T,M as _,m as L}from"./context-BS-D1DHO.js";import{S}from"./separator-DKs0ACiD.js";import"./popover-0By2OF8D.js";import"./useApiRequest-BZsjsfZc.js";var $=function(){return function(){var t=this;this.subscriptions=new Set,this.emit=function(e){var n,s;try{for(var r=a(t.subscriptions),i=r.next();!i.done;i=r.next()){(0,i.value)(e)}}catch(o){n={error:o}}finally{try{i&&!i.done&&(s=r.return)&&s.call(r)}finally{if(n)throw n.error}}},this.useSubscription=function(a){var n=e.useRef();n.current=a,e.useEffect((function(){function e(e){n.current&&n.current(e)}return t.subscriptions.add(e),function(){t.subscriptions.delete(e)}}),[])}}}();var F=function(a,s,r){void 0===r&&(r={});var i=t(a),o=e.useRef(null),l=e.useCallback((function(){o.current&&clearInterval(o.current)}),[]);return e.useEffect((function(){if(n(s)&&!(s<0))return r.immediate&&i(),o.current=setInterval(i,s),l}),[s,r.immediate]),l};
/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const K=l("RefreshCcw",[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]]),q="Tabs",[A,P]=c(q,[u]),J=u(),[z,B]=A(q),G=e.forwardRef(((a,t)=>{const{__scopeTabs:n,value:s,onValueChange:r,defaultValue:i,orientation:o="horizontal",dir:l,activationMode:c="automatic",...u}=a,p=d(l),[x,b]=f({prop:s,onChange:r,defaultProp:i});return e.createElement(z,{scope:n,baseId:v(),value:x,onValueChange:b,orientation:o,dir:p,activationMode:c},e.createElement(m.div,h({dir:p,"data-orientation":o},u,{ref:t})))}));function H(e,a){return`${e}-trigger-${a}`}function O(e,a){return`${e}-content-${a}`}const U=e.forwardRef(((a,t)=>{const{__scopeTabs:n,loop:s=!0,...r}=a,i=B("TabsList",n),o=J(n);return e.createElement(p,h({asChild:!0},o,{orientation:i.orientation,dir:i.dir,loop:s}),e.createElement(m.div,h({role:"tablist","aria-orientation":i.orientation},r,{ref:t})))})),Y=e.forwardRef(((a,t)=>{const{__scopeTabs:n,value:s,disabled:r=!1,...i}=a,o=B("TabsTrigger",n),l=J(n),c=H(o.baseId,s),u=O(o.baseId,s),d=s===o.value;return e.createElement(x,h({asChild:!0},l,{focusable:!r,active:d}),e.createElement(m.button,h({type:"button",role:"tab","aria-selected":d,"aria-controls":u,"data-state":d?"active":"inactive","data-disabled":r?"":void 0,disabled:r,id:c},i,{ref:t,onMouseDown:b(a.onMouseDown,(e=>{r||0!==e.button||!1!==e.ctrlKey?e.preventDefault():o.onValueChange(s)})),onKeyDown:b(a.onKeyDown,(e=>{[" ","Enter"].includes(e.key)&&o.onValueChange(s)})),onFocus:b(a.onFocus,(()=>{const e="manual"!==o.activationMode;d||r||!e||o.onValueChange(s)}))})))})),Z=e.forwardRef(((a,t)=>{const{__scopeTabs:n,value:s,forceMount:r,children:i,...o}=a,l=B("TabsContent",n),c=H(l.baseId,s),u=O(l.baseId,s),d=s===l.value,f=e.useRef(d);return e.useEffect((()=>{const e=requestAnimationFrame((()=>f.current=!1));return()=>cancelAnimationFrame(e)}),[]),e.createElement(j,{present:r||d},(({present:n})=>e.createElement(m.div,h({"data-state":d?"active":"inactive","data-orientation":l.orientation,role:"tabpanel","aria-labelledby":c,hidden:!n,id:u,tabIndex:0},o,{ref:t,style:{...a.style,animationDuration:f.current?"0s":void 0}}),n&&i)))})),Q=G,W=e.forwardRef((({className:e,...a},t)=>g.jsx(U,{ref:t,className:y("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",e),...a})));W.displayName=U.displayName;const X=e.forwardRef((({className:e,...a},t)=>g.jsx(Y,{ref:t,className:y("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",e),...a})));X.displayName=Y.displayName;function ee(a){const{onRefresh:t}=a,[n,l]=e.useState(10),c=F((()=>{null==t||t()}),1e3*n);e.useEffect((()=>c),[]);const u=function(a){var t=this,n=e.useRef(!1);return e.useCallback((function(){for(var e=[],l=0;l<arguments.length;l++)e[l]=arguments[l];return s(t,void 0,void 0,(function(){return r(this,(function(t){switch(t.label){case 0:if(n.current)return[2];n.current=!0,t.label=1;case 1:return t.trys.push([1,3,4,5]),[4,a.apply(void 0,i([],o(e),!1))];case 2:return[2,t.sent()];case 3:throw t.sent();case 4:return n.current=!1,[7];case 5:return[2]}}))}))}),[a])}((async()=>{await(null==t?void 0:t())}));return g.jsxs("div",{className:"flex flex-row rounded-md border border-input",children:[g.jsx(w,{variant:"outline",className:"border-none",onClick:u,children:g.jsx(K,{className:"h-4 w-4"})}),g.jsx(S,{orientation:"vertical"}),g.jsxs(N,{defaultValue:"10",value:String(n),onValueChange:function(e){l(parseInt(e))},children:[g.jsx(E,{className:"w-[70px] border-none",children:g.jsx(R,{})}),g.jsx(C,{children:g.jsxs(M,{children:[g.jsx(k,{value:"5",children:"5s"}),g.jsx(k,{value:"10",children:"10s"}),g.jsx(k,{value:"30",children:"30s"}),g.jsx(k,{value:"60",children:"1m"}),g.jsx(k,{value:"300",children:"5m"})]})})]})]})}function ae(){const a=V(),[t,n]=e.useState("route"),s=((r=e.useRef()).current||(r.current=new $),r.current);var r;const[i,o]=e.useState({type:"LastDateEnum",lastDataEnum:T.Last30Minute});function l(){s.emit({dateRange:i})}return e.useEffect((()=>{a(t)}),[t]),e.useEffect(l,[i]),g.jsx("div",{className:"flex flex-col w-full h-full",children:g.jsxs(Q,{defaultValue:"route",className:"space-y-4 flex-auto flex flex-col",onValueChange:n,children:[g.jsxs("div",{className:"flex flex-row justify-between",children:[g.jsxs(W,{children:[g.jsx(X,{className:"cursor-pointer",value:"route",children:"路由指标"}),g.jsx(X,{className:"cursor-pointer",value:"server",children:"服务指标"})]}),g.jsxs("div",{className:"flex flex-row space-x-2",children:[g.jsx(_,{value:i,onChange:o}),g.jsx(ee,{onRefresh:l})]})]}),g.jsx(L.Provider,{value:{event$:s,dateRange:i},children:g.jsx(I,{className:"flex-auto overflow-hidden",children:e=>g.jsx("div",{style:{...e},className:"overflow-auto",children:g.jsx(D,{})})})})]})})}e.forwardRef((({className:e,...a},t)=>g.jsx(Z,{ref:t,className:y("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",e),...a}))).displayName=Z.displayName;export{ae as default};
