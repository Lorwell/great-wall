import{l as e,U as l,j as a,V as t,W as s,X as r,Y as n,Z as i,u as o}from"./index-Hpy4aKqW.js";import{D as c,R as d,d as u,c as p,a as m}from"./data-table-row-actions-BSTKM4OV.js";import{d as x}from"./dayjs.min-J9D-uYA7.js";import{u as h}from"./useApiRequest-CJy0Cr6c.js";import{a as v,s as j}from"./index-CynyV955.js";import{L as f}from"./layout-panel-left-C9l-SufK.js";import"./popover-Jb-M4INu.js";import"./separator-BBmaR6nc.js";import"./checkbox-mE3n6oii.js";
/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=e("Pencil",[["path",{d:"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",key:"5qss01"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]),w=e("ShieldBan",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m4.243 5.21 14.39 12.472",key:"1c9a7c"}]]),g=e=>{const{row:t,column:s,cell:r,table:n,onView:i,onOnline:o,onOffline:u,onEdit:p}=e,m={row:t,column:s,cell:r,table:n},x=t.getValue("status"),h=[{key:"view",label:"查看",icon:d,onClick:()=>null==i?void 0:i(m)},{key:"edit",label:"编辑",icon:b,onClick:()=>null==p?void 0:p(m)}];return l.ONLINE===x?h.push({key:"offline",label:"下线",icon:w,onClick:()=>null==u?void 0:u(m)}):l.OFFLINE===x&&h.push({key:"online",label:"上线",icon:w,onClick:()=>null==o?void 0:o(m)}),a.jsx(c,{row:t,options:h})};
/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function N(e){switch(e){case t.AND:return"与";case t.OR:return"或";default:return""}}function y(e){const{predicates:l}=e;return a.jsx("div",{className:"w-full",children:a.jsxs(s,{children:[a.jsx(r,{children:a.jsx(n,{variant:"secondary",className:"cursor-pointer",children:l.length})}),a.jsx(i,{children:a.jsx("div",{className:"table table-auto border-separate border-spacing-1",children:l.map(((e,l)=>a.jsx(O,{value:e,first:0===l,viewOperator:!0},l)))})})]})})}function O({value:e,first:l=!1,viewOperator:t=!1}){const{predicate:s,operator:r}=e,{type:n}=s;switch(n){case"Host":return a.jsx(C,{value:s,first:l,operator:r,viewOperator:t});case"Cookie":return a.jsx(k,{kvType:"Cookie",value:s,first:l,operator:r,viewOperator:t});case"Header":return a.jsx(k,{kvType:"Header",value:s,first:l,operator:r,viewOperator:t});case"Query":return a.jsx(k,{kvType:"Query",value:s,first:l,operator:r,viewOperator:t});case"Method":return a.jsx(I,{value:s,first:l,operator:r,viewOperator:t});case"Path":return a.jsx(V,{value:s,first:l,operator:r,viewOperator:t});case"RemoteAddr":return a.jsx(z,{value:s,first:l,operator:r,viewOperator:t})}throw new Error(`未知的类型 ${n}`)}function k({kvType:e,value:l,first:t,operator:s,viewOperator:r=!1}){const{name:n,regexp:i}=l;return a.jsxs("div",{className:"table-row",children:[r&&!!s&&a.jsx("div",{className:"table-cell text-left pr-1",children:t?"":N(s)}),a.jsxs("div",{className:"table-cell text-right",children:[e," 匹配规则："]}),a.jsxs("div",{className:"table-cell text-left truncate",children:[n,"=",i]})]})}function C({value:e,first:l,operator:t,viewOperator:s=!1}){const{patterns:r}=e;return a.jsxs("div",{className:"table-row",children:[s&&!!t&&a.jsx("div",{className:"table-cell text-left pr-1",children:l?"":N(t)}),a.jsx("div",{className:"table-cell text-right",children:"Host 匹配规则："}),a.jsx("div",{className:"table-cell text-left truncate",children:r.map(((e,l)=>a.jsxs("span",{children:[e,l+1<r.length&&", "]},l)))})]})}function I({value:e,first:l,operator:t,viewOperator:s=!1}){const{methods:r}=e;return a.jsxs("div",{className:"table-row",children:[s&&!!t&&a.jsx("div",{className:"table-cell text-left pr-1",children:l?"":N(t)}),a.jsx("div",{className:"table-cell text-right",children:"Method 匹配规则："}),a.jsx("div",{className:"table-cell text-left truncate",children:r.map(((e,l)=>a.jsxs("span",{children:[e,l+1<r.length&&", "]},l)))})]})}function V({value:e,first:l,operator:t,viewOperator:s=!1}){const{patterns:r}=e;return a.jsxs("div",{className:"table-row",children:[s&&!!t&&a.jsx("div",{className:"table-cell text-left pr-1",children:l?"":N(t)}),a.jsx("div",{className:"table-cell text-right",children:"Path 匹配规则："}),a.jsx("div",{className:"table-cell text-left truncate",children:r.map(((e,l)=>a.jsxs("span",{children:[e,l+1<r.length&&", "]},l)))})]})}function z({value:e,first:l,operator:t,viewOperator:s=!1}){const{sources:r}=e;return a.jsxs("div",{className:"table-row",children:[s&&!!t&&a.jsx("div",{className:"table-cell text-left pr-1",children:l?"":N(t)}),a.jsx("div",{className:"table-cell text-right",children:"Path 匹配规则："}),a.jsx("div",{className:"table-cell text-left truncate",children:r.map(((e,l)=>a.jsxs("span",{children:[e,l+1<r.length&&", "]},l)))})]})}const Y=({event:e})=>[u(),p({columnId:"name",label:"名称",size:120,enableSorting:!1,cell:({getValue:e})=>e()}),p({columnId:"predicates",label:"路由条件",size:80,enableSorting:!1,cell:({getValue:e})=>{const l=e();return a.jsx(y,{predicates:l})}}),p({columnId:"targetConfig",label:"目标地址",size:200,enableSorting:!1,cell:({getValue:e})=>{const{urls:l}=e();return a.jsxs("div",{className:"w-full flex gap-1",children:[a.jsx("div",{className:"truncate",style:{width:"calc(100% - 25px)"},children:l.map((e=>e.url)).join(", ")}),a.jsxs(s,{children:[a.jsx(r,{children:a.jsx(n,{variant:"secondary",className:"cursor-pointer",children:l.length})}),a.jsx(i,{children:a.jsx("div",{className:"flex flex-col gap-1",children:l.map(((e,l)=>a.jsxs("span",{children:[e.url,"  -  权重：",e.weight]},l)))})})]})]})}}),p({columnId:"priority",label:"优先级",size:100,cell:({getValue:e})=>a.jsx("div",{className:"p-4",children:e()})}),p({columnId:"status",label:"状态",size:80,cell:({getValue:e})=>e()}),p({columnId:"createTime",label:"创建时间",size:150,cell:({getValue:e})=>x(e()).format("YYYY-MM-DD HH:mm:ss")}),p({columnId:"lastUpdateTime",label:"最后修改时间",size:150,cell:({getValue:e})=>x(e()).format("YYYY-MM-DD HH:mm:ss")}),{id:"_actions",size:50,cell:({cell:l,column:t,row:s,table:r})=>a.jsx(g,{...e,row:s,cell:l,column:t,table:r})}];function H(){const e=o(),{data:t,loading:s,run:r}=h(v),{loading:n,runAsync:i}=h(j,{manual:!0});return a.jsx("div",{className:"w-full h-full",children:a.jsx(m,{data:(null==t?void 0:t.records)||[],rowCount:null==t?void 0:t.page.total,searchColumnId:"name",manual:!1,loading:s||n,columns:Y({event:{onView:function(l){const a=l.row.original.id;e(`/manage/app-routes/${a}/preview`)},onEdit:function(l){const a=l.row.original.id;e(`/manage/app-routes/${a}`)},onOffline:async function(e){const a=e.row.original.id;await i(a,l.OFFLINE),r()},onOnline:async function(e){const a=e.row.original.id;await i(a,l.ONLINE),r()}}}),plusOptions:[{label:"新建应用路由",icon:f,onClick:()=>e("/manage/app-routes/add/base-info")}]})})}export{H as default};
