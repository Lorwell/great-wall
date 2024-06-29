import{n as e,R as t,j as n,o as r,$ as a,p as o,r as i,q as l,_ as s,s as c,v as u,w as d,x as p,y as f,D as h,E as m,G as g,H as y,J as v,K as x,L as b,M as w,N as z,i as k,O as S,P as E,Q as C,B as P,S as I,T as L,U as D,V as N}from"./index-B-kkh-aN.js";import{L as j}from"./layout-panel-left-DMyo0V84.js";import{S as A}from"./separator-gQ0VKvN-.js";
/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=e("CloudCog",[["circle",{cx:"12",cy:"17",r:"3",key:"1spfwm"}],["path",{d:"M4.2 15.1A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2",key:"zaobp"}],["path",{d:"m15.7 18.4-.9-.3",key:"4qxpbn"}],["path",{d:"m9.2 15.9-.9-.3",key:"17q7o2"}],["path",{d:"m10.6 20.7.3-.9",key:"1pf4s2"}],["path",{d:"m13.1 14.2.3-.9",key:"1mnuqm"}],["path",{d:"m13.6 20.7-.4-1",key:"1jpd1m"}],["path",{d:"m10.8 14.3-.4-1",key:"17ugyy"}],["path",{d:"m8.3 18.6 1-.4",key:"s42vdx"}],["path",{d:"m14.7 15.8 1-.4",key:"2wizun"}]]),R=e("GripVertical",[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]]),T=e("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]),$=e("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]),{createElement:H,createContext:O,createRef:_,forwardRef:B,useCallback:F,useContext:G,useEffect:W,useImperativeHandle:q,useLayoutEffect:V,useMemo:J,useRef:K,useState:X}=t,Y=t["useId".toString()],U=V,Q=O(null);
/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */Q.displayName="PanelGroupContext";const Z=U,ee="function"==typeof Y?Y:()=>null;let te=0;function ne(e=null){const t=ee(),n=K(e||t||null);return null===n.current&&(n.current=""+te++),null!=e?e:n.current}function re({children:e,className:t="",collapsedSize:n,collapsible:r,defaultSize:a,forwardedRef:o,id:i,maxSize:l,minSize:s,onCollapse:c,onExpand:u,onResize:d,order:p,style:f,tagName:h="div",...m}){const g=G(Q);if(null===g)throw Error("Panel components must be rendered within a PanelGroup container");const{collapsePanel:y,expandPanel:v,getPanelSize:x,getPanelStyle:b,groupId:w,isPanelCollapsed:z,reevaluatePanelConstraints:k,registerPanel:S,resizePanel:E,unregisterPanel:C}=g,P=ne(i),I=K({callbacks:{onCollapse:c,onExpand:u,onResize:d},constraints:{collapsedSize:n,collapsible:r,defaultSize:a,maxSize:l,minSize:s},id:P,idIsFromProps:void 0!==i,order:p});K({didLogMissingDefaultSizeWarning:!1}),Z((()=>{const{callbacks:e,constraints:t}=I.current,o={...t};I.current.id=P,I.current.idIsFromProps=void 0!==i,I.current.order=p,e.onCollapse=c,e.onExpand=u,e.onResize=d,t.collapsedSize=n,t.collapsible=r,t.defaultSize=a,t.maxSize=l,t.minSize=s,o.collapsedSize===t.collapsedSize&&o.collapsible===t.collapsible&&o.maxSize===t.maxSize&&o.minSize===t.minSize||k(I.current,o)})),Z((()=>{const e=I.current;return S(e),()=>{C(e)}}),[p,P,S,C]),q(o,(()=>({collapse:()=>{y(I.current)},expand:e=>{v(I.current,e)},getId:()=>P,getSize:()=>x(I.current),isCollapsed:()=>z(I.current),isExpanded:()=>!z(I.current),resize:e=>{E(I.current,e)}})),[y,v,x,z,P,E]);const L=b(I.current,a);return H(h,{...m,children:e,className:t,id:i,style:{...L,...f},"data-panel":"","data-panel-collapsible":r||void 0,"data-panel-group-id":w,"data-panel-id":P,"data-panel-size":parseFloat(""+L.flexGrow).toFixed(1)})}const ae=B(((e,t)=>H(re,{...e,forwardedRef:t})));re.displayName="Panel",ae.displayName="forwardRef(Panel)";let oe=null,ie=null;function le(e,t){const n=function(e,t){if(t){const e=!!(t&be),n=!!(t&we);if(t&ve)return e?"se-resize":n?"ne-resize":"e-resize";if(t&xe)return e?"sw-resize":n?"nw-resize":"w-resize";if(e)return"s-resize";if(n)return"n-resize"}switch(e){case"horizontal":return"ew-resize";case"intersection":return"move";case"vertical":return"ns-resize"}}(e,t);oe!==n&&(oe=n,null===ie&&(ie=document.createElement("style"),document.head.appendChild(ie)),ie.innerHTML=`*{cursor: ${n}!important;}`)}function se(e){return"keydown"===e.type}function ce(e){return e.type.startsWith("pointer")}function ue(e){return e.type.startsWith("mouse")}function de(e){if(ce(e)){if(e.isPrimary)return{x:e.clientX,y:e.clientY}}else if(ue(e))return{x:e.clientX,y:e.clientY};return{x:1/0,y:1/0}}const pe=/\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;function fe(e){const t=getComputedStyle(e);return"fixed"===t.position||(!("auto"===t.zIndex||"static"===t.position&&!function(e){var t;const n=getComputedStyle(null!==(t=ye(e))&&void 0!==t?t:e).display;return"flex"===n||"inline-flex"===n}(e))||(+t.opacity<1||("transform"in t&&"none"!==t.transform||("webkitTransform"in t&&"none"!==t.webkitTransform||("mixBlendMode"in t&&"normal"!==t.mixBlendMode||("filter"in t&&"none"!==t.filter||("webkitFilter"in t&&"none"!==t.webkitFilter||("isolation"in t&&"isolate"===t.isolation||(!!pe.test(t.willChange)||"touch"===t.webkitOverflowScrolling)))))))))}function he(e){let t=e.length;for(;t--;){const n=e[t];if(Te(n,"Missing node"),fe(n))return n}return null}function me(e){return e&&Number(getComputedStyle(e).zIndex)||0}function ge(e){const t=[];for(;e;)t.push(e),e=ye(e);return t}function ye(e){const{parentNode:t}=e;return t&&t instanceof ShadowRoot?t.host:t}const ve=1,xe=2,be=4,we=8,ze="coarse"===function(){if("function"==typeof matchMedia)return matchMedia("(pointer:coarse)").matches?"coarse":"fine"}();let ke=[],Se=!1,Ee=new Map,Ce=new Map;const Pe=new Set;function Ie(e){const{target:t}=e,{x:n,y:r}=de(e);Se=!0,Ne({target:t,x:n,y:r}),Me(),ke.length>0&&(Re("down",e),e.preventDefault(),e.stopPropagation())}function Le(e){const{x:t,y:n}=de(e);if(!Se){const{target:r}=e;Ne({target:r,x:t,y:n})}Re("move",e),Ae(),ke.length>0&&e.preventDefault()}function De(e){const{target:t}=e,{x:n,y:r}=de(e);Ce.clear(),Se=!1,ke.length>0&&e.preventDefault(),Re("up",e),Ne({target:t,x:n,y:r}),Ae(),Me()}function Ne({target:e,x:t,y:n}){ke.splice(0);let r=null;e instanceof HTMLElement&&(r=e),Pe.forEach((e=>{const{element:a,hitAreaMargins:o}=e,i=a.getBoundingClientRect(),{bottom:l,left:s,right:c,top:u}=i,d=ze?o.coarse:o.fine;if(t>=s-d&&t<=c+d&&n>=u-d&&n<=l+d){if(null!==r&&a!==r&&!a.contains(r)&&!r.contains(a)&&function(e,t){if(e===t)throw new Error("Cannot compare node with itself");const n={a:ge(e),b:ge(t)};let r;for(;n.a.at(-1)===n.b.at(-1);)e=n.a.pop(),t=n.b.pop(),r=e;Te(r,"Stacking order can only be calculated for elements with a common ancestor");const a=me(he(n.a)),o=me(he(n.b));if(a===o){const e=r.childNodes,t={a:n.a.at(-1),b:n.b.at(-1)};let a=e.length;for(;a--;){const n=e[a];if(n===t.a)return 1;if(n===t.b)return-1}}return Math.sign(a-o)}(r,a)>0){let e=r,t=!1;for(;e&&!e.contains(a);){if(p=e.getBoundingClientRect(),f=i,p.x<f.x+f.width&&p.x+p.width>f.x&&p.y<f.y+f.height&&p.y+p.height>f.y){t=!0;break}e=e.parentElement}if(t)return}ke.push(e)}var p,f}))}function je(e,t){Ce.set(e,t)}function Ae(){let e=!1,t=!1;ke.forEach((n=>{const{direction:r}=n;"horizontal"===r?e=!0:t=!0}));let n=0;Ce.forEach((e=>{n|=e})),e&&t?le("intersection",n):e?le("horizontal",n):t?le("vertical",n):null!==ie&&(document.head.removeChild(ie),oe=null,ie=null)}function Me(){Ee.forEach(((e,t)=>{const{body:n}=t;n.removeEventListener("contextmenu",De),n.removeEventListener("pointerdown",Ie),n.removeEventListener("pointerleave",Le),n.removeEventListener("pointermove",Le)})),window.removeEventListener("pointerup",De),window.removeEventListener("pointercancel",De),Pe.size>0&&(Se?(ke.length>0&&Ee.forEach(((e,t)=>{const{body:n}=t;e>0&&(n.addEventListener("contextmenu",De),n.addEventListener("pointerleave",Le),n.addEventListener("pointermove",Le))})),window.addEventListener("pointerup",De),window.addEventListener("pointercancel",De)):Ee.forEach(((e,t)=>{const{body:n}=t;e>0&&(n.addEventListener("pointerdown",Ie,{capture:!0}),n.addEventListener("pointermove",Le))})))}function Re(e,t){Pe.forEach((n=>{const{setResizeHandlerState:r}=n,a=ke.includes(n);r(e,a,t)}))}function Te(e,t){if(!e)throw Error(t)}const $e=10;function He(e,t,n=$e){return e.toFixed(n)===t.toFixed(n)?0:e>t?1:-1}function Oe(e,t,n=$e){return 0===He(e,t,n)}function _e(e,t,n){return 0===He(e,t,n)}function Be({panelConstraints:e,panelIndex:t,size:n}){const r=e[t];Te(null!=r,`Panel constraints not found for index ${t}`);let{collapsedSize:a=0,collapsible:o,maxSize:i=100,minSize:l=0}=r;if(He(n,l)<0)if(o){n=He(n,(a+l)/2)<0?a:l}else n=l;return n=Math.min(i,n),n=parseFloat(n.toFixed($e))}function Fe({delta:e,initialLayout:t,panelConstraints:n,pivotIndices:r,prevLayout:a,trigger:o}){if(_e(e,0))return t;const i=[...t],[l,s]=r;Te(null!=l,"Invalid first pivot index"),Te(null!=s,"Invalid second pivot index");let c=0;if("keyboard"===o){{const r=e<0?s:l,a=n[r];Te(a,`Panel constraints not found for index ${r}`);const{collapsedSize:o=0,collapsible:i,minSize:c=0}=a;if(i){const n=t[r];if(Te(null!=n,`Previous layout not found for panel index ${r}`),_e(n,o)){const t=c-n;He(t,Math.abs(e))>0&&(e=e<0?0-t:t)}}}{const r=e<0?l:s,a=n[r];Te(a,`No panel constraints found for index ${r}`);const{collapsedSize:o=0,collapsible:i,minSize:c=0}=a;if(i){const n=t[r];if(Te(null!=n,`Previous layout not found for panel index ${r}`),_e(n,c)){const t=n-o;He(t,Math.abs(e))>0&&(e=e<0?0-t:t)}}}}{const r=e<0?1:-1;let a=e<0?s:l,o=0;for(;;){const e=t[a];Te(null!=e,`Previous layout not found for panel index ${a}`);if(o+=Be({panelConstraints:n,panelIndex:a,size:100})-e,a+=r,a<0||a>=n.length)break}const i=Math.min(Math.abs(e),Math.abs(o));e=e<0?0-i:i}{let r=e<0?l:s;for(;r>=0&&r<n.length;){const a=Math.abs(e)-Math.abs(c),o=t[r];Te(null!=o,`Previous layout not found for panel index ${r}`);const l=Be({panelConstraints:n,panelIndex:r,size:o-a});if(!_e(o,l)&&(c+=o-l,i[r]=l,c.toPrecision(3).localeCompare(Math.abs(e).toPrecision(3),void 0,{numeric:!0})>=0))break;e<0?r--:r++}}if(function(e,t,n){if(e.length!==t.length)return!1;for(let r=0;r<e.length;r++)if(!_e(e[r],t[r],n))return!1;return!0}(a,i))return a;{const r=e<0?s:l,a=t[r];Te(null!=a,`Previous layout not found for panel index ${r}`);const o=a+c,u=Be({panelConstraints:n,panelIndex:r,size:o});if(i[r]=u,!_e(u,o)){let t=o-u;let r=e<0?s:l;for(;r>=0&&r<n.length;){const a=i[r];Te(null!=a,`Previous layout not found for panel index ${r}`);const o=Be({panelConstraints:n,panelIndex:r,size:a+t});if(_e(a,o)||(t-=o-a,i[r]=o),_e(t,0))break;e>0?r--:r++}}}return _e(i.reduce(((e,t)=>t+e),0),100)?i:a}function Ge({layout:e,panelsArray:t,pivotIndices:n}){let r=0,a=100,o=0,i=0;const l=n[0];Te(null!=l,"No pivot index found"),t.forEach(((e,t)=>{const{constraints:n}=e,{maxSize:s=100,minSize:c=0}=n;t===l?(r=c,a=s):(o+=c,i+=s)}));return{valueMax:Math.min(a,100-o),valueMin:Math.max(r,100-i),valueNow:e[l]}}function We(e,t=document){return Array.from(t.querySelectorAll(`[data-panel-resize-handle-id][data-panel-group-id="${e}"]`))}function qe(e,t,n=document){const r=We(e,n).findIndex((e=>e.getAttribute("data-panel-resize-handle-id")===t));return null!=r?r:null}function Ve(e,t,n){const r=qe(e,t,n);return null!=r?[r,r+1]:[-1,-1]}function Je(e,t=document){var n;if(t instanceof HTMLElement&&(null==t||null===(n=t.dataset)||void 0===n?void 0:n.panelGroupId)==e)return t;const r=t.querySelector(`[data-panel-group][data-panel-group-id="${e}"]`);return r||null}function Ke(e,t=document){const n=t.querySelector(`[data-panel-resize-handle-id="${e}"]`);return n||null}function Xe({committedValuesRef:e,eagerValuesRef:t,groupId:n,layout:r,panelDataArray:a,panelGroupElement:o,setLayout:i}){K({didWarnAboutMissingResizeHandle:!1}),Z((()=>{if(!o)return;const e=We(n,o);for(let t=0;t<a.length-1;t++){const{valueMax:n,valueMin:o,valueNow:i}=Ge({layout:r,panelsArray:a,pivotIndices:[t,t+1]}),l=e[t];if(null==l);else{const e=a[t];Te(e,`No panel data found for index "${t}"`),l.setAttribute("aria-controls",e.id),l.setAttribute("aria-valuemax",""+Math.round(n)),l.setAttribute("aria-valuemin",""+Math.round(o)),l.setAttribute("aria-valuenow",null!=i?""+Math.round(i):"")}}return()=>{e.forEach(((e,t)=>{e.removeAttribute("aria-controls"),e.removeAttribute("aria-valuemax"),e.removeAttribute("aria-valuemin"),e.removeAttribute("aria-valuenow")}))}}),[n,r,a,o]),W((()=>{if(!o)return;const e=t.current;Te(e,"Eager values not found");const{panelDataArray:a}=e;Te(null!=Je(n,o),`No group found for id "${n}"`);const l=We(n,o);Te(l,`No resize handles found for group id "${n}"`);const s=l.map((e=>{const t=e.getAttribute("data-panel-resize-handle-id");Te(t,"Resize handle element has no handle id attribute");const[l,s]=function(e,t,n,r=document){var a,o,i,l;const s=Ke(t,r),c=We(e,r),u=s?c.indexOf(s):-1;return[null!==(a=null===(o=n[u])||void 0===o?void 0:o.id)&&void 0!==a?a:null,null!==(i=null===(l=n[u+1])||void 0===l?void 0:l.id)&&void 0!==i?i:null]}(n,t,a,o);if(null==l||null==s)return()=>{};const c=e=>{if(!e.defaultPrevented)switch(e.key){case"Enter":{e.preventDefault();const s=a.findIndex((e=>e.id===l));if(s>=0){const e=a[s];Te(e,`No panel data found for index ${s}`);const l=r[s],{collapsedSize:c=0,collapsible:u,minSize:d=0}=e.constraints;if(null!=l&&u){const e=Fe({delta:_e(l,c)?d-c:c-l,initialLayout:r,panelConstraints:a.map((e=>e.constraints)),pivotIndices:Ve(n,t,o),prevLayout:r,trigger:"keyboard"});r!==e&&i(e)}}break}}};return e.addEventListener("keydown",c),()=>{e.removeEventListener("keydown",c)}}));return()=>{s.forEach((e=>e()))}}),[o,e,t,n,r,a,i])}function Ye(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}function Ue(e,t){const n="horizontal"===e,{x:r,y:a}=de(t);return n?r:a}function Qe(e,t,n,r,a,o){if(se(e)){const t="horizontal"===n;let r=0;r=e.shiftKey?100:null!=a?a:10;let o=0;switch(e.key){case"ArrowDown":o=t?0:r;break;case"ArrowLeft":o=t?-r:0;break;case"ArrowRight":o=t?r:0;break;case"ArrowUp":o=t?0:-r;break;case"End":o=100;break;case"Home":o=-100}return o}return null==r?0:function(e,t,n,r,a){const o="horizontal"===n,i=Ke(t,a);Te(i,`No resize handle element found for id "${t}"`);const l=i.getAttribute("data-panel-group-id");Te(l,"Resize handle element has no group id attribute");let{initialCursorPosition:s}=r;const c=Ue(n,e),u=Je(l,a);Te(u,`No group element found for id "${l}"`);const d=u.getBoundingClientRect();return(c-s)/(o?d.width:d.height)*100}(e,t,n,r,o)}function Ze(e,t,n){t.forEach(((t,r)=>{const a=e[r];Te(a,`Panel data not found for index ${r}`);const{callbacks:o,constraints:i,id:l}=a,{collapsedSize:s=0,collapsible:c}=i,u=n[l];if(null==u||t!==u){n[l]=t;const{onCollapse:e,onExpand:r,onResize:a}=o;a&&a(t,u),c&&(e||r)&&(!r||null!=u&&!Oe(u,s)||Oe(t,s)||r(),!e||null!=u&&Oe(u,s)||!Oe(t,s)||e())}}))}function et(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!=t[n])return!1;return!0}function tt(e){try{if("undefined"==typeof localStorage)throw new Error("localStorage not supported in this environment");e.getItem=e=>localStorage.getItem(e),e.setItem=(e,t)=>{localStorage.setItem(e,t)}}catch(t){e.getItem=()=>null,e.setItem=()=>{}}}function nt(e){return`react-resizable-panels:${e}`}function rt(e){return e.map((e=>{const{constraints:t,id:n,idIsFromProps:r,order:a}=e;return r?n:a?`${a}:${JSON.stringify(t)}`:JSON.stringify(t)})).sort(((e,t)=>e.localeCompare(t))).join(",")}function at(e,t){try{const n=nt(e),r=t.getItem(n);if(r){const e=JSON.parse(r);if("object"==typeof e&&null!=e)return e}}catch(n){}return null}function ot(e,t,n,r,a){var o;const i=nt(e),l=rt(t),s=null!==(o=at(e,a))&&void 0!==o?o:{};s[l]={expandToSizes:Object.fromEntries(n.entries()),layout:r};try{a.setItem(i,JSON.stringify(s))}catch(c){}}function it({layout:e,panelConstraints:t}){const n=[...e],r=n.reduce(((e,t)=>e+t),0);if(n.length!==t.length)throw Error(`Invalid ${t.length} panel layout: ${n.map((e=>`${e}%`)).join(", ")}`);if(!_e(r,100))for(let o=0;o<t.length;o++){const e=n[o];Te(null!=e,`No layout data found for index ${o}`);const t=100/r*e;n[o]=t}let a=0;for(let o=0;o<t.length;o++){const e=n[o];Te(null!=e,`No layout data found for index ${o}`);const r=Be({panelConstraints:t,panelIndex:o,size:e});e!=r&&(a+=e-r,n[o]=r)}if(!_e(a,0))for(let o=0;o<t.length;o++){const e=n[o];Te(null!=e,`No layout data found for index ${o}`);const r=Be({panelConstraints:t,panelIndex:o,size:e+a});if(e!==r&&(a-=r-e,n[o]=r,_e(a,0)))break}return n}const lt={getItem:e=>(tt(lt),lt.getItem(e)),setItem:(e,t)=>{tt(lt),lt.setItem(e,t)}},st={};function ct({autoSaveId:e=null,children:t,className:n="",direction:r,forwardedRef:a,id:o=null,onLayout:i=null,keyboardResizeBy:l=null,storage:s=lt,style:c,tagName:u="div",...d}){const p=ne(o),f=K(null),[h,m]=X(null),[g,y]=X([]),v=K({}),x=K(new Map),b=K(0),w=K({autoSaveId:e,direction:r,dragState:h,id:p,keyboardResizeBy:l,onLayout:i,storage:s}),z=K({layout:g,panelDataArray:[],panelDataArrayChanged:!1});K({didLogIdAndOrderWarning:!1,didLogPanelConstraintsWarning:!1,prevPanelIds:[]}),q(a,(()=>({getId:()=>w.current.id,getLayout:()=>{const{layout:e}=z.current;return e},setLayout:e=>{const{onLayout:t}=w.current,{layout:n,panelDataArray:r}=z.current,a=it({layout:e,panelConstraints:r.map((e=>e.constraints))});Ye(n,a)||(y(a),z.current.layout=a,t&&t(a),Ze(r,a,v.current))}})),[]),Z((()=>{w.current.autoSaveId=e,w.current.direction=r,w.current.dragState=h,w.current.id=p,w.current.onLayout=i,w.current.storage=s})),Xe({committedValuesRef:w,eagerValuesRef:z,groupId:p,layout:g,panelDataArray:z.current.panelDataArray,setLayout:y,panelGroupElement:f.current}),W((()=>{const{panelDataArray:t}=z.current;if(e){if(0===g.length||g.length!==t.length)return;let n=st[e];null==n&&(n=function(e,t=10){let n=null;return(...r)=>{null!==n&&clearTimeout(n),n=setTimeout((()=>{e(...r)}),t)}}(ot,100),st[e]=n);const r=[...t],a=new Map(x.current);n(e,r,a,g,s)}}),[e,g,s]),W((()=>{}));const k=F((e=>{const{onLayout:t}=w.current,{layout:n,panelDataArray:r}=z.current;if(e.constraints.collapsible){const a=r.map((e=>e.constraints)),{collapsedSize:o=0,panelSize:i,pivotIndices:l}=pt(r,e,n);if(Te(null!=i,`Panel size not found for panel "${e.id}"`),!Oe(i,o)){x.current.set(e.id,i);const s=Fe({delta:dt(r,e)===r.length-1?i-o:o-i,initialLayout:n,panelConstraints:a,pivotIndices:l,prevLayout:n,trigger:"imperative-api"});et(n,s)||(y(s),z.current.layout=s,t&&t(s),Ze(r,s,v.current))}}}),[]),S=F(((e,t)=>{const{onLayout:n}=w.current,{layout:r,panelDataArray:a}=z.current;if(e.constraints.collapsible){const o=a.map((e=>e.constraints)),{collapsedSize:i=0,panelSize:l=0,minSize:s=0,pivotIndices:c}=pt(a,e,r),u=null!=t?t:s;if(Oe(l,i)){const t=x.current.get(e.id),i=null!=t&&t>=u?t:u,s=Fe({delta:dt(a,e)===a.length-1?l-i:i-l,initialLayout:r,panelConstraints:o,pivotIndices:c,prevLayout:r,trigger:"imperative-api"});et(r,s)||(y(s),z.current.layout=s,n&&n(s),Ze(a,s,v.current))}}}),[]),E=F((e=>{const{layout:t,panelDataArray:n}=z.current,{panelSize:r}=pt(n,e,t);return Te(null!=r,`Panel size not found for panel "${e.id}"`),r}),[]),C=F(((e,t)=>{const{panelDataArray:n}=z.current,r=dt(n,e);return function({defaultSize:e,dragState:t,layout:n,panelData:r,panelIndex:a,precision:o=3}){const i=n[a];let l;return l=null==i?null!=e?e.toPrecision(o):"1":1===r.length?"1":i.toPrecision(o),{flexBasis:0,flexGrow:l,flexShrink:1,overflow:"hidden",pointerEvents:null!==t?"none":void 0}}({defaultSize:t,dragState:h,layout:g,panelData:n,panelIndex:r})}),[h,g]),P=F((e=>{const{layout:t,panelDataArray:n}=z.current,{collapsedSize:r=0,collapsible:a,panelSize:o}=pt(n,e,t);return Te(null!=o,`Panel size not found for panel "${e.id}"`),!0===a&&Oe(o,r)}),[]),I=F((e=>{const{layout:t,panelDataArray:n}=z.current,{collapsedSize:r=0,collapsible:a,panelSize:o}=pt(n,e,t);return Te(null!=o,`Panel size not found for panel "${e.id}"`),!a||He(o,r)>0}),[]),L=F((e=>{const{panelDataArray:t}=z.current;t.push(e),t.sort(((e,t)=>{const n=e.order,r=t.order;return null==n&&null==r?0:null==n?-1:null==r?1:n-r})),z.current.panelDataArrayChanged=!0}),[]);Z((()=>{if(z.current.panelDataArrayChanged){z.current.panelDataArrayChanged=!1;const{autoSaveId:e,onLayout:t,storage:n}=w.current,{layout:r,panelDataArray:a}=z.current;let o=null;if(e){const t=function(e,t,n){var r,a;return null!==(a=(null!==(r=at(e,n))&&void 0!==r?r:{})[rt(t)])&&void 0!==a?a:null}(e,a,n);t&&(x.current=new Map(Object.entries(t.expandToSizes)),o=t.layout)}null==o&&(o=function({panelDataArray:e}){const t=Array(e.length),n=e.map((e=>e.constraints));let r=0,a=100;for(let o=0;o<e.length;o++){const e=n[o];Te(e,`Panel constraints not found for index ${o}`);const{defaultSize:i}=e;null!=i&&(r++,t[o]=i,a-=i)}for(let o=0;o<e.length;o++){const i=n[o];Te(i,`Panel constraints not found for index ${o}`);const{defaultSize:l}=i;if(null!=l)continue;const s=a/(e.length-r);r++,t[o]=s,a-=s}return t}({panelDataArray:a}));const i=it({layout:o,panelConstraints:a.map((e=>e.constraints))});Ye(r,i)||(y(i),z.current.layout=i,t&&t(i),Ze(a,i,v.current))}})),Z((()=>{const e=z.current;return()=>{e.layout=[]}}),[]);const D=F((e=>function(t){t.preventDefault();const n=f.current;if(!n)return()=>null;const{direction:r,dragState:a,id:o,keyboardResizeBy:i,onLayout:l}=w.current,{layout:s,panelDataArray:c}=z.current,{initialLayout:u}=null!=a?a:{},d=Ve(o,e,n);let p=Qe(t,e,r,a,i,n);if(0===p)return;const h="horizontal"===r;"rtl"===document.dir&&h&&(p=-p);const m=Fe({delta:p,initialLayout:null!=u?u:s,panelConstraints:c.map((e=>e.constraints)),pivotIndices:d,prevLayout:s,trigger:se(t)?"keyboard":"mouse-or-touch"}),g=!et(s,m);(ce(t)||ue(t))&&b.current!=p&&(b.current=p,je(e,g?0:h?p<0?ve:xe:p<0?be:we)),g&&(y(m),z.current.layout=m,l&&l(m),Ze(c,m,v.current))}),[]),N=F(((e,t)=>{const{onLayout:n}=w.current,{layout:r,panelDataArray:a}=z.current,o=a.map((e=>e.constraints)),{panelSize:i,pivotIndices:l}=pt(a,e,r);Te(null!=i,`Panel size not found for panel "${e.id}"`);const s=Fe({delta:dt(a,e)===a.length-1?i-t:t-i,initialLayout:r,panelConstraints:o,pivotIndices:l,prevLayout:r,trigger:"imperative-api"});et(r,s)||(y(s),z.current.layout=s,n&&n(s),Ze(a,s,v.current))}),[]),j=F(((e,t)=>{const{layout:n,panelDataArray:r}=z.current,{collapsedSize:a=0,collapsible:o}=t,{collapsedSize:i=0,collapsible:l,maxSize:s=100,minSize:c=0}=e.constraints,{panelSize:u}=pt(r,e,n);null!=u&&(o&&l&&Oe(u,a)?Oe(a,i)||N(e,i):u<c?N(e,c):u>s&&N(e,s))}),[N]),A=F(((e,t)=>{const{direction:n}=w.current,{layout:r}=z.current;if(!f.current)return;const a=Ke(e,f.current);Te(a,`Drag handle element not found for id "${e}"`);const o=Ue(n,t);m({dragHandleId:e,dragHandleRect:a.getBoundingClientRect(),initialCursorPosition:o,initialLayout:r})}),[]),M=F((()=>{m(null)}),[]),R=F((e=>{const{panelDataArray:t}=z.current,n=dt(t,e);n>=0&&(t.splice(n,1),delete v.current[e.id],z.current.panelDataArrayChanged=!0)}),[]),T=J((()=>({collapsePanel:k,direction:r,dragState:h,expandPanel:S,getPanelSize:E,getPanelStyle:C,groupId:p,isPanelCollapsed:P,isPanelExpanded:I,reevaluatePanelConstraints:j,registerPanel:L,registerResizeHandle:D,resizePanel:N,startDragging:A,stopDragging:M,unregisterPanel:R,panelGroupElement:f.current})),[k,h,r,S,E,C,p,P,I,j,L,D,N,A,M,R]),$={display:"flex",flexDirection:"horizontal"===r?"row":"column",height:"100%",overflow:"hidden",width:"100%"};return H(Q.Provider,{value:T},H(u,{...d,children:t,className:n,id:o,ref:f,style:{...$,...c},"data-panel-group":"","data-panel-group-direction":r,"data-panel-group-id":p}))}const ut=B(((e,t)=>H(ct,{...e,forwardedRef:t})));function dt(e,t){return e.findIndex((e=>e===t||e.id===t.id))}function pt(e,t,n){const r=dt(e,t),a=r===e.length-1?[r-1,r]:[r,r+1],o=n[r];return{...t.constraints,panelSize:o,pivotIndices:a}}function ft({children:e=null,className:t="",disabled:n=!1,hitAreaMargins:r,id:a,onDragging:o,style:i={},tabIndex:l=0,tagName:s="div",...c}){var u,d;const p=K(null),f=K({onDragging:o});W((()=>{f.current.onDragging=o}));const h=G(Q);if(null===h)throw Error("PanelResizeHandle components must be rendered within a PanelGroup container");const{direction:m,groupId:g,registerResizeHandle:y,startDragging:v,stopDragging:x,panelGroupElement:b}=h,w=ne(a),[z,k]=X("inactive"),[S,E]=X(!1),[C,P]=X(null),I=K({state:z});Z((()=>{I.current.state=z})),W((()=>{if(n)P(null);else{const e=y(w);P((()=>e))}}),[n,w,y]);const L=null!==(u=null==r?void 0:r.coarse)&&void 0!==u?u:15,D=null!==(d=null==r?void 0:r.fine)&&void 0!==d?d:5;W((()=>{if(n||null==C)return;const e=p.current;Te(e,"Element ref not attached");return function(e,t,n,r,a){var o;const{ownerDocument:i}=t,l={direction:n,element:t,hitAreaMargins:r,setResizeHandlerState:a},s=null!==(o=Ee.get(i))&&void 0!==o?o:0;return Ee.set(i,s+1),Pe.add(l),Me(),function(){var t;Ce.delete(e),Pe.delete(l);const n=null!==(t=Ee.get(i))&&void 0!==t?t:1;Ee.set(i,n-1),Me(),1===n&&Ee.delete(i)}}(w,e,m,{coarse:L,fine:D},((e,t,n)=>{if(t)switch(e){case"down":{k("drag"),v(w,n);const{onDragging:e}=f.current;e&&e(!0);break}case"move":{const{state:e}=I.current;"drag"!==e&&k("hover"),C(n);break}case"up":{k("hover"),x();const{onDragging:e}=f.current;e&&e(!1);break}}else k("inactive")}))}),[L,m,n,D,y,w,C,v,x]),function({disabled:e,handleId:t,resizeHandler:n,panelGroupElement:r}){W((()=>{if(e||null==n||null==r)return;const a=Ke(t,r);if(null==a)return;const o=e=>{if(!e.defaultPrevented)switch(e.key){case"ArrowDown":case"ArrowLeft":case"ArrowRight":case"ArrowUp":case"End":case"Home":e.preventDefault(),n(e);break;case"F6":{e.preventDefault();const n=a.getAttribute("data-panel-group-id");Te(n,`No group element found for id "${n}"`);const o=We(n,r),i=qe(n,t,r);Te(null!==i,`No resize element found for id "${t}"`),o[e.shiftKey?i>0?i-1:o.length-1:i+1<o.length?i+1:0].focus();break}}};return a.addEventListener("keydown",o),()=>{a.removeEventListener("keydown",o)}}),[r,e,t,n])}({disabled:n,handleId:w,resizeHandler:C,panelGroupElement:b});return H(s,{...c,children:e,className:t,id:a,onBlur:()=>E(!1),onFocus:()=>E(!0),ref:p,role:"separator",style:{touchAction:"none",userSelect:"none",...i},tabIndex:l,"data-panel-group-direction":m,"data-panel-group-id":g,"data-resize-handle":"","data-resize-handle-active":"drag"===z?"pointer":S?"keyboard":void 0,"data-resize-handle-state":z,"data-panel-resize-handle-enabled":!n,"data-panel-resize-handle-id":w})}ct.displayName="PanelGroup",ut.displayName="forwardRef(PanelGroup)",ft.displayName="PanelResizeHandle";const ht=({className:e,...t})=>n.jsx(ut,{className:r("flex h-full w-full data-[panel-group-direction=vertical]:flex-col",e),...t}),mt=ae,gt=({withHandle:e,className:t,...a})=>n.jsx(ft,{className:r("relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",t),...a,children:e&&n.jsx("div",{className:"z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border",children:n.jsx(R,{className:"h-2.5 w-2.5"})})}),[yt,vt]=a("Tooltip",[o]),xt=o(),bt=700,wt="tooltip.open",[zt,kt]=yt("TooltipProvider"),St="Tooltip",[Et,Ct]=yt(St),Pt="TooltipTrigger",It=i.forwardRef(((e,t)=>{const{__scopeTooltip:n,...r}=e,a=Ct(Pt,n),o=kt(Pt,n),l=xt(n),u=i.useRef(null),d=c(t,u,a.onTriggerChange),p=i.useRef(!1),f=i.useRef(!1),h=i.useCallback((()=>p.current=!1),[]);return i.useEffect((()=>()=>document.removeEventListener("pointerup",h)),[h]),i.createElement(y,s({asChild:!0},l),i.createElement(v.button,s({"aria-describedby":a.open?a.contentId:void 0,"data-state":a.stateAttribute},r,{ref:d,onPointerMove:x(e.onPointerMove,(e=>{"touch"!==e.pointerType&&(f.current||o.isPointerInTransitRef.current||(a.onTriggerEnter(),f.current=!0))})),onPointerLeave:x(e.onPointerLeave,(()=>{a.onTriggerLeave(),f.current=!1})),onPointerDown:x(e.onPointerDown,(()=>{p.current=!0,document.addEventListener("pointerup",h,{once:!0})})),onFocus:x(e.onFocus,(()=>{p.current||a.onOpen()})),onBlur:x(e.onBlur,a.onClose),onClick:x(e.onClick,a.onClose)})))})),[Lt,Dt]=yt("TooltipPortal",{forceMount:void 0}),Nt="TooltipContent",jt=i.forwardRef(((e,t)=>{const n=Dt(Nt,e.__scopeTooltip),{forceMount:r=n.forceMount,side:a="top",...o}=e,c=Ct(Nt,e.__scopeTooltip);return i.createElement(l,{present:r||c.open},c.disableHoverableContent?i.createElement(Tt,s({side:a},o,{ref:t})):i.createElement(At,s({side:a},o,{ref:t})))})),At=i.forwardRef(((e,t)=>{const n=Ct(Nt,e.__scopeTooltip),r=kt(Nt,e.__scopeTooltip),a=i.useRef(null),o=c(t,a),[l,u]=i.useState(null),{trigger:d,onClose:p}=n,f=a.current,{onPointerInTransitChange:h}=r,m=i.useCallback((()=>{u(null),h(!1)}),[h]),g=i.useCallback(((e,t)=>{const n=e.currentTarget,r={x:e.clientX,y:e.clientY},a=function(e,t,n=5){const r=[];switch(t){case"top":r.push({x:e.x-n,y:e.y+n},{x:e.x+n,y:e.y+n});break;case"bottom":r.push({x:e.x-n,y:e.y-n},{x:e.x+n,y:e.y-n});break;case"left":r.push({x:e.x+n,y:e.y-n},{x:e.x+n,y:e.y+n});break;case"right":r.push({x:e.x-n,y:e.y-n},{x:e.x-n,y:e.y+n})}return r}(r,function(e,t){const n=Math.abs(t.top-e.y),r=Math.abs(t.bottom-e.y),a=Math.abs(t.right-e.x),o=Math.abs(t.left-e.x);switch(Math.min(n,r,a,o)){case o:return"left";case a:return"right";case n:return"top";case r:return"bottom";default:throw new Error("unreachable")}}(r,n.getBoundingClientRect())),o=function(e){const t=e.slice();return t.sort(((e,t)=>e.x<t.x?-1:e.x>t.x?1:e.y<t.y?-1:e.y>t.y?1:0)),function(e){if(e.length<=1)return e.slice();const t=[];for(let r=0;r<e.length;r++){const n=e[r];for(;t.length>=2;){const e=t[t.length-1],r=t[t.length-2];if(!((e.x-r.x)*(n.y-r.y)>=(e.y-r.y)*(n.x-r.x)))break;t.pop()}t.push(n)}t.pop();const n=[];for(let r=e.length-1;r>=0;r--){const t=e[r];for(;n.length>=2;){const e=n[n.length-1],r=n[n.length-2];if(!((e.x-r.x)*(t.y-r.y)>=(e.y-r.y)*(t.x-r.x)))break;n.pop()}n.push(t)}return n.pop(),1===t.length&&1===n.length&&t[0].x===n[0].x&&t[0].y===n[0].y?t:t.concat(n)}(t)}([...a,...function(e){const{top:t,right:n,bottom:r,left:a}=e;return[{x:a,y:t},{x:n,y:t},{x:n,y:r},{x:a,y:r}]}(t.getBoundingClientRect())]);u(o),h(!0)}),[h]);return i.useEffect((()=>()=>m()),[m]),i.useEffect((()=>{if(d&&f){const e=e=>g(e,f),t=e=>g(e,d);return d.addEventListener("pointerleave",e),f.addEventListener("pointerleave",t),()=>{d.removeEventListener("pointerleave",e),f.removeEventListener("pointerleave",t)}}}),[d,f,g,m]),i.useEffect((()=>{if(l){const e=e=>{const t=e.target,n={x:e.clientX,y:e.clientY},r=(null==d?void 0:d.contains(t))||(null==f?void 0:f.contains(t)),a=!function(e,t){const{x:n,y:r}=e;let a=!1;for(let o=0,i=t.length-1;o<t.length;i=o++){const e=t[o].x,l=t[o].y,s=t[i].x,c=t[i].y;l>r!=c>r&&n<(s-e)*(r-l)/(c-l)+e&&(a=!a)}return a}(n,l);r?m():a&&(m(),p())};return document.addEventListener("pointermove",e),()=>document.removeEventListener("pointermove",e)}}),[d,f,l,p,m]),i.createElement(Tt,s({},e,{ref:o}))})),[Mt,Rt]=yt(St,{isInside:!1}),Tt=i.forwardRef(((e,t)=>{const{__scopeTooltip:n,children:r,"aria-label":a,onEscapeKeyDown:o,onPointerDownOutside:l,...c}=e,h=Ct(Nt,n),m=xt(n),{onClose:g}=h;return i.useEffect((()=>(document.addEventListener(wt,g),()=>document.removeEventListener(wt,g))),[g]),i.useEffect((()=>{if(h.trigger){const e=e=>{const t=e.target;null!=t&&t.contains(h.trigger)&&g()};return window.addEventListener("scroll",e,{capture:!0}),()=>window.removeEventListener("scroll",e,{capture:!0})}}),[h.trigger,g]),i.createElement(u,{asChild:!0,disableOutsidePointerEvents:!1,onEscapeKeyDown:o,onPointerDownOutside:l,onFocusOutside:e=>e.preventDefault(),onDismiss:g},i.createElement(d,s({"data-state":h.stateAttribute},m,c,{ref:t,style:{...c.style,"--radix-tooltip-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-tooltip-content-available-width":"var(--radix-popper-available-width)","--radix-tooltip-content-available-height":"var(--radix-popper-available-height)","--radix-tooltip-trigger-width":"var(--radix-popper-anchor-width)","--radix-tooltip-trigger-height":"var(--radix-popper-anchor-height)"}}),i.createElement(p,null,r),i.createElement(Mt,{scope:n,isInside:!0},i.createElement(f,{id:h.contentId,role:"tooltip"},a||r))))}));const $t=jt,Ht=e=>{const{__scopeTooltip:t,delayDuration:n=bt,skipDelayDuration:r=300,disableHoverableContent:a=!1,children:o}=e,[l,s]=i.useState(!0),c=i.useRef(!1),u=i.useRef(0);return i.useEffect((()=>{const e=u.current;return()=>window.clearTimeout(e)}),[]),i.createElement(zt,{scope:t,isOpenDelayed:l,delayDuration:n,onOpen:i.useCallback((()=>{window.clearTimeout(u.current),s(!1)}),[]),onClose:i.useCallback((()=>{window.clearTimeout(u.current),u.current=window.setTimeout((()=>s(!0)),r)}),[r]),isPointerInTransitRef:c,onPointerInTransitChange:i.useCallback((e=>{c.current=e}),[]),disableHoverableContent:a},o)},Ot=e=>{const{__scopeTooltip:t,children:n,open:r,defaultOpen:a=!1,onOpenChange:o,disableHoverableContent:l,delayDuration:s}=e,c=kt(St,e.__scopeTooltip),u=xt(t),[d,p]=i.useState(null),f=h(),y=i.useRef(0),v=null!=l?l:c.disableHoverableContent,x=null!=s?s:c.delayDuration,b=i.useRef(!1),[w=!1,z]=m({prop:r,defaultProp:a,onChange:e=>{e?(c.onOpen(),document.dispatchEvent(new CustomEvent(wt))):c.onClose(),null==o||o(e)}}),k=i.useMemo((()=>w?b.current?"delayed-open":"instant-open":"closed"),[w]),S=i.useCallback((()=>{window.clearTimeout(y.current),b.current=!1,z(!0)}),[z]),E=i.useCallback((()=>{window.clearTimeout(y.current),z(!1)}),[z]),C=i.useCallback((()=>{window.clearTimeout(y.current),y.current=window.setTimeout((()=>{b.current=!0,z(!0)}),x)}),[x,z]);return i.useEffect((()=>()=>window.clearTimeout(y.current)),[]),i.createElement(g,u,i.createElement(Et,{scope:t,contentId:f,open:w,stateAttribute:k,trigger:d,onTriggerChange:p,onTriggerEnter:i.useCallback((()=>{c.isOpenDelayed?C():S()}),[c.isOpenDelayed,C,S]),onTriggerLeave:i.useCallback((()=>{v?E():window.clearTimeout(y.current)}),[E,v]),onOpen:S,onClose:E,disableHoverableContent:v},n))},_t=It,Bt=i.forwardRef((({className:e,sideOffset:t=4,...a},o)=>n.jsx($t,{ref:o,sideOffset:t,className:r("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",e),...a})));function Ft({links:e,isCollapsed:t}){const{pathname:a}=b();return n.jsx("div",{"data-collapsed":t,className:"group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2",children:n.jsx("nav",{className:"grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2",children:e.map(((e,o)=>{let i=(l=e.to,!k(l)&&("string"==typeof l?a.startsWith(l):!k(null==l?void 0:l.pathname)&&a.startsWith(l.pathname)));var l;return t?n.jsxs(Ot,{delayDuration:0,children:[n.jsx(_t,{asChild:!0,children:n.jsxs(w,{to:e.to||"#",className:r(z({variant:i?"default":"ghost",size:"icon"}),"h-9 w-9",i&&"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"),children:[n.jsx(e.icon,{className:"h-4 w-4"}),n.jsx("span",{className:"sr-only",children:e.title})]})}),n.jsxs(Bt,{side:"right",className:"flex items-center gap-4",children:[e.title,e.badge&&n.jsx("span",{className:"ml-auto text-muted-foreground",children:e.badge})]})]},o):n.jsxs(w,{to:e.to||"#",className:r(z({variant:i?"default":"ghost",size:"sm"}),"justify-start",i&&"dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"),children:[n.jsx(e.icon,{className:"mr-2 h-4 w-4"}),e.title,e.badge&&n.jsx("span",{className:r("ml-auto",i&&"text-background dark:text-white"),children:e.badge})]},o)}))})})}Bt.displayName=$t.displayName;const Gt=[{title:"监控指标",icon:M,to:"/manage/monitor-metrics"},{title:"应用路由",icon:j,to:"/manage/app-routes"}];function Wt(){const{setTheme:e}=S();return n.jsxs(E,{children:[n.jsx(C,{asChild:!0,children:n.jsxs(P,{variant:"outline",size:"icon",children:[n.jsx($,{className:"h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"}),n.jsx(T,{className:"absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"}),n.jsx("span",{className:"sr-only",children:"Toggle theme"})]})}),n.jsxs(I,{align:"end",children:[n.jsx(L,{onClick:()=>e("light"),children:"明亮"}),n.jsx(L,{onClick:()=>e("dark"),children:"暗夜"}),n.jsx(L,{onClick:()=>e("system"),children:"跟随系统"})]})]})}const qt=()=>{const[e,t]=i.useState(!1);return n.jsx(Ht,{delayDuration:0,children:n.jsxs(ht,{direction:"horizontal",children:[n.jsxs(mt,{defaultSize:15,minSize:10,maxSize:20,collapsedSize:4,collapsible:!0,onCollapse:()=>t(!0),onExpand:()=>t(!1),className:r(e&&"min-w-[50px] transition-all duration-300 ease-in-out"),children:[n.jsx("div",{className:r("flex h-[52px] items-center justify-center",e?"h-[52px]":"px-2"),children:"Great Wall"}),n.jsx(A,{}),n.jsx(Ft,{isCollapsed:e,links:Gt})]}),n.jsx(gt,{withHandle:!0}),n.jsx(mt,{defaultSize:85,children:n.jsxs("div",{className:"flex flex-col gap-4 px-4 sm:py-3 h-full w-full box-border",children:[n.jsx("div",{className:"flex flex-row justify-end",children:n.jsx(Wt,{})}),n.jsx(D,{className:"flex-auto overflow-hidden",children:e=>n.jsx("div",{style:{...e},children:n.jsx(N,{})})})]})})]})})};export{qt as default};
