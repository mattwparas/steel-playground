!function(n){var e={};function t(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return n[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=n,t.c=e,t.d=function(n,e,r){t.o(n,e)||Object.defineProperty(n,e,{enumerable:!0,get:r})},t.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},t.t=function(n,e){if(1&e&&(n=t(n)),8&e)return n;if(4&e&&"object"==typeof n&&n&&n.__esModule)return n;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var o in n)t.d(r,o,function(e){return n[e]}.bind(null,o));return r},t.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(e,"a",e),e},t.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},t.p="",t(t.s=0)}([function(n,e,t){"use strict";t.r(e);var r={};t.r(r),t.d(r,"run_script",(function(){return k})),t.d(r,"compile_script",(function(){return P})),t.d(r,"main_js",(function(){return M})),t.d(r,"Playground",(function(){return O})),t.d(r,"default",(function(){return x}));var o=t.p+"9180418868f8ca203f526b4e425e4dd9.wasm";function i(n){const e=t.p;let r="";return(!e||e.indexOf("://")<0)&&(r+=window.location.protocol+"//"+window.location.host),r+=e||"/",r+n}let a;const c=new Array(32).fill(void 0);function s(n){return c[n]}c.push(void 0,null,!0,!1);let u=c.length;function _(n){const e=s(n);return function(n){n<36||(c[n]=u,u=n)}(n),e}let l=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});l.decode();let f=null;function d(){return null!==f&&f.buffer===a.memory.buffer||(f=new Uint8Array(a.memory.buffer)),f}function p(n,e){return l.decode(d().subarray(n,n+e))}function g(n){u===c.length&&c.push(c.length+1);const e=u;return u=c[e],c[e]=n,e}let b=0,w=new TextEncoder("utf-8");const y="function"==typeof w.encodeInto?function(n,e){return w.encodeInto(n,e)}:function(n,e){const t=w.encode(n);return e.set(t),{read:n.length,written:t.length}};function m(n,e,t){if(void 0===t){const t=w.encode(n),r=e(t.length);return d().subarray(r,r+t.length).set(t),b=t.length,r}let r=n.length,o=e(r);const i=d();let a=0;for(;a<r;a++){const e=n.charCodeAt(a);if(e>127)break;i[o+a]=e}if(a!==r){0!==a&&(n=n.slice(a)),o=t(o,r,r=a+3*n.length);const e=d().subarray(o+a,o+r);a+=y(n,e).written}return b=a,o}let h=null;function v(){return null!==h&&h.buffer===a.memory.buffer||(h=new Int32Array(a.memory.buffer)),h}function S(n){return null==n}function k(n,e,t,r){try{const u=a.__wbindgen_add_to_stack_pointer(-16);var o=m(n,a.__wbindgen_malloc,a.__wbindgen_realloc),i=b;a.run_script(u,o,i,g(e),g(t),S(r)?0:g(r));var c=v()[u/4+0],s=v()[u/4+1];return p(c,s)}finally{a.__wbindgen_add_to_stack_pointer(16),a.__wbindgen_free(c,s)}}function P(n){try{const i=a.__wbindgen_add_to_stack_pointer(-16);var e=m(n,a.__wbindgen_malloc,a.__wbindgen_realloc),t=b;a.compile_script(i,e,t);var r=v()[i/4+0],o=v()[i/4+1];return p(r,o)}finally{a.__wbindgen_add_to_stack_pointer(16),a.__wbindgen_free(r,o)}}function M(){a.main_js()}function j(n,e){try{return n.apply(this,e)}catch(n){a.__wbindgen_exn_store(g(n))}}class O{static __wrap(n){const e=Object.create(O.prototype);return e.ptr=n,e}__destroy_into_raw(){const n=this.ptr;return this.ptr=0,n}free(){const n=this.__destroy_into_raw();a.__wbg_playground_free(n)}constructor(){var n=a.playground_new();return O.__wrap(n)}compileScript(n){try{const i=a.__wbindgen_add_to_stack_pointer(-16);var e=m(n,a.__wbindgen_malloc,a.__wbindgen_realloc),t=b;a.playground_compileScript(i,this.ptr,e,t);var r=v()[i/4+0],o=v()[i/4+1];return p(r,o)}finally{a.__wbindgen_add_to_stack_pointer(16),a.__wbindgen_free(r,o)}}runScript(n,e,t,r){try{const u=a.__wbindgen_add_to_stack_pointer(-16);var o=m(n,a.__wbindgen_malloc,a.__wbindgen_realloc),i=b;a.playground_runScript(u,this.ptr,o,i,g(e),g(t),S(r)?0:g(r));var c=v()[u/4+0],s=v()[u/4+1];return p(c,s)}finally{a.__wbindgen_add_to_stack_pointer(16),a.__wbindgen_free(c,s)}}}var x=async function n(e){void 0===e&&(e=new URL("index_bg.wasm",i("pkg/index.js")));const t={wbg:{}};t.wbg.__wbindgen_object_drop_ref=function(n){_(n)},t.wbg.__wbindgen_string_new=function(n,e){return g(p(n,e))},t.wbg.__wbg_call_3fc07b7d5fc9022d=function(){return j((function(n,e,t){return g(s(n).call(s(e),s(t)))}),arguments)},t.wbg.__wbindgen_throw=function(n,e){throw new Error(p(n,e))},t.wbg.__wbindgen_rethrow=function(n){throw _(n)},("string"==typeof e||"function"==typeof Request&&e instanceof Request||"function"==typeof URL&&e instanceof URL)&&(e=fetch(e));const{instance:r,module:o}=await async function(n,e){if("function"==typeof Response&&n instanceof Response){if("function"==typeof WebAssembly.instantiateStreaming)try{return await WebAssembly.instantiateStreaming(n,e)}catch(e){if("application/wasm"==n.headers.get("Content-Type"))throw e;console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",e)}const t=await n.arrayBuffer();return await WebAssembly.instantiate(t,e)}{const t=await WebAssembly.instantiate(n,e);return t instanceof WebAssembly.Instance?{instance:t,module:n}:t}}(await e,t);return a=r.exports,n.__wbindgen_wasm_module=o,a.__wbindgen_start(),a};const R=x(o).then(n=>r),A=R.then(n=>new n.Playground);self.onmessage=n=>{"runScript"===n.data.req?async function(n){const e=await A;function t(n){self.postMessage({req:"runScript/output",output:n})}try{let r=e.runScript(n,n=>{t("[PRINT] "+n)},n=>{t("[DEBUG] "+n)},n=>{self.postMessage({req:"runScript/updateOps",ops:n})});t(`\n\nScript returned: \n\n${r}\n`)}catch(n){t("\n\nEXCEPTION: "+n)}postMessage({req:"runScript/end"})}(n.data.script):console.log("Unknown message received by worker:",n.data)},R.then(()=>{self.postMessage({req:"_ready"})}),addEventListener("message",(function(n){var t,r=n.data,o=r.type,i=r.method,a=r.id,c=r.params;"RPC"===o&&i&&((t=e[i])?Promise.resolve().then((function(){return t.apply(e,c)})):Promise.reject("No such method")).then((function(n){postMessage({type:"RPC",id:a,result:n})})).catch((function(n){var e={message:n};n.stack&&(e.message=n.message,e.stack=n.stack,e.name=n.name),postMessage({type:"RPC",id:a,error:e})}))})),postMessage({type:"RPC",method:"ready"})}]);