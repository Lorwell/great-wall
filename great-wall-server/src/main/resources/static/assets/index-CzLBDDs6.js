import{a0 as s,r as a,u as n,a1 as t,j as e,a2 as i,a3 as o,a4 as r}from"./index-BspH0A2d.js";import{c as u}from"./index-DtI7gkfQ.js";import{u as c}from"./useApiRequest-Va7qjswp.js";function f(){const f=n(),{runAsync:l}=c(u,{manual:!0});return function(n){const t=s(n);a.useEffect((()=>{t()}),[])}(t),e.jsx("div",{className:"h-full w-full",children:e.jsx(i.Provider,{value:{onSubmit:async function(s){await l(s),r.info("应用路由添加成功",{position:"top-center"}),f("/manage/app-routes/list")}},children:e.jsx(o,{title:"新建应用路由"})})})}export{f as default};