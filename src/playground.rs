use instant::Instant;
// use rhai::Engine;
use itertools::Itertools;
use std::cell::RefCell;
use steel::steel_vm::engine::Engine;
use wasm_bindgen::prelude::*;

use std::rc::Rc;
use steel::rerrs::{ErrorKind, SteelErr};
use steel::rvals::SteelVal;
use steel::stop;

pub struct Playground {
    engine: Engine,
}

pub fn displayln(print_callback: impl Fn(&str) + 'static) -> SteelVal {
    SteelVal::BoxedFunction(Rc::new(
        move |args: &[SteelVal]| -> steel::rvals::Result<SteelVal> {
            if args.len() > 0 {
                // let print_val = &args[0];

                let mut buffer = String::new();

                for value in args {
                    match value {
                        SteelVal::StringV(s) => buffer.push_str(s.as_ref()),
                        _ => buffer.push_str(value.to_string().as_str()),
                    }
                }

                print_callback(buffer.as_str());
                Ok(SteelVal::Void)
            } else {
                stop!(ArityMismatch => "display takes at least one argument");
            }
        },
    ))
}

// pub fn newline(print_callback: impl Fn(&str) + 'static) -> SteelVal {
//     SteelVal::BoxedFunction(Rc::new(
//         move |args: &[SteelVal]| -> steel::rvals::Result<SteelVal> {
//             if args.is_empty() {
//                 print_callback("");
//                 Ok(SteelVal::Void)
//             } else {
//                 stop!(ArityMismatch => "newline takes no arguments");
//             }
//         },
//     ))
// }

// pub fn compile_program(script: &str) -> Result<String, String> {

// }

impl Playground {
    pub fn new() -> Self {
        // let mut engine = rhai::Engine::new();
        // engine.disable_symbol("eval");
        // engine.on_print(|_| {});
        // engine.on_debug(|_, _, _| {});
        // Self {
        //     engine: Engine::new(),
        // }

        let engine = Engine::new_sandboxed();
        Self { engine }
    }

    pub fn disassemble(&mut self, script: &str) -> Result<String, String> {
        self.engine.register_value("displayln", displayln(|_| {}));

        self.engine
            .disassemble(script)
            .map_err(|e| e.emit_result_to_string("", script))
    }

    pub fn emit_ast_to_string(&self, script: &str) -> Result<String, String> {
        Engine::emit_ast_to_string(script).map_err(|e| e.emit_result_to_string("", script))
    }

    pub fn emit_expanded_ast_to_string(&mut self, script: &str) -> Result<String, String> {
        self.engine
            .emit_fully_expanded_ast_to_string(script)
            .map_err(|e| e.emit_result_to_string("", script))
    }

    pub fn run_script(
        &mut self,
        script: &str,
        print_callback: impl Fn(&str) + 'static,
        debug_callback: impl Fn(&str) + 'static,
        progress_callback: impl Fn(u64) + 'static,
    ) -> Result<String, String> {
        // struct Defer<'z> {
        //     mut_self: &'z mut Playground,
        // }

        // let defer = Defer { mut_self: self };
        // let engine = &mut defer.mut_self.engine;

        // engine.on_print(move |s| print_callback(s));
        // engine.on_debug(move |s, src, pos| {
        //     debug_callback(&src.map_or_else(
        //         || format!("<script>:[{}] {}", pos, s),
        //         |src| format!("{}:[{}] {}", src, pos, s),
        //     ))
        // });
        // let script_ast = engine.compile(&script).map_err(|e| e.to_string())?;

        // let interval = RefCell::new(1000);
        // let last_instant = RefCell::new(Instant::now());
        // engine.on_progress(move |ops| {
        //     let interval_value = *interval.borrow();
        //     if ops % interval_value == 0 {
        //         let mut last_instant = last_instant.borrow_mut();
        //         let new_instant = Instant::now();
        //         let duration_msec = new_instant.duration_since(*last_instant).as_millis();
        //         if duration_msec < 50 {
        //             interval.replace(interval_value * 10);
        //         } else if duration_msec >= 100 {
        //             progress_callback(ops);
        //             *last_instant = new_instant;
        //             if duration_msec >= 500 && interval_value > 1 {
        //                 interval.replace(interval_value / 10);
        //             }
        //         }
        //     }
        //     None
        // });

        // let result: rhai::Dynamic = engine.eval_ast(&script_ast).map_err(|e| e.to_string())?;

        // return Ok(result.to_string());

        // impl Drop for Defer<'_> {
        //     fn drop(&mut self) {
        //         let engine = &mut self.mut_self.engine;
        //         engine.on_print(|_| {});
        //         engine.on_debug(|_, _, _| {});
        //         engine.on_progress(|_| None);
        //     }
        // }

        self.engine
            .register_value("displayln", displayln(print_callback));
        // .register_value("newline", newline(print_callback));

        self.engine
            .run(script)
            .map(|x| {
                x.into_iter()
                    .filter(|x| !matches!(x, steel::rvals::SteelVal::Void))
                    .map(|x| x.to_string())
                    .join("\n")
            })
            .map_err(|e| e.emit_result_to_string("", script))
    }
}

#[wasm_bindgen(js_name = Playground)]
pub struct PlaygroundExport(Playground);

#[wasm_bindgen(js_class = Playground)]
impl PlaygroundExport {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self(Playground::new())
    }

    #[wasm_bindgen(js_name = compileScript)]
    pub fn compile_script(&mut self, script: String) -> Result<String, JsValue> {
        Ok(self.0.disassemble(&script)?)
    }

    #[wasm_bindgen(js_name = compileAst)]
    pub fn compile_ast(&self, script: String) -> Result<String, JsValue> {
        Ok(self.0.emit_ast_to_string(&script)?)
    }

    #[wasm_bindgen(js_name = compileExpandedAst)]
    pub fn compile_expanded_ast(&mut self, script: String) -> Result<String, JsValue> {
        Ok(self.0.emit_expanded_ast_to_string(&script)?)
    }

    #[wasm_bindgen(js_name = runScript)]
    pub fn run_script(
        &mut self,
        script: String,
        print_callback: js_sys::Function,
        debug_callback: js_sys::Function,
        progress_callback: Option<js_sys::Function>,
    ) -> Result<String, JsValue> {
        Ok(self.0.run_script(
            &script,
            move |s| {
                let _ = print_callback.call1(&JsValue::null(), &JsValue::from_str(s));
            },
            move |s| {
                let _ = debug_callback.call1(&JsValue::null(), &JsValue::from_str(s));
            },
            move |ops| {
                if let Some(f) = &progress_callback {
                    let _ = f.call1(&JsValue::null(), &JsValue::from_f64(ops as f64));
                }
            },
        )?)
    }
}