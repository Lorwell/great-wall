import{r as o,E as r,_ as e,j as n,m as t}from"./index-BspH0A2d.js";const a="horizontal",i=["horizontal","vertical"],l=o.forwardRef(((n,t)=>{const{decorative:i,orientation:l=a,...c}=n,d=s(l)?l:a,p=i?{role:"none"}:{"aria-orientation":"vertical"===d?d:void 0,role:"separator"};return o.createElement(r.div,e({"data-orientation":d},p,c,{ref:t}))}));function s(o){return i.includes(o)}l.propTypes={orientation(o,r,e){const n=o[r],t=String(n);return n&&!s(n)?new Error(function(o,r){return`Invalid prop \`orientation\` of value \`${o}\` supplied to \`${r}\`, expected one of:\n  - horizontal\n  - vertical\n\nDefaulting to \`${a}\`.`}(t,e)):null}};const c=l,d=o.forwardRef((({className:o,orientation:r="horizontal",decorative:e=!0,...a},i)=>n.jsx(c,{ref:i,decorative:e,orientation:r,className:t("shrink-0 bg-border","horizontal"===r?"h-[1px] w-full":"h-full w-[1px]",o),...a})));d.displayName=c.displayName;export{d as S};
