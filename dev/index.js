!function(n){function e(e){for(var t,o,i=e[0],a=e[1],_=0,d=[];_<i.length;_++)o=i[_],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&d.push(r[o][0]),r[o]=0;for(t in a)Object.prototype.hasOwnProperty.call(a,t)&&(n[t]=a[t]);for(c&&c(e);d.length;)d.shift()()}var t={},r={0:0};function o(e){if(t[e])return t[e].exports;var r=t[e]={i:e,l:!1,exports:{}};return n[e].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.e=function(n){var e=[],t=r[n];if(0!==t)if(t)e.push(t[2]);else{var i=new Promise((function(e,o){t=r[n]=[e,o]}));e.push(t[2]=i);var a,_=document.createElement("script");_.charset="utf-8",_.timeout=120,o.nc&&_.setAttribute("nonce",o.nc),_.src=function(n){return o.p+""+({}[n]||n)+".js"}(n);var c=new Error;a=function(e){_.onerror=_.onload=null,clearTimeout(d);var t=r[n];if(0!==t){if(t){var o=e&&("load"===e.type?"missing":e.type),i=e&&e.target&&e.target.src;c.message="Loading chunk "+n+" failed.\n("+o+": "+i+")",c.name="ChunkLoadError",c.type=o,c.request=i,t[1](c)}r[n]=void 0}};var d=setTimeout((function(){a({type:"timeout",target:_})}),12e4);_.onerror=_.onload=a,document.head.appendChild(_)}return Promise.all(e)},o.m=n,o.c=t,o.d=function(n,e,t){o.o(n,e)||Object.defineProperty(n,e,{enumerable:!0,get:t})},o.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},o.t=function(n,e){if(1&e&&(n=o(n)),8&e)return n;if(4&e&&"object"==typeof n&&n&&n.__esModule)return n;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var r in n)o.d(t,r,function(e){return n[e]}.bind(null,r));return t},o.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return o.d(e,"a",e),e},o.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},o.p="",o.oe=function(n){throw console.error(n),n};var i=this.webpackJsonp=this.webpackJsonp||[],a=i.push.bind(i);i.push=e,i=i.slice();for(var _=0;_<i.length;_++)e(i[_]);var c=a;o(o.s=1)}([function(n,e,t){"use strict";t.d(e,"a",(function(){return r})),t.d(e,"b",(function(){return T}));var r={};t.r(r),t.d(r,"run_script",(function(){return x})),t.d(r,"compile_script",(function(){return A})),t.d(r,"compile_ast",(function(){return j})),t.d(r,"compile_expanded_ast",(function(){return O})),t.d(r,"main_js",(function(){return P})),t.d(r,"Playground",(function(){return S})),t.d(r,"default",(function(){return M}));var o=t.p+"32b47456cb67fa35d2af65af3dbadaa8.wasm";function i(n){const e=t.p;let r="";return(!e||e.indexOf("://")<0)&&(r+=window.location.protocol+"//"+window.location.host),r+=e||"/",r+n}let a;const _=new Array(32).fill(void 0);function c(n){return _[n]}_.push(void 0,null,!0,!1);let d=_.length;function s(n){const e=c(n);return function(n){n<36||(_[n]=d,d=n)}(n),e}let l=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});l.decode();let u=null;function f(){return null!==u&&u.buffer===a.memory.buffer||(u=new Uint8Array(a.memory.buffer)),u}function p(n,e){return l.decode(f().subarray(n,n+e))}function w(n){d===_.length&&_.push(_.length+1);const e=d;return d=_[e],_[e]=n,e}let b=0,g=new TextEncoder("utf-8");const m="function"==typeof g.encodeInto?function(n,e){return g.encodeInto(n,e)}:function(n,e){const t=g.encode(n);return e.set(t),{read:n.length,written:t.length}};function y(n,e,t){if(void 0===t){const t=g.encode(n),r=e(t.length);return f().subarray(r,r+t.length).set(t),b=t.length,r}let r=n.length,o=e(r);const i=f();let a=0;for(;a<r;a++){const e=n.charCodeAt(a);if(e>127)break;i[o+a]=e}if(a!==r){0!==a&&(n=n.slice(a)),o=t(o,r,r=a+3*n.length);const e=f().subarray(o+a,o+r);a+=m(n,e).written}return b=a,o}let h=null;function v(){return null!==h&&h.buffer===a.memory.buffer||(h=new Int32Array(a.memory.buffer)),h}function k(n){return null==n}function x(n,e,t,r){try{const d=a.__wbindgen_add_to_stack_pointer(-16);var o=y(n,a.__wbindgen_malloc,a.__wbindgen_realloc),i=b;a.run_script(d,o,i,w(e),w(t),k(r)?0:w(r));var _=v()[d/4+0],c=v()[d/4+1];return p(_,c)}finally{a.__wbindgen_add_to_stack_pointer(16),a.__wbindgen_free(_,c)}}function A(n){try{const i=a.__wbindgen_add_to_stack_pointer(-16);var e=y(n,a.__wbindgen_malloc,a.__wbindgen_realloc),t=b;a.compile_script(i,e,t);var r=v()[i/4+0],o=v()[i/4+1];return p(r,o)}finally{a.__wbindgen_add_to_stack_pointer(16),a.__wbindgen_free(r,o)}}function j(n){try{const i=a.__wbindgen_add_to_stack_pointer(-16);var e=y(n,a.__wbindgen_malloc,a.__wbindgen_realloc),t=b;a.compile_ast(i,e,t);var r=v()[i/4+0],o=v()[i/4+1];return p(r,o)}finally{a.__wbindgen_add_to_stack_pointer(16),a.__wbindgen_free(r,o)}}function O(n){try{const i=a.__wbindgen_add_to_stack_pointer(-16);var e=y(n,a.__wbindgen_malloc,a.__wbindgen_realloc),t=b;a.compile_expanded_ast(i,e,t);var r=v()[i/4+0],o=v()[i/4+1];return p(r,o)}finally{a.__wbindgen_add_to_stack_pointer(16),a.__wbindgen_free(r,o)}}function P(){a.main_js()}function E(n,e){try{return n.apply(this,e)}catch(n){a.__wbindgen_exn_store(w(n))}}class S{static __wrap(n){const e=Object.create(S.prototype);return e.ptr=n,e}__destroy_into_raw(){const n=this.ptr;return this.ptr=0,n}free(){const n=this.__destroy_into_raw();a.__wbg_playground_free(n)}constructor(){var n=a.playground_new();return S.__wrap(n)}compileScript(n){try{const i=a.__wbindgen_add_to_stack_pointer(-16);var e=y(n,a.__wbindgen_malloc,a.__wbindgen_realloc),t=b;a.playground_compileScript(i,this.ptr,e,t);var r=v()[i/4+0],o=v()[i/4+1];return p(r,o)}finally{a.__wbindgen_add_to_stack_pointer(16),a.__wbindgen_free(r,o)}}compileAst(n){try{const i=a.__wbindgen_add_to_stack_pointer(-16);var e=y(n,a.__wbindgen_malloc,a.__wbindgen_realloc),t=b;a.playground_compileAst(i,this.ptr,e,t);var r=v()[i/4+0],o=v()[i/4+1];return p(r,o)}finally{a.__wbindgen_add_to_stack_pointer(16),a.__wbindgen_free(r,o)}}compileExpandedAst(n){try{const i=a.__wbindgen_add_to_stack_pointer(-16);var e=y(n,a.__wbindgen_malloc,a.__wbindgen_realloc),t=b;a.playground_compileExpandedAst(i,this.ptr,e,t);var r=v()[i/4+0],o=v()[i/4+1];return p(r,o)}finally{a.__wbindgen_add_to_stack_pointer(16),a.__wbindgen_free(r,o)}}runScript(n,e,t,r){try{const d=a.__wbindgen_add_to_stack_pointer(-16);var o=y(n,a.__wbindgen_malloc,a.__wbindgen_realloc),i=b;a.playground_runScript(d,this.ptr,o,i,w(e),w(t),k(r)?0:w(r));var _=v()[d/4+0],c=v()[d/4+1];return p(_,c)}finally{a.__wbindgen_add_to_stack_pointer(16),a.__wbindgen_free(_,c)}}}var M=async function n(e){void 0===e&&(e=new URL("index_bg.wasm",i("pkg/index.js")));const t={wbg:{}};t.wbg.__wbindgen_object_drop_ref=function(n){s(n)},t.wbg.__wbindgen_string_new=function(n,e){return w(p(n,e))},t.wbg.__wbg_call_3fc07b7d5fc9022d=function(){return E((function(n,e,t){return w(c(n).call(c(e),c(t)))}),arguments)},t.wbg.__wbindgen_throw=function(n,e){throw new Error(p(n,e))},t.wbg.__wbindgen_rethrow=function(n){throw s(n)},("string"==typeof e||"function"==typeof Request&&e instanceof Request||"function"==typeof URL&&e instanceof URL)&&(e=fetch(e));const{instance:r,module:o}=await async function(n,e){if("function"==typeof Response&&n instanceof Response){if("function"==typeof WebAssembly.instantiateStreaming)try{return await WebAssembly.instantiateStreaming(n,e)}catch(e){if("application/wasm"==n.headers.get("Content-Type"))throw e;console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",e)}const t=await n.arrayBuffer();return await WebAssembly.instantiate(t,e)}{const t=await WebAssembly.instantiate(n,e);return t instanceof WebAssembly.Instance?{instance:t,module:n}:t}}(await e,t);return a=r.exports,n.__wbindgen_wasm_module=o,a.__wbindgen_start(),a};const T=M(o);T.then(n=>r)},function(n,e,t){"use strict";t.r(e);var r=t(0);const o=Promise.all([t.e(1),t.e(2)]).then(t.bind(null,3)),i=t.e(3).then(t.t.bind(null,2,7));let a;if(window.location.hash.startsWith("#embed-")&&window.parent!==window){const n=window.location.hash.substr(7);let e;a=new Promise((n,t)=>{e=n}),window.addEventListener("message",(function(n){if("steel-playground"===n.data.to&&"embed-init"===n.data.req){if("string"!=typeof n.data.code)throw"Code is not a string";e({code:n.data.code})}})),window.parent.postMessage({from:"steel-playground",req:"embed-loaded",id:n},"*");const t=document.createElement("div");t.innerText="(embedded)",document.getElementById("loading").appendChild(t)}else a=Promise.resolve(null);Promise.all([o,a,r.b,i]).then(([n,e,t,r])=>{document.getElementById("loading").remove(),n.default("#topContainer",e)})}]);