import{z as s,u as e,a as r,j as a,C as n,b as i,c as l,d as c,e as o,F as t,f as d,g as m,h as x,i as j,I as u,k as h,B as f,t as p}from"./index-BspH0A2d.js";import{P as g,u as w}from"./useApiRequest-Va7qjswp.js";import{u as y}from"./useFromFieldErrorSpecification-C65AU_gP.js";const b=s.object({username:s.string({required_error:"不可以为空"}).min(2,{message:"不能少于2个字符"}).max(20,{message:"不能超过20个字符"}),password:s.string({required_error:"不可以为空"}).max(50,{message:"不能超过50个字符"})});function N(s){return g("/api/login",{body:s})}function q(){const s=e(),g=r({resolver:p(b)}),{runAsync:q,loading:F}=w(N,{manual:!0,noticeError:!1}),S=y(g);return a.jsx("div",{className:"w-full h-screen flex items-center justify-center px-4",children:a.jsxs(n,{className:"w-full max-w-sm",children:[a.jsxs(i,{children:[a.jsx(l,{className:"text-2xl",children:"登录"}),a.jsx(c,{children:"欢迎登录 Great Wall"})]}),a.jsx(o,{className:"grid gap-4",children:a.jsx(t,{...g,children:a.jsxs("form",{onSubmit:g.handleSubmit((async function(e){await S((()=>q(e))),s("/")})),className:"space-y-8",children:[a.jsx(d,{control:g.control,name:"username",render:({field:s})=>a.jsxs(m,{children:[a.jsx(x,{children:"账号"}),a.jsx(j,{children:a.jsx(u,{...s})}),a.jsx(h,{})]})}),a.jsx(d,{control:g.control,name:"password",render:({field:s})=>a.jsxs(m,{children:[a.jsx(x,{children:"密码"}),a.jsx(j,{children:a.jsx(u,{...s,type:"password"})}),a.jsx(h,{})]})}),a.jsx(f,{type:"submit",loading:F,className:"w-full",children:"登录"})]})})})]})})}export{q as default};
