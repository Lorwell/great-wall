import{a5 as a,u as s,a6 as e,a1 as i,j as t,a2 as n,a3 as r,a4 as o}from"./index-BspH0A2d.js";import{u}from"./useApiRequest-Va7qjswp.js";import{b as c,u as d}from"./index-DtI7gkfQ.js";function l(){const{id:l}=a(),m=s(),p=e(i),{loading:f}=u((async()=>{const a=await c(Number(l));p({baseInfo:{name:a.name,describe:a.describe,priority:a.priority,status:a.status},predicates:{targetConfig:a.targetConfig,predicates:a.predicates}})})),{runAsync:g}=u(d,{manual:!0});return t.jsx("div",{className:"h-full w-full",children:t.jsx(n.Provider,{value:{onSubmit:async function(a){await g(Number(l),a),o.info("应用路由更新成功",{position:"top-center"}),m("/manage/app-routes/list")}},children:t.jsx(r,{title:"更新应用路由",loading:f})})})}export{l as default};
