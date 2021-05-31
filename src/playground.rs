use itertools::Itertools;
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

impl Playground {
    pub fn new() -> Self {
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
        _debug_callback: impl Fn(&str) + 'static,
        _progress_callback: impl Fn(u64) + 'static,
    ) -> Result<String, String> {
        self.engine
            .register_value("displayln", displayln(print_callback));

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
