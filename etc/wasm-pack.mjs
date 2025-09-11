// wrapper around wasm-pack to work around https://github.com/drager/wasm-pack/issues/1420

import { spawn } from "node:child_process";
import { text } from "node:stream/consumers";

const child = spawn("wasm-pack", ["build", "-t", "web"], {
  encoding: "utf8",
  stdio: ["inherit", "inherit", "pipe"]
});

child.stderr.pipe(process.stderr);

const stderrPromise = text(child.stderr);

const exit = await new Promise(resolve => {
  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      resolve(code);
    }
  });
});

if (exit !== 0) {
  const stderr = await stderrPromise;
  if (stderr.includes("invalid type: map, expected a string")) {
    console.log("Working around wasm-pack bug");
  } else {
    process.exitCode = exit;
  }
}
