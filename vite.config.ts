import vue from "@vitejs/plugin-vue2";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { defineConfig } from "vite";
import * as fs from "node:fs/promises";

export default defineConfig(async () => {
  const { stdout: revision } = await promisify(exec)(
    "git describe --always --tags --dirty"
  );
  const steelVersion = await readSteelVersion();

  return {
    plugins: [vue()],
    define: {
      __GIT_REVISION__: JSON.stringify(revision.trim()),
      __STEEL_VERSION__: JSON.stringify(steelVersion)
    }
  };
});

async function readSteelVersion() {
  const steelCrate = {
    version: null as null | string,
    gitHash: null as null | string,
    isCratesIo: false
  };

  const cargoLock = await fs.readFile("./Cargo.lock", { encoding: "utf8" });

  const matches = /\[\[package\]\]\r?\nname = "steel-core"\r?\nversion = "([0-9\.]+)"(?:\r?\nsource = "([^"\r\n]+)"\r?\n)?/.exec(
    cargoLock
  );

  if (matches) {
    const [, version, source] = matches;
    steelCrate.version = version;
    if (source?.startsWith("git+")) {
      const gitHashMatches = /git[^#]+#([0-9a-f]+)/.exec(source);
      steelCrate.gitHash = gitHashMatches?.[1] ?? null;
    } else if (
      source === "registry+https://github.com/rust-lang/crates.io-index"
    ) {
      steelCrate.isCratesIo = true;
    }
  }

  const steelVersion = steelCrate.version ?? "unknown";
  let steelSource = "(unknown source)";

  if (steelCrate.gitHash != null) {
    steelSource = `(git+${steelCrate.gitHash.slice(0, 7)})`;
  } else if (steelCrate.isCratesIo) {
    steelSource = "(crates.io)";
  }

  return `${steelVersion} ${steelSource}`;
}
