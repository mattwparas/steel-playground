use itertools::Itertools;
use steel::steel_vm::engine::Engine;
use wasm_bindgen::prelude::*;

use std::rc::Rc;
use std::sync::Arc;
use steel::rerrs::{ErrorKind, SteelErr};
use steel::rvals::SteelVal;
use steel::stop;

use crate::scripting::PrintCallback;

pub struct Playground {
    engine: Engine,
}

impl Playground {
    pub fn new() -> Self {
        let engine = Engine::new();
        Self { engine }
    }

    pub fn disassemble(&mut self, script: &str) -> Result<String, String> {
        // self.engine.register_value("displayln", displayln(|_| {}));

        let program = self
            .engine
            .emit_raw_program_no_path(script.to_string())
            .map_err(|e| e.emit_result_to_string("", script))?;

        Ok(self
            .engine
            .debug_build_strings(program)
            .map_err(|e| e.emit_result_to_string("", script))?
            .join("\n"))
    }

    pub fn emit_ast_to_string(&self, script: &str) -> Result<String, String> {
        Engine::emit_ast_to_string(script).map_err(|e| e.emit_result_to_string("", script))
    }

    pub fn emit_expanded_ast_to_string(&mut self, script: &str) -> Result<String, String> {
        self.engine
            .emit_fully_expanded_ast_to_string(script, None)
            .map_err(|e| e.emit_result_to_string("", script))
    }

    pub fn run_script(
        &mut self,
        script: &str,
        print_callback: impl Fn(&str) + 'static,
        _debug_callback: impl Fn(&str) + 'static,
        _progress_callback: impl Fn(u64) + 'static,
    ) -> Result<String, String> {
        let port_output = SteelVal::new_dyn_writer_port(PrintCallback {
            callback: print_callback,
        });

        self.engine
            .call_function_by_name_with_args_from_mut_slice(
                "current-output-port",
                &mut [port_output],
            )
            .map_err(|e| e.emit_result_to_string("", script))?;

        self.engine
            .run(script.to_string())
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
