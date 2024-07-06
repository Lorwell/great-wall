import{$ as e,r as t,s as r,E as n,J as a,_ as s,K as o,q as c,b4 as d,b5 as i,j as l,o as u,aD as b}from"./index-iVrnBSHy.js";const f="Checkbox",[p,m]=e(f),[h,k]=p(f),y=t.forwardRef(((e,c)=>{const{__scopeCheckbox:d,name:i,checked:l,defaultChecked:u,required:b,disabled:f,value:p="on",onCheckedChange:m,...k}=e,[y,g]=t.useState(null),w=r(c,(e=>g(e))),C=t.useRef(!1),j=!y||Boolean(y.closest("form")),[N=!1,R]=n({prop:l,defaultProp:u,onChange:m}),D=t.useRef(N);return t.useEffect((()=>{const e=null==y?void 0:y.form;if(e){const t=()=>R(D.current);return e.addEventListener("reset",t),()=>e.removeEventListener("reset",t)}}),[y,R]),t.createElement(h,{scope:d,state:N,disabled:f},t.createElement(a.button,s({type:"button",role:"checkbox","aria-checked":E(N)?"mixed":N,"aria-required":b,"data-state":x(N),"data-disabled":f?"":void 0,disabled:f,value:p},k,{ref:w,onKeyDown:o(e.onKeyDown,(e=>{"Enter"===e.key&&e.preventDefault()})),onClick:o(e.onClick,(e=>{R((e=>!!E(e)||!e)),j&&(C.current=e.isPropagationStopped(),C.current||e.stopPropagation())}))})),j&&t.createElement(v,{control:y,bubbles:!C.current,name:i,value:p,checked:N,required:b,disabled:f,style:{transform:"translateX(-100%)"}}))})),v=e=>{const{control:r,checked:n,bubbles:a=!0,...o}=e,c=t.useRef(null),l=d(n),u=i(r);return t.useEffect((()=>{const e=c.current,t=window.HTMLInputElement.prototype,r=Object.getOwnPropertyDescriptor(t,"checked").set;if(l!==n&&r){const t=new Event("click",{bubbles:a});e.indeterminate=E(n),r.call(e,!E(n)&&n),e.dispatchEvent(t)}}),[l,n,a]),t.createElement("input",s({type:"checkbox","aria-hidden":!0,defaultChecked:!E(n)&&n},o,{tabIndex:-1,ref:c,style:{...e.style,...u,position:"absolute",pointerEvents:"none",opacity:0,margin:0}}))};function E(e){return"indeterminate"===e}function x(e){return E(e)?"indeterminate":e?"checked":"unchecked"}const g=y,w=t.forwardRef(((e,r)=>{const{__scopeCheckbox:n,forceMount:o,...d}=e,i=k("CheckboxIndicator",n);return t.createElement(c,{present:o||E(i.state)||!0===i.state},t.createElement(a.span,s({"data-state":x(i.state),"data-disabled":i.disabled?"":void 0},d,{ref:r,style:{pointerEvents:"none",...e.style}})))})),C=t.forwardRef((({className:e,...t},r)=>l.jsx(g,{ref:r,className:u("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",e),...t,children:l.jsx(w,{className:u("flex items-center justify-center text-current"),children:l.jsx(b,{className:"h-4 w-4"})})})));C.displayName=g.displayName;export{C};