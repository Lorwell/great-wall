import{a2 as s,r as a,u as n,a3 as t,j as e,a4 as i,a5 as o,A as r}from"./index-iVrnBSHy.js";import{c as u}from"./index-CPdBkCjG.js";import{u as c}from"./useApiRequest-CN88ul-N.js";function f(){const f=n(),{runAsync:l}=c(u,{manual:!0});return function(n){const t=s(n);a.useEffect((()=>{t()}),[])}(t),e.jsx("div",{className:"h-full w-full",children:e.jsx(i.Provider,{value:{onSubmit:async function(s){await l(s),r.info("应用路由添加成功",{position:"top-center"}),f("/manage/app-routes/list")}},children:e.jsx(o,{title:"新建应用路由"})})})}export{f as default};
