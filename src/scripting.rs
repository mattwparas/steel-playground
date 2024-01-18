use itertools::Itertools;
use steel::{steel_vm::engine::Engine, SteelVal};

pub struct PrintCallback<F> {
    pub callback: F,
}

// Safety: we won't be able to actually
// move this between threads.
unsafe impl<F> Send for PrintCallback<F> {}
unsafe impl<F> Sync for PrintCallback<F> {}

impl<F: Fn(&str) + 'static> std::io::Write for PrintCallback<F> {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        (self.callback)(std::str::from_utf8(buf).unwrap());
        Ok(buf.len())
    }

    fn flush(&mut self) -> std::io::Result<()> {
        Ok(())
    }
}

pub fn run_script(
    script: &str,
    print_callback: impl Fn(&str) + 'static,
    _debug_callback: impl Fn(&str) + 'static,
    _progress_callback: impl Fn(u64) + 'static,
) -> Result<String, String> {
    let mut engine = Engine::new();
    let port_output = SteelVal::new_dyn_writer_port(PrintCallback {
        callback: print_callback,
    });

    engine
        .call_function_by_name_with_args_from_mut_slice("current-output-port", &mut [port_output])
        .map_err(|e| e.emit_result_to_string("", script))?;

    engine
        .run(script.to_string())
        .map(|x| {
            x.into_iter()
                .filter(|x| !matches!(x, steel::rvals::SteelVal::Void))
                .map(|x| x.to_string())
                .join("\n")
        })
        .map_err(|e| e.emit_result_to_string("", script))
}

pub fn compile_program(script: &str) -> Result<String, String> {
    let mut engine = Engine::new();
    let program = engine
        .emit_raw_program_no_path(script.to_string())
        .map_err(|e| e.emit_result_to_string("", script))?;

    Ok(engine
        .debug_build_strings(program)
        .map_err(|e| e.emit_result_to_string("", script))?
        .join("\n"))
}

pub fn compile_ast(script: &str) -> Result<String, String> {
    Engine::emit_ast_to_string(script).map_err(|e| e.emit_result_to_string("", script))
}

pub fn compile_expanded_ast(script: &str) -> Result<String, String> {
    let mut engine = Engine::new();

    engine
        .emit_fully_expanded_ast_to_string(script, None)
        .map_err(|e| e.emit_result_to_string("", script))
}
