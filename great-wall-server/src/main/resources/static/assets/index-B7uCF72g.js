import{z as s,a as e,j as a,F as r,f as n,g as t,i as o,h as i,B as c,a4 as l,t as d}from"./index-BspH0A2d.js";import{C as m}from"./checkbox-CYO3NFez.js";import{S as p}from"./separator-CY3tfW8N.js";import{G as u,a as f,u as x}from"./useApiRequest-Va7qjswp.js";import{L as h}from"./loading-block-BssfLp8X.js";import{u as j}from"./useFromFieldErrorSpecification-C65AU_gP.js";const g=s.object({redirectHttps:s.boolean({required_error:"不可以为空"})});function y(){return u("/api/settings")}function b(s){return f("/api/settings",{body:s,resultSchema:g})}function N(){const{loading:s,runAsync:u}=x(y,{manual:!0}),{loading:f,runAsync:N}=x(b,{manual:!0}),k=e({resolver:d(g),defaultValues:async()=>await u()}),v=j(k);return a.jsxs("div",{className:"w-full flex flex-col gap-4 ml-[80px]",children:[a.jsx("div",{className:"text-xl font-bold",children:"系统设置"}),a.jsx(p,{className:"my-2"}),a.jsx(h,{loading:s,children:a.jsx(r,{...k,children:a.jsxs("form",{onSubmit:k.handleSubmit((async function(s){await v((()=>N(s))),l.info("系统设置更新成功",{position:"top-center"})})),className:"space-y-8",children:[a.jsx(n,{control:k.control,name:"redirectHttps",render:({field:s})=>a.jsxs(t,{className:"flex flex-row items-center space-x-3 space-y-0 p-4 pl-0",children:[a.jsx(o,{children:a.jsx(m,{checked:s.value,onCheckedChange:s.onChange})}),a.jsx(i,{children:"http 请求是否重定向到 https"})]})}),a.jsx(c,{type:"submit",loading:f,className:"w-28",variant:"secondary",children:"提交"})]})})})]})}export{N as default};
