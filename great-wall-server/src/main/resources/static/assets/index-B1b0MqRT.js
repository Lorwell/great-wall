import{j as e,as as l,u as o}from"./index-Hpy4aKqW.js";import{D as a,R as s,d as n,c as t,a as i}from"./data-table-row-actions-BSTKM4OV.js";import{d as r}from"./dayjs.min-J9D-uYA7.js";import{l as c,a as m}from"./index-B_XFRbBM.js";import{u}from"./useApiRequest-CJy0Cr6c.js";import"./popover-Jb-M4INu.js";import"./separator-BBmaR6nc.js";import"./checkbox-mE3n6oii.js";const d=l=>{const{row:o,column:n,cell:t,table:i,onView:r}=l,c={row:o,column:n,cell:t,table:i},m=[{key:"view",label:"查看",icon:s,onClick:()=>null==r?void 0:r(c)}];return e.jsx(a,{row:o,options:m})},p=({event:o})=>[n(),t({columnId:"type",label:"类型",size:80,enableSorting:!1,cell:({getValue:e})=>{const l=e();return c(l)}}),t({columnId:"name",label:"名称",size:150,enableSorting:!1,cell:({getValue:e})=>e()}),t({columnId:"size",label:"大小",size:100,cell:({getValue:e})=>{const o=e();return l(o,"0B")}}),t({columnId:"lastUpdateTime",label:"最后修改时间",size:150,cell:({getValue:e})=>r(e()).format("YYYY-MM-DD HH:mm:ss")}),{id:"_actions",size:50,cell:({cell:l,column:a,row:s,table:n})=>e.jsx(d,{...o,row:s,cell:l,column:a,table:n})}];function j(){const l=o(),{data:a,loading:s}=u(m);return e.jsx("div",{className:"w-full h-full",children:e.jsx(i,{data:(null==a?void 0:a.records)||[],loading:s,searchColumnId:"name",manual:!1,columns:p({event:{onView:function(e){const o=e.row.original;l(`/manage/logs/type/${o.type.toLowerCase()}/file/${o.name}`)}}}),plusOptions:[]})})}export{j as default};
