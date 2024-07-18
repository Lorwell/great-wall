import{z as e,aq as s,j as t,C as r,b as a,c as i,ar as o,e as n,S as l,as as c,at as d}from"./index-_AVlRF7Q.js";import{u as m}from"./context-BJgfKdm6.js";import{P as x,G as u}from"./useApiRequest-0CmIx3DW.js";import{U as j,m as h,A as p,C as b,L as y,a as f,X as g,Y as v,b as N,c as w,e as k,f as L,d as W}from"./chart-trr0SnZ4.js";import"./popover-CCzusN6i.js";const K=e.object({startTime:e.string({required_error:"不可以为空"}),upTime:e.string({required_error:"不可以为空"})}),q=e.object({processCpuLoad:e.string({required_error:"不可以为空"})}),S=e.object({value:e.string({required_error:"不可以为空"})}),_=e.object({value:e.number({required_error:"不可以为空"})}),C=s(e.object({unit:e.string({required_error:"不可以为空"}),use:e.number().optional().nullable(),committed:e.number().optional().nullable(),max:e.number().optional().nullable()})),z=s(e.object({unit:e.string({required_error:"不可以为空"}),cpuLoad:e.number().optional().nullable(),processCpuLoad:e.number().optional().nullable()})),T=s(e.object({unit:e.string({required_error:"不可以为空"}),new:e.number().optional().nullable(),runnable:e.number().optional().nullable(),blocked:e.number().optional().nullable(),waiting:e.number().optional().nullable(),timedWaiting:e.number().optional().nullable(),terminated:e.number().optional().nullable()})),F=s(e.object({unit:e.string({required_error:"不可以为空"}),total:e.number().optional().nullable(),count:e.number().optional().nullable(),unloaded:e.number().optional().nullable()})),R=e.object({label:e.string({required_error:"不可以为空"}),key:e.string({required_error:"不可以为空"})}),E=e.record(e.string({required_error:"不可以为空"}),e.union([e.string({required_error:"不可以为空"}),e.number({required_error:"不可以为空"})])),M=e.object({mapping:e.array(R),data:e.array(E)});function A(e){return x("/api/system-monitor-metrics/line/head-memory",{body:e,resultSchema:C})}function G(e){return x("/api/system-monitor-metrics/line/non-head-memory",{body:e,resultSchema:C})}function I(e){return x("/api/system-monitor-metrics/line/direct-memory",{body:e,resultSchema:C})}function D(e){return x("/api/system-monitor-metrics/line/gc-count",{body:e,resultSchema:M})}function U(e){return x("/api/system-monitor-metrics/line/gc-time",{body:e,resultSchema:M})}function $(){const{data:e,loading:s}=m((()=>u("/api/system-monitor-metrics/up-time",{resultSchema:K})));return t.jsxs(r,{children:[t.jsxs(a,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[t.jsx(i,{className:"text-sm font-medium",children:"运行时间"}),s?t.jsx(o,{className:"w-4 h-4"}):t.jsx(j,{className:"w-4 h-4"})]}),t.jsxs(n,{children:[t.jsx("div",{className:"text-2xl font-bold",children:(null==e?void 0:e.upTime)||"-"}),t.jsx("p",{className:"text-xs text-muted-foreground",children:"系统启动时间至今"})]})]})}function B(){const{data:e,loading:s}=m((()=>u("/api/system-monitor-metrics/non-head-memory",{resultSchema:S})));return t.jsxs(r,{children:[t.jsxs(a,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[t.jsx(i,{className:"text-sm font-medium",children:"非堆内存"}),s?t.jsx(o,{className:"w-4 h-4"}):t.jsx(j,{className:"w-4 h-4"})]}),t.jsxs(n,{children:[t.jsx("div",{className:"text-2xl font-bold",children:(null==e?void 0:e.value)||0}),t.jsx("p",{className:"text-xs text-muted-foreground",children:"当前直接内存用量"})]})]})}function P(){const{data:e,loading:s}=m((()=>u("/api/system-monitor-metrics/head-memory",{resultSchema:S})));return t.jsxs(r,{children:[t.jsxs(a,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[t.jsx(i,{className:"text-sm font-medium",children:"堆内存"}),s?t.jsx(o,{className:"w-4 h-4"}):t.jsx(j,{className:"w-4 h-4"})]}),t.jsxs(n,{children:[t.jsx("div",{className:"text-2xl font-bold",children:(null==e?void 0:e.value)||0}),t.jsx("p",{className:"text-xs text-muted-foreground",children:"当前直接内存用量"})]})]})}function O(){const{data:e,loading:s}=m((()=>u("/api/system-monitor-metrics/direct-head-memory",{resultSchema:S})));return t.jsxs(r,{children:[t.jsxs(a,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[t.jsx(i,{className:"text-sm font-medium",children:"直接内存"}),s?t.jsx(o,{className:"w-4 h-4"}):t.jsx(j,{className:"w-4 h-4"})]}),t.jsxs(n,{children:[t.jsx("div",{className:"text-2xl font-bold",children:(null==e?void 0:e.value)||0}),t.jsx("p",{className:"text-xs text-muted-foreground",children:"当前直接内存用量"})]})]})}function X(){const{data:e,loading:s}=m((()=>u("/api/system-monitor-metrics/process-cpu",{resultSchema:q})));return t.jsxs(r,{children:[t.jsxs(a,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[t.jsx(i,{className:"text-sm font-medium",children:"cpu使用率"}),s?t.jsx(o,{className:"w-4 h-4"}):t.jsx(j,{className:"w-4 h-4"})]}),t.jsxs(n,{children:[t.jsx("div",{className:"text-2xl font-bold",children:(null==e?void 0:e.processCpuLoad)||"-"}),t.jsx("p",{className:"text-xs text-muted-foreground",children:"当前cpu使用率"})]})]})}function Y(){const{data:e,loading:s}=m((()=>u("/api/system-monitor-metrics/thread-total",{resultSchema:_})));return t.jsxs(r,{children:[t.jsxs(a,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[t.jsx(i,{className:"text-sm font-medium",children:"线程总数"}),s?t.jsx(o,{className:"w-4 h-4"}):t.jsx(j,{className:"w-4 h-4"})]}),t.jsxs(n,{children:[t.jsx("div",{className:"text-2xl font-bold",children:(null==e?void 0:e.value)||0}),t.jsx("p",{className:"text-xs text-muted-foreground",children:"当前系统线程总数"})]})]})}const H={use:{label:"已使用",color:"hsl(var(--chart-1))"},committed:{label:"已提交",color:"hsl(var(--chart-2))"},max:{label:"最大值",color:"hsl(var(--chart-3))"}};function J({size:e,title:s,service:l}){const{data:d,loading:x}=m((({dateRange:s})=>l({...s,...h(e.width-70,s)}))),u=(null==d?void 0:d.records)||[];return t.jsxs(r,{children:[t.jsxs(a,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[t.jsx(i,{className:"text-sm font-medium",children:s}),x?t.jsx(o,{className:"w-4 h-4"}):t.jsx(p,{className:"w-4 h-4"})]}),t.jsx(n,{children:t.jsx(b,{config:H,style:{height:"200px",width:"100%"},children:t.jsxs(y,{accessibilityLayer:!0,data:u,margin:{left:0,right:0,top:0},children:[t.jsx(f,{vertical:!1}),t.jsx(g,{dataKey:"unit",tickLine:!1,axisLine:!1,tickMargin:8,minTickGap:32}),t.jsx(v,{tickFormatter:e=>c(e,"-1")}),t.jsx(N,{content:t.jsx(w,{className:"w-[150px]",valueFormatter:e=>c(e,"-1")})}),t.jsx(k,{content:t.jsx(L,{})}),t.jsx(W,{dataKey:"use",type:"monotone",stroke:"var(--color-use)",strokeWidth:2,dot:!1}),t.jsx(W,{dataKey:"committed",type:"monotone",stroke:"var(--color-committed)",strokeWidth:2,dot:!1}),t.jsx(W,{dataKey:"max",type:"monotone",stroke:"var(--color-max)",strokeWidth:2,dot:!1})]})})})]})}function Q(e){return t.jsx(l,{children:s=>t.jsx(J,{...e,size:s})})}const V={cpuLoad:{label:"系统cpu负载",color:"hsl(var(--chart-1))"},processCpuLoad:{label:"进程cpu负载",color:"hsl(var(--chart-2))"}};function Z({size:e}){const{data:s,loading:l}=m((({dateRange:s})=>{return t={...s,...h(e.width-70,s)},x("/api/system-monitor-metrics/line/cpu",{body:t,resultSchema:z});var t})),c=(null==s?void 0:s.records)||[];return t.jsxs(r,{children:[t.jsxs(a,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[t.jsx(i,{className:"text-sm font-medium",children:"CPU"}),l?t.jsx(o,{className:"w-4 h-4"}):t.jsx(p,{className:"w-4 h-4"})]}),t.jsx(n,{children:t.jsx(b,{config:V,style:{height:"250px",width:"100%"},children:t.jsxs(y,{accessibilityLayer:!0,data:c,margin:{left:0,right:0,top:0},children:[t.jsx(f,{vertical:!1}),t.jsx(g,{dataKey:"unit",tickLine:!1,axisLine:!1,tickMargin:8}),t.jsx(v,{tickFormatter:e=>d(e,"-")}),t.jsx(N,{content:t.jsx(w,{className:"w-[150px]",valueFormatter:e=>d(e,"-")})}),t.jsx(k,{content:t.jsx(L,{})}),t.jsx(W,{dataKey:"cpuLoad",type:"monotone",stroke:"var(--color-cpuLoad)",strokeWidth:2,dot:!1}),t.jsx(W,{dataKey:"processCpuLoad",type:"monotone",stroke:"var(--color-processCpuLoad)",strokeWidth:2,dot:!1})]})})})]})}function ee(){return t.jsx(l,{children:e=>t.jsx(Z,{size:e})})}const se={new:{label:"NEW",color:"hsl(var(--chart-1))"},runnable:{label:"RUNNABLE",color:"hsl(var(--chart-2))"},blocked:{label:"BLOCKED",color:"hsl(var(--chart-3))"},waiting:{label:"WAITING",color:"hsl(var(--chart-4))"},timedWaiting:{label:"TIMED_WAITING",color:"hsl(var(--chart-5))"},terminated:{label:"TERMINATED",color:"hsl(var(--chart-6))"}};function te({size:e}){const{data:s,loading:l}=m((({dateRange:s})=>{return t={...s,...h(e.width-70,s)},x("/api/system-monitor-metrics/line/thread",{body:t,resultSchema:T});var t})),c=(null==s?void 0:s.records)||[];return t.jsxs(r,{children:[t.jsxs(a,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[t.jsx(i,{className:"text-sm font-medium",children:"线程"}),l?t.jsx(o,{className:"w-4 h-4"}):t.jsx(p,{className:"w-4 h-4"})]}),t.jsx(n,{children:t.jsx(b,{config:se,style:{height:"200px",width:"100%"},children:t.jsxs(y,{accessibilityLayer:!0,data:c,margin:{left:0,right:0,top:0},children:[t.jsx(f,{vertical:!1}),t.jsx(g,{dataKey:"unit",tickLine:!1,axisLine:!1,tickMargin:8}),t.jsx(v,{}),t.jsx(N,{content:t.jsx(w,{className:"w-[150px]"})}),t.jsx(k,{content:t.jsx(L,{})}),t.jsx(W,{dataKey:"new",type:"monotone",stroke:"var(--color-new)",strokeWidth:2,dot:!1}),t.jsx(W,{dataKey:"runnable",type:"monotone",stroke:"var(--color-runnable)",strokeWidth:2,dot:!1}),t.jsx(W,{dataKey:"blocked",type:"monotone",stroke:"var(--color-blocked)",strokeWidth:2,dot:!1}),t.jsx(W,{dataKey:"waiting",type:"monotone",stroke:"var(--color-waiting)",strokeWidth:2,dot:!1}),t.jsx(W,{dataKey:"timedWaiting",type:"monotone",stroke:"var(--color-timedWaiting)",strokeWidth:2,dot:!1}),t.jsx(W,{dataKey:"terminated",type:"monotone",stroke:"var(--color-terminated)",strokeWidth:2,dot:!1})]})})})]})}function re(){return t.jsx(l,{children:e=>t.jsx(te,{size:e})})}const ae={total:{label:"总加载类",color:"hsl(var(--chart-1))"},count:{label:"加载的类",color:"hsl(var(--chart-2))"},unloaded:{label:"卸载的类",color:"hsl(var(--chart-3))"}};function ie({size:e}){const{data:s,loading:l}=m((({dateRange:s})=>{return t={...s,...h(e.width-70,s)},x("/api/system-monitor-metrics/line/loaded-class",{body:t,resultSchema:F});var t})),c=(null==s?void 0:s.records)||[];return t.jsxs(r,{children:[t.jsxs(a,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[t.jsx(i,{className:"text-sm font-medium",children:"类加载"}),l?t.jsx(o,{className:"w-4 h-4"}):t.jsx(p,{className:"w-4 h-4"})]}),t.jsx(n,{children:t.jsx(b,{config:ae,style:{height:"200px",width:"100%"},children:t.jsxs(y,{accessibilityLayer:!0,data:c,margin:{left:0,right:0,top:0},children:[t.jsx(f,{vertical:!1}),t.jsx(g,{dataKey:"unit",tickLine:!1,axisLine:!1,tickMargin:8}),t.jsx(v,{}),t.jsx(N,{content:t.jsx(w,{className:"w-[150px]"})}),t.jsx(k,{content:t.jsx(L,{})}),t.jsx(W,{dataKey:"total",type:"monotone",stroke:"var(--color-total)",strokeWidth:2,dot:!1}),t.jsx(W,{dataKey:"count",type:"monotone",stroke:"var(--color-count)",strokeWidth:2,dot:!1}),t.jsx(W,{dataKey:"unloaded",type:"monotone",stroke:"var(--color-unloaded)",strokeWidth:2,dot:!1})]})})})]})}function oe(){return t.jsx(l,{children:e=>t.jsx(ie,{size:e})})}function ne({size:e,title:s,service:l,tickFormatter:c}){const{data:d,loading:x}=m((({dateRange:s})=>l({...s,...h(e.width-70,s)}))),u=(null==d?void 0:d.data)||[],j=(null==d?void 0:d.mapping)||[],K={};return j.forEach(((e,s)=>{K[e.key]={label:e.label,color:`hsl(var(--chart-${s+1}))`}})),t.jsxs(r,{children:[t.jsxs(a,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[t.jsx(i,{className:"text-sm font-medium",children:s}),x?t.jsx(o,{className:"w-4 h-4"}):t.jsx(p,{className:"w-4 h-4"})]}),t.jsx(n,{children:t.jsx(b,{config:K,style:{height:"280px",width:"100%"},children:t.jsxs(y,{accessibilityLayer:!0,data:u,margin:{left:0,right:0,top:0},children:[t.jsx(f,{vertical:!1}),t.jsx(g,{dataKey:"unit",tickLine:!1,axisLine:!1,tickMargin:8}),t.jsx(v,{tickFormatter:(e,s)=>(null==c?void 0:c(e))||e}),t.jsx(N,{content:t.jsx(w,{className:"w-[200px]",valueFormatter:e=>(null==c?void 0:c(e))||e})}),t.jsx(k,{content:t.jsx(L,{})}),null==j?void 0:j.map((e=>t.jsx(W,{dataKey:e.key,type:"monotone",stroke:`var(--color-${e.key})`,strokeWidth:2,dot:!1},e.key)))]})})})]})}function le(e){return t.jsx(l,{children:s=>t.jsx(ne,{...e,size:s})})}function ce(){return t.jsxs("div",{className:"w-full h-full space-y-4",children:[t.jsxs("div",{className:"grid gap-4 md:grid-cols-3 lg:grid-cols-6",children:[t.jsx($,{}),t.jsx(X,{}),t.jsx(P,{}),t.jsx(B,{}),t.jsx(O,{}),t.jsx(Y,{})]}),t.jsx("div",{className:"grid gap-4 grid-cols-1",children:t.jsx(ee,{})}),t.jsxs("div",{className:"grid gap-4 grid-cols-3",children:[t.jsx(Q,{title:"堆内存",service:A}),t.jsx(Q,{title:"非堆内存",service:G}),t.jsx(Q,{title:"直接内存",service:I})]}),t.jsxs("div",{className:"grid gap-4 grid-cols-2",children:[t.jsx(re,{}),t.jsx(oe,{})]}),t.jsxs("div",{className:"grid gap-4 grid-cols-2",children:[t.jsx(le,{title:"GC 次数",service:D}),t.jsx(le,{title:"GC 时间",service:U,tickFormatter:e=>`${e}ms`})]})]})}export{ce as default};