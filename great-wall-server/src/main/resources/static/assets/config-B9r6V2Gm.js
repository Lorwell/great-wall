import{u as s,H as e,a,t as r,j as i,F as n,f as l,g as o,h as t,i as c,b4 as d,k as x,B as m}from"./index-Hpy4aKqW.js";import{T as j,c as u,a as f}from"./index-yZ-vangy.js";import{u as h}from"./useApiRequest-CJy0Cr6c.js";import{u as p}from"./useFromFieldErrorSpecification-D2Qwavm4.js";function y(){const y=s(),{state:g}=e(),v=g,b=a({resolver:r(u),defaultValues:{type:j.Custom,...(null==v?void 0:v.type)===j.Custom?v:{}}}),{loading:w,runAsync:N}=h(f,{manual:!0,noticeError:!1}),C=p(b);return i.jsxs("div",{className:"w-[480px] flex flex-col gap-4 ml-[80px]",children:[i.jsx("div",{className:"text-lg font-bold",children:"自定义证书"}),i.jsx("div",{children:i.jsx(n,{...b,children:i.jsxs("form",{onSubmit:b.handleSubmit((async function(s){await C((()=>N({config:s}))),y("/manage/tls")})),className:"space-y-8",children:[i.jsx(l,{control:b.control,name:"certificate",render:({field:s})=>i.jsxs(o,{children:[i.jsx(t,{children:"Cert 证书"}),i.jsx(c,{children:i.jsx(d,{...s,rows:8})}),i.jsx(x,{})]})}),i.jsx(l,{control:b.control,name:"privateKey",render:({field:s})=>i.jsxs(o,{children:[i.jsx(t,{children:"Key 密钥"}),i.jsx(c,{children:i.jsx(d,{...s,rows:8})}),i.jsx(x,{})]})}),i.jsx(m,{type:"submit",loading:w,className:"w-full",variant:"secondary",children:"提交"})]})})})]})}export{y as default};
