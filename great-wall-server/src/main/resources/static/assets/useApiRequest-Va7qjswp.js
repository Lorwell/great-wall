var t=Object.defineProperty,e=(e,n,r)=>(((e,n,r)=>{n in e?t(e,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[n]=r})(e,"symbol"!=typeof n?n+"":n,r),r);import{r as n,ae as r,af as o,bi as i,bj as a,bk as c,aE as u,ac as s,ad as l,bl as f,aG as d,bm as p,aa as h,b7 as v,bn as y,bo as m,bp as g,u as b,a4 as w}from"./index-BspH0A2d.js";const j=(S=n.useEffect,function(t,e){var r=n.useRef(!1);S((function(){return function(){r.current=!1}}),[]),S((function(){if(r.current)return t();r.current=!0}),e)});var S,O=function(t,e){var i=e.manual,a=e.ready,c=void 0===a||a,u=e.defaultParams,s=void 0===u?[]:u,l=e.refreshDeps,f=void 0===l?[]:l,d=e.refreshDepsAction,p=n.useRef(!1);return p.current=!1,j((function(){!i&&c&&(p.current=!0,t.run.apply(t,r([],o(s),!1)))}),[c]),j((function(){p.current||i||(p.current=!0,d?d():t.refresh())}),r([],o(f),!1)),{onBefore:function(){if(!c)return{stopNow:!0}}}};function E(t,e){var r=n.useRef({deps:e,obj:void 0,initialized:!1}).current;return!1!==r.initialized&&function(t,e){if(t===e)return!0;for(var n=0;n<t.length;n++)if(!Object.is(t[n],e[n]))return!1;return!0}(r.deps,e)||(r.deps=e,r.obj=t(),r.initialized=!0),r.obj}O.onInit=function(t){var e=t.ready,n=void 0===e||e;return{loading:!t.manual&&n}};var P=new Map,A=new Map,R={},T=function(t,e){return R[t]||(R[t]=[]),R[t].push(e),function(){var n=R[t].indexOf(e);R[t].splice(n,1)}},F=function(t,e){var c=e.cacheKey,u=e.cacheTime,s=void 0===u?3e5:u,l=e.staleTime,f=void 0===l?0:l,d=e.setCache,p=e.getCache,h=n.useRef(),v=n.useRef(),y=function(t,e){d?d(e):function(t,e,n){var r=P.get(t);(null==r?void 0:r.timer)&&clearTimeout(r.timer);var o=void 0;e>-1&&(o=setTimeout((function(){P.delete(t)}),e)),P.set(t,i(i({},n),{timer:o}))}(t,s,e),function(t,e){R[t]&&R[t].forEach((function(t){return t(e)}))}(t,e.data)},m=function(t,e){return void 0===e&&(e=[]),p?p(e):function(t){return P.get(t)}(t)};return E((function(){if(c){var e=m(c);e&&Object.hasOwnProperty.call(e,"data")&&(t.state.data=e.data,t.state.params=e.params,(-1===f||(new Date).getTime()-e.time<=f)&&(t.state.loading=!1)),h.current=T(c,(function(e){t.setState({data:e})}))}}),[]),a((function(){var t;null===(t=h.current)||void 0===t||t.call(h)})),c?{onBefore:function(t){var e=m(c,t);return e&&Object.hasOwnProperty.call(e,"data")?-1===f||(new Date).getTime()-e.time<=f?{loading:!1,data:null==e?void 0:e.data,error:void 0,returnNow:!0}:{data:null==e?void 0:e.data,error:void 0}:{}},onRequest:function(t,e){var n=function(t){return A.get(t)}(c);return n&&n!==v.current||(n=t.apply(void 0,r([],o(e),!1)),v.current=n,function(t,e){A.set(t,e),e.then((function(e){return A.delete(t),e})).catch((function(){A.delete(t)}))}(c,n)),{servicePromise:n}},onSuccess:function(e,n){var r;c&&(null===(r=h.current)||void 0===r||r.call(h),y(c,{data:e,params:n,time:(new Date).getTime()}),h.current=T(c,(function(e){t.setState({data:e})})))},onMutate:function(e){var n;c&&(null===(n=h.current)||void 0===n||n.call(h),y(c,{data:e,params:t.state.params,time:(new Date).getTime()}),h.current=T(c,(function(e){t.setState({data:e})})))}}:{}},x=function(t,e){var i=e.debounceWait,a=e.debounceLeading,u=e.debounceTrailing,s=e.debounceMaxWait,l=n.useRef(),f=n.useMemo((function(){var t={};return void 0!==a&&(t.leading=a),void 0!==u&&(t.trailing=u),void 0!==s&&(t.maxWait=s),t}),[a,u,s]);return n.useEffect((function(){if(i){var e=t.runAsync.bind(t);return l.current=c((function(t){t()}),i,f),t.runAsync=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new Promise((function(n,i){var a;null===(a=l.current)||void 0===a||a.call(l,(function(){e.apply(void 0,r([],o(t),!1)).then(n).catch(i)}))}))},function(){var n;null===(n=l.current)||void 0===n||n.cancel(),t.runAsync=e}}}),[i,f]),i?{onCancel:function(){var t;null===(t=l.current)||void 0===t||t.cancel()}}:{}},k=function(t,e){var r=e.loadingDelay,o=e.ready,i=n.useRef();if(!r)return{};var a=function(){i.current&&clearTimeout(i.current)};return{onBefore:function(){return a(),!1!==o&&(i.current=setTimeout((function(){t.setState({loading:!0})}),r)),{loading:!1}},onFinally:function(){a()},onCancel:function(){a()}}},$=!("undefined"==typeof window||!window.document||!window.document.createElement);function C(){return!$||"hidden"!==document.visibilityState}var N=[];if($){window.addEventListener("visibilitychange",(function(){if(C())for(var t=0;t<N.length;t++){(0,N[t])()}}),!1)}var I=function(t,e){var r=e.pollingInterval,o=e.pollingWhenHidden,i=void 0===o||o,a=e.pollingErrorRetryCount,c=void 0===a?-1:a,u=n.useRef(),s=n.useRef(),l=n.useRef(0),f=function(){var t;u.current&&clearTimeout(u.current),null===(t=s.current)||void 0===t||t.call(s)};return j((function(){r||f()}),[r]),r?{onBefore:function(){f()},onError:function(){l.current+=1},onSuccess:function(){l.current=0},onFinally:function(){-1===c||-1!==c&&l.current<=c?u.current=setTimeout((function(){var e;i||C()?t.refresh():s.current=(e=function(){t.refresh()},N.push(e),function(){var t=N.indexOf(e);N.splice(t,1)})}),r):l.current=0},onCancel:function(){f()}}:{}};var U=[];if($){var B=function(){if(C()&&(!$||void 0===navigator.onLine||navigator.onLine))for(var t=0;t<U.length;t++){(0,U[t])()}};window.addEventListener("visibilitychange",B,!1),window.addEventListener("focus",B,!1)}var H=function(t,e){var i=e.refreshOnWindowFocus,c=e.focusTimespan,u=void 0===c?5e3:c,s=n.useRef(),l=function(){var t;null===(t=s.current)||void 0===t||t.call(s)};return n.useEffect((function(){if(i){var e=(a=t.refresh.bind(t),c=u,f=!1,function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];f||(f=!0,a.apply(void 0,r([],o(t),!1)),setTimeout((function(){f=!1}),c))});s.current=(n=function(){e()},U.push(n),function(){var t=U.indexOf(n);t>-1&&U.splice(t,1)})}var n,a,c,f;return function(){l()}}),[i,u]),a((function(){l()})),{}},L=function(t,e){var r=e.retryInterval,o=e.retryCount,i=n.useRef(),a=n.useRef(0),c=n.useRef(!1);return o?{onBefore:function(){c.current||(a.current=0),c.current=!1,i.current&&clearTimeout(i.current)},onSuccess:function(){a.current=0},onError:function(){if(a.current+=1,-1===o||a.current<=o){var e=null!=r?r:Math.min(1e3*Math.pow(2,a.current),3e4);i.current=setTimeout((function(){c.current=!0,t.refresh()}),e)}else a.current=0},onCancel:function(){a.current=0,i.current&&clearTimeout(i.current)}}:{}},q=function(t,e){var i=e.throttleWait,a=e.throttleLeading,c=e.throttleTrailing,s=n.useRef(),l={};return void 0!==a&&(l.leading=a),void 0!==c&&(l.trailing=c),n.useEffect((function(){if(i){var e=t.runAsync.bind(t);return s.current=u((function(t){t()}),i,l),t.runAsync=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new Promise((function(n,i){var a;null===(a=s.current)||void 0===a||a.call(s,(function(){e.apply(void 0,r([],o(t),!1)).then(n).catch(i)}))}))},function(){var n;t.runAsync=e,null===(n=s.current)||void 0===n||n.cancel()}}}),[i,a,c]),i?{onCancel:function(){var t;null===(t=s.current)||void 0===t||t.cancel()}}:{}},D=function(t){n.useEffect((function(){null==t||t()}),[])},M=function(){var t=o(n.useState({}),2)[1];return n.useCallback((function(){return t({})}),[])},W=function(){function t(t,e,n,r){void 0===r&&(r={}),this.serviceRef=t,this.options=e,this.subscribe=n,this.initState=r,this.count=0,this.state={loading:!1,params:void 0,data:void 0,error:void 0},this.state=i(i(i({},this.state),{loading:!e.manual}),r)}return t.prototype.setState=function(t){void 0===t&&(t={}),this.state=i(i({},this.state),t),this.subscribe()},t.prototype.runPluginHandler=function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];var i=this.pluginImpls.map((function(n){var i;return null===(i=n[t])||void 0===i?void 0:i.call.apply(i,r([n],o(e),!1))})).filter(Boolean);return Object.assign.apply(Object,r([{}],o(i),!1))},t.prototype.runAsync=function(){for(var t,e,n,a,c,u,d,p,h,v,y=[],m=0;m<arguments.length;m++)y[m]=arguments[m];return s(this,void 0,void 0,(function(){var s,m,g,b,w,j,S,O,E,P,A;return l(this,(function(l){switch(l.label){case 0:if(this.count+=1,s=this.count,m=this.runPluginHandler("onBefore",y),g=m.stopNow,b=void 0!==g&&g,w=m.returnNow,j=void 0!==w&&w,S=f(m,["stopNow","returnNow"]),b)return[2,new Promise((function(){}))];if(this.setState(i({loading:!0,params:y},S)),j)return[2,Promise.resolve(S.data)];null===(e=(t=this.options).onBefore)||void 0===e||e.call(t,y),l.label=1;case 1:return l.trys.push([1,3,,4]),(O=this.runPluginHandler("onRequest",this.serviceRef.current,y).servicePromise)||(O=(A=this.serviceRef).current.apply(A,r([],o(y),!1))),[4,O];case 2:return E=l.sent(),s!==this.count?[2,new Promise((function(){}))]:(this.setState({data:E,error:void 0,loading:!1}),null===(a=(n=this.options).onSuccess)||void 0===a||a.call(n,E,y),this.runPluginHandler("onSuccess",E,y),null===(u=(c=this.options).onFinally)||void 0===u||u.call(c,y,E,void 0),s===this.count&&this.runPluginHandler("onFinally",y,E,void 0),[2,E]);case 3:if(P=l.sent(),s!==this.count)return[2,new Promise((function(){}))];throw this.setState({error:P,loading:!1}),null===(p=(d=this.options).onError)||void 0===p||p.call(d,P,y),this.runPluginHandler("onError",P,y),null===(v=(h=this.options).onFinally)||void 0===v||v.call(h,y,void 0,P),s===this.count&&this.runPluginHandler("onFinally",y,void 0,P),P;case 4:return[2]}}))}))},t.prototype.run=function(){for(var t=this,e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];this.runAsync.apply(this,r([],o(e),!1)).catch((function(e){t.options.onError}))},t.prototype.cancel=function(){this.count+=1,this.setState({loading:!1}),this.runPluginHandler("onCancel")},t.prototype.refresh=function(){this.run.apply(this,r([],o(this.state.params||[]),!1))},t.prototype.refreshAsync=function(){return this.runAsync.apply(this,r([],o(this.state.params||[]),!1))},t.prototype.mutate=function(t){var e=d(t)?t(this.state.data):t;this.runPluginHandler("onMutate",e),this.setState({data:e})},t}();function z(t,e,n){return function(t,e,n){void 0===e&&(e={}),void 0===n&&(n=[]);var c=e.manual,u=void 0!==c&&c,s=f(e,["manual"]),l=i({manual:u},s),d=p(t),v=M(),y=E((function(){var t=n.map((function(t){var e;return null===(e=null==t?void 0:t.onInit)||void 0===e?void 0:e.call(t,l)})).filter(Boolean);return new W(d,l,v,Object.assign.apply(Object,r([{}],o(t),!1)))}),[]);return y.options=l,y.pluginImpls=n.map((function(t){return t(y,l)})),D((function(){if(!u){var t=y.state.params||e.defaultParams||[];y.run.apply(y,r([],o(t),!1))}})),a((function(){y.cancel()})),{loading:y.state.loading,data:y.state.data,error:y.state.error,params:y.state.params||[],cancel:h(y.cancel.bind(y)),refresh:h(y.refresh.bind(y)),refreshAsync:h(y.refreshAsync.bind(y)),run:h(y.run.bind(y)),runAsync:h(y.runAsync.bind(y)),mutate:h(y.mutate.bind(y))}}(t,e,r(r([],o([]),!1),[x,k,I,H,q,O,F,L],!1))}const J="%[a-f0-9]{2}",_=new RegExp("("+J+")|([^%]+?)","gi"),G=new RegExp("("+J+")+","gi");function K(t,e){try{return[decodeURIComponent(t.join(""))]}catch{}if(1===t.length)return t;e=e||1;const n=t.slice(0,e),r=t.slice(e);return Array.prototype.concat.call([],K(n),K(r))}function Q(t){try{return decodeURIComponent(t)}catch{let e=t.match(_)||[];for(let n=1;n<e.length;n++)e=(t=K(e,n).join("")).match(_)||[];return t}}function V(t){if("string"!=typeof t)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof t+"`");try{return decodeURIComponent(t)}catch{return function(t){const e={"%FE%FF":"��","%FF%FE":"��"};let n=G.exec(t);for(;n;){try{e[n[0]]=decodeURIComponent(n[0])}catch{const t=Q(n[0]);t!==n[0]&&(e[n[0]]=t)}n=G.exec(t)}e["%C2"]="�";const r=Object.keys(e);for(const o of r)t=t.replace(new RegExp(o,"g"),e[o]);return t}(t)}}function X(t,e){if("string"!=typeof t||"string"!=typeof e)throw new TypeError("Expected the arguments to be of type `string`");if(""===t||""===e)return[];const n=t.indexOf(e);return-1===n?[]:[t.slice(0,n),t.slice(n+e.length)]}function Y(t,e){const n={};if(Array.isArray(e))for(const r of e){const e=Object.getOwnPropertyDescriptor(t,r);(null==e?void 0:e.enumerable)&&Object.defineProperty(n,r,e)}else for(const r of Reflect.ownKeys(t)){const o=Object.getOwnPropertyDescriptor(t,r);if(o.enumerable){e(r,t[r],t)&&Object.defineProperty(n,r,o)}}return n}const Z=t=>null==t,tt=t=>encodeURIComponent(t).replaceAll(/[!'()*]/g,(t=>`%${t.charCodeAt(0).toString(16).toUpperCase()}`)),et=Symbol("encodeFragmentIdentifier");function nt(t){if("string"!=typeof t||1!==t.length)throw new TypeError("arrayFormatSeparator must be single character string")}function rt(t,e){return e.encode?e.strict?tt(t):encodeURIComponent(t):t}function ot(t,e){return e.decode?V(t):t}function it(t){return Array.isArray(t)?t.sort():"object"==typeof t?it(Object.keys(t)).sort(((t,e)=>Number(t)-Number(e))).map((e=>t[e])):t}function at(t){const e=t.indexOf("#");return-1!==e&&(t=t.slice(0,e)),t}function ct(t,e){return e.parseNumbers&&!Number.isNaN(Number(t))&&"string"==typeof t&&""!==t.trim()?t=Number(t):!e.parseBooleans||null===t||"true"!==t.toLowerCase()&&"false"!==t.toLowerCase()||(t="true"===t.toLowerCase()),t}function ut(t){const e=(t=at(t)).indexOf("?");return-1===e?"":t.slice(e+1)}function st(t,e){nt((e={decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1,...e}).arrayFormatSeparator);const n=function(t){let e;switch(t.arrayFormat){case"index":return(t,n,r)=>{e=/\[(\d*)]$/.exec(t),t=t.replace(/\[\d*]$/,""),e?(void 0===r[t]&&(r[t]={}),r[t][e[1]]=n):r[t]=n};case"bracket":return(t,n,r)=>{e=/(\[])$/.exec(t),t=t.replace(/\[]$/,""),e?void 0!==r[t]?r[t]=[...r[t],n]:r[t]=[n]:r[t]=n};case"colon-list-separator":return(t,n,r)=>{e=/(:list)$/.exec(t),t=t.replace(/:list$/,""),e?void 0!==r[t]?r[t]=[...r[t],n]:r[t]=[n]:r[t]=n};case"comma":case"separator":return(e,n,r)=>{const o="string"==typeof n&&n.includes(t.arrayFormatSeparator),i="string"==typeof n&&!o&&ot(n,t).includes(t.arrayFormatSeparator);n=i?ot(n,t):n;const a=o||i?n.split(t.arrayFormatSeparator).map((e=>ot(e,t))):null===n?n:ot(n,t);r[e]=a};case"bracket-separator":return(e,n,r)=>{const o=/(\[])$/.test(e);if(e=e.replace(/\[]$/,""),!o)return void(r[e]=n?ot(n,t):n);const i=null===n?[]:n.split(t.arrayFormatSeparator).map((e=>ot(e,t)));void 0!==r[e]?r[e]=[...r[e],...i]:r[e]=i};default:return(t,e,n)=>{void 0!==n[t]?n[t]=[...[n[t]].flat(),e]:n[t]=e}}}(e),r=Object.create(null);if("string"!=typeof t)return r;if(!(t=t.trim().replace(/^[?#&]/,"")))return r;for(const o of t.split("&")){if(""===o)continue;const t=e.decode?o.replaceAll("+"," "):o;let[i,a]=X(t,"=");void 0===i&&(i=t),a=void 0===a?null:["comma","separator","bracket-separator"].includes(e.arrayFormat)?a:ot(a,e),n(ot(i,e),a,r)}for(const[o,i]of Object.entries(r))if("object"==typeof i&&null!==i)for(const[t,n]of Object.entries(i))i[t]=ct(n,e);else r[o]=ct(i,e);return!1===e.sort?r:(!0===e.sort?Object.keys(r).sort():Object.keys(r).sort(e.sort)).reduce(((t,e)=>{const n=r[e];return t[e]=Boolean(n)&&"object"==typeof n&&!Array.isArray(n)?it(n):n,t}),Object.create(null))}function lt(t,e){if(!t)return"";nt((e={encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:",",...e}).arrayFormatSeparator);const n=n=>e.skipNull&&Z(t[n])||e.skipEmptyString&&""===t[n],r=function(t){switch(t.arrayFormat){case"index":return e=>(n,r)=>{const o=n.length;return void 0===r||t.skipNull&&null===r||t.skipEmptyString&&""===r?n:null===r?[...n,[rt(e,t),"[",o,"]"].join("")]:[...n,[rt(e,t),"[",rt(o,t),"]=",rt(r,t)].join("")]};case"bracket":return e=>(n,r)=>void 0===r||t.skipNull&&null===r||t.skipEmptyString&&""===r?n:null===r?[...n,[rt(e,t),"[]"].join("")]:[...n,[rt(e,t),"[]=",rt(r,t)].join("")];case"colon-list-separator":return e=>(n,r)=>void 0===r||t.skipNull&&null===r||t.skipEmptyString&&""===r?n:null===r?[...n,[rt(e,t),":list="].join("")]:[...n,[rt(e,t),":list=",rt(r,t)].join("")];case"comma":case"separator":case"bracket-separator":{const e="bracket-separator"===t.arrayFormat?"[]=":"=";return n=>(r,o)=>void 0===o||t.skipNull&&null===o||t.skipEmptyString&&""===o?r:(o=null===o?"":o,0===r.length?[[rt(n,t),e,rt(o,t)].join("")]:[[r,rt(o,t)].join(t.arrayFormatSeparator)])}default:return e=>(n,r)=>void 0===r||t.skipNull&&null===r||t.skipEmptyString&&""===r?n:null===r?[...n,rt(e,t)]:[...n,[rt(e,t),"=",rt(r,t)].join("")]}}(e),o={};for(const[a,c]of Object.entries(t))n(a)||(o[a]=c);const i=Object.keys(o);return!1!==e.sort&&i.sort(e.sort),i.map((n=>{const o=t[n];return void 0===o?"":null===o?rt(n,e):Array.isArray(o)?0===o.length&&"bracket-separator"===e.arrayFormat?rt(n,e)+"[]":o.reduce(r(n),[]).join("&"):rt(n,e)+"="+rt(o,e)})).filter((t=>t.length>0)).join("&")}function ft(t,e){var n;e={decode:!0,...e};let[r,o]=X(t,"#");return void 0===r&&(r=t),{url:(null==(n=null==r?void 0:r.split("?"))?void 0:n[0])??"",query:st(ut(t),e),...e&&e.parseFragmentIdentifier&&o?{fragmentIdentifier:ot(o,e)}:{}}}function dt(t,e){e={encode:!0,strict:!0,[et]:!0,...e};const n=at(t.url).split("?")[0]||"";let r=lt({...st(ut(t.url),{sort:!1}),...t.query},e);r&&(r=`?${r}`);let o=function(t){let e="";const n=t.indexOf("#");return-1!==n&&(e=t.slice(n)),e}(t.url);if("string"==typeof t.fragmentIdentifier){const r=new URL(n);r.hash=t.fragmentIdentifier,o=e[et]?r.hash:`#${t.fragmentIdentifier}`}return`${n}${r}${o}`}function pt(t,e,n){n={parseFragmentIdentifier:!0,[et]:!1,...n};const{url:r,query:o,fragmentIdentifier:i}=ft(t,n);return dt({url:r,query:Y(o,e),fragmentIdentifier:i},n)}const ht=Object.freeze(Object.defineProperty({__proto__:null,exclude:function(t,e,n){return pt(t,Array.isArray(e)?t=>!e.includes(t):(t,n)=>!e(t,n),n)},extract:ut,parse:st,parseUrl:ft,pick:pt,stringify:lt,stringifyUrl:dt},Symbol.toStringTag,{value:"Module"})),vt=(t,e)=>fetch(t,e),yt=(t,{queryParam:e,headers:n,resultSchema:r}={})=>jt((()=>vt(St(t,e),{method:"GET",headers:{...n,Accept:"application/json;charset=utf-8"}})),r),mt=(t,{queryParam:e,body:n,headers:r,resultSchema:o}={})=>jt((()=>vt(St(t,e),{method:"POST",headers:{...r,Accept:"application/json;charset=utf-8","Content-Type":"application/json;charset=utf-8"},body:n&&Object.keys(n).length>0?JSON.stringify(n):null})),o),gt=(t,{queryParam:e,body:n,headers:r,resultSchema:o}={})=>jt((()=>vt(St(t,e),{method:"PUT",headers:{...r,Accept:"application/json;charset=utf-8","Content-Type":"application/json;charset=utf-8"},body:n&&Object.keys(n).length>0?JSON.stringify(n):null})),o),bt=(t,{queryParam:e,body:n,headers:r,resultSchema:o}={})=>jt((()=>vt(St(t,e),{method:"PATCH",headers:{...r,Accept:"application/json;charset=utf-8","Content-Type":"application/x-www-form-urlencoded;charset=utf-8"},body:n&&Object.keys(n).length>0?Ot(n):null})),o);class wt extends Error{constructor(t,n,r,o,i){super(`请求 ${t} 发生错误,响应: ${n} - ${r}${i?`：${i}`:JSON.stringify(o)}`),e(this,"url"),e(this,"status"),e(this,"statusText"),e(this,"body"),this.url=t,this.status=n,this.statusText=r,this.body=o}}const jt=async(t,e)=>{const n=await t(),{headers:r,status:o,statusText:i,url:a}=n,c=o>=200&&o<=300;let u;const s=r.get("content-Type");if(0===Number(r.get("content-length")))u=null;else if(s&&s.includes("application/json"))u=await n.json();else if(u=await n.text(),v(u))u=void 0;else try{u=JSON.parse(u)}catch(l){if(c)throw new wt(a,o,i,{code:"response.contentType-type.invalid",message:`不支持响应类型解析：${s}, 响应值：${u}`},`不支持响应类型解析：${s}, 响应值：${u}`)}if(c)try{return!!u&&(null==e?void 0:e.parse(u))||u}catch(l){throw u={code:"response.invalid",message:`结果值结构解析失败：${l}`},new wt(a,o,i,u,`结果值结构解析失败：${l}`)}try{u=422===o?y.parse(u):m.parse(u)}catch(l){u={code:"response.invalid",message:`未知的响应值：${u}`}}throw new wt(a,o,i,u)},St=(t,e)=>{const n=new Array,r=t.indexOf("?");if(r>0){const e=t.substring(r+1,t.length);for(let t of g.split(e,"&"))n.push(t);t=t.substring(0,r)}return n.length>0&&(t=t+"?"+n.join("&")),e&&Object.keys(e).length>0&&(t=t+(n.length>0?"&":"?")+Ot(e)),t},Ot=t=>t?ht.stringify(t):"",Et=t=>{var e;let n;const r=t.status;if(401===r)n="当前状态为未登录或者登录状态已过期！";else if(403===r)n="无访问权限！";else{const r=null==(e=t.body)?void 0:e.message;n=v(r)?`${t.url} 请求发生错误！`:r}return n},Pt=(t,e,n)=>{const{noticeError:r=!0,unauthorizedRedirectLogin:o=!0,...i}=e||{},a=b();return z(((...e)=>new Promise((async(n,i)=>{try{n(await t(...e))}catch(c){if(r){let t;if(c instanceof wt)t=Et(c);else if(c instanceof Error){const e=c.message;t="未知的异常"+(v(e)?"!":`: ${e}`)}else t="未知的异常!";w.error(t,{position:"top-right",duration:3e3})}if(o&&c instanceof wt&&401===c.status){const t=`/login?redirectUrl=${encodeURIComponent(window.location.href)}`;a(t)}i(c)}}))),i)};export{yt as G,wt as H,mt as P,gt as a,bt as b,M as c,Et as g,Pt as u};
