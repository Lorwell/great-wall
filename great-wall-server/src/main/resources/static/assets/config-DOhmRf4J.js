import{u as s,H as e,a as n,t as r,j as i,F as a,f as l,g as t,h as o,i as c,I as d,k as x,bf as j,B as m}from"./index-_AVlRF7Q.js";import{T as f,o as h,a as u}from"./index-B_n0Teha.js";import{u as p}from"./useApiRequest-0CmIx3DW.js";import{u as g}from"./useFromFieldErrorSpecification-Dgbnif_r.js";function y(){const y=s(),{state:b}=e(),v=b,N=n({resolver:r(h),defaultValues:{type:f.Osfipin,...(null==v?void 0:v.type)===f.Osfipin?v:{}}}),{loading:k,runAsync:w}=p(u,{manual:!0,noticeError:!1}),A=g(N);return i.jsxs("div",{className:"w-[480px] flex flex-col gap-4 ml-[80px]",children:[i.jsx("div",{className:"text-lg font-bold",children:"来此加密"}),i.jsx("a",{className:"text-sm text-muted-foreground",target:"_blank",href:"https://letsencrypt.osfipin.com/",children:"https://letsencrypt.osfipin.com/"}),i.jsx("div",{children:i.jsx(a,{...N,children:i.jsxs("form",{onSubmit:N.handleSubmit((async function(s){await A((()=>w({config:s}))),y("/manage/tls")})),className:"space-y-8",children:[i.jsx(l,{control:N.control,name:"user",render:({field:s})=>i.jsxs(t,{children:[i.jsx(o,{children:"账户名"}),i.jsx(c,{children:i.jsx(d,{...s})}),i.jsx(x,{}),i.jsx(j,{children:"注册的邮箱或者手机号"})]})}),i.jsx(l,{control:N.control,name:"autoId",render:({field:s})=>i.jsxs(t,{children:[i.jsx(o,{children:"自动申请id"}),i.jsx(c,{children:i.jsx(d,{...s})}),i.jsx(x,{}),i.jsx(j,{children:"指定证书开启自动重申后，填入对应的自动申请id"})]})}),i.jsx(l,{control:N.control,name:"token",render:({field:s})=>i.jsxs(t,{children:[i.jsx(o,{children:"接口凭证"}),i.jsx(c,{children:i.jsx(d,{...s})}),i.jsx(x,{}),i.jsx(j,{children:"在管理界面 - 我的 - API接口页面进行创建Token"})]})}),i.jsx(m,{type:"submit",loading:k,className:"w-full",variant:"secondary",children:"提交"})]})})})]})}export{y as default};
