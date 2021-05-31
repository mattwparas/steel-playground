use itertools::Itertools;
use steel::steel_vm::engine::Engine;

use crate::playground::displayln;

pub fn run_script(
    script: &str,
    print_callback: impl Fn(&str) + 'static,
    _debug_callback: impl Fn(&str) + 'static,
    _progress_callback: impl Fn(u64) + 'static,
) -> Result<String, String> {
    let mut engine = Engine::new_sandboxed();

    engine.register_value("displayln", displayln(print_callback));

    engine
        .run(script)
        .map(|x| {
            x.into_iter()
                .filter(|x| !matches!(x, steel::rvals::SteelVal::Void))
                .map(|x| x.to_string())
                .join("\n")
        })
        .map_err(|e| e.emit_result_to_string("", script))
}

pub fn compile_program(script: &str) -> Result<String, String> {
    let mut engine = Engine::new_sandboxed();

    engine.register_value("displayln", displayln(|_| {}));

    engine
        .disassemble(script)
        .map_err(|e| e.emit_result_to_string("", script))
}

pub fn compile_ast(script: &str) -> Result<String, String> {
    Engine::emit_ast_to_string(script).map_err(|e| e.emit_result_to_string("", script))
}

pub fn compile_expanded_ast(script: &str) -> Result<String, String> {
    let mut engine = Engine::new_sandboxed();

    // engine.register_value("displayln", displayln(|_| {}));
    engine
        .emit_fully_expanded_ast_to_string(script)
        .map_err(|e| e.emit_result_to_string("", script))
}
