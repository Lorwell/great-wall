import{aA as a,u as s,aB as e,ax as i,j as t,ay as r,az as n,A as o}from"./index-CS3RdbcM.js";import{u}from"./useApiRequest-BZsjsfZc.js";import{b as c,u as l}from"./index-Cfsv_-_h.js";function d(){const{id:d}=a(),m=s(),p=e(i),{loading:f}=u((async()=>{const a=await c(Number(d));p({baseInfo:{name:a.name,describe:a.describe,priority:a.priority,status:a.status},predicates:{urls:a.urls,predicates:a.predicates}})})),{runAsync:b}=u(l,{manual:!0});return t.jsx("div",{className:"h-full w-full",children:t.jsx(r.Provider,{value:{onSubmit:async function(a){await b(Number(d),a),o.info("应用路由更新成功",{position:"top-center"}),m("/manage/app-routes/list")}},children:t.jsx(n,{title:"更新应用路由",loading:f})})})}export{d as default};
