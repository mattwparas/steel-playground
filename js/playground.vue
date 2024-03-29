<style scoped>
.playgroundRoot {
  height: 100%;
  max-height: 100%;
  display: grid;
  grid-template-columns: 100vw;
  grid-template-rows: auto minmax(0, 1fr);
}
.header {
  padding: 0.75rem;
}
.outputPanel {
  display: flex;
  flex-direction: column;
  background-color: #002b36;
}
.result {
  border: 0;
  margin: 4px 8px;
  resize: none;
  font-family: monospace;
  flex-grow: 1;
}
</style>

<style>
.CodeMirror {
  border: 1px solid #ccc;
  height: 100% !important;
  box-sizing: border-box;
  font-size: 0.95em;
  line-height: initial;
}
.CodeMirror .rhai-error {
  text-decoration: underline wavy red;
}
.CodeMirror .cm-matchhighlight {
  background-color: rgba(0, 0, 0, 0.1);
}
.CodeMirror .CodeMirror-selection-highlight-scrollbar {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <div class="playgroundRoot">
    <header class="header">
      <b-field grouped group-multiline>
        <b-field>
          <p class="control">
            <b-button
              type="is-success"
              native-type="button"
              icon-left="play"
              @click="requestRun"
              :loading="isScriptRunning"
              :disabled="runDisabled"
              >Run</b-button
            >
          </p>
          <p class="control" v-if="isRunScriptOnWorker">
            <b-tooltip
              position="is-bottom"
              :label="
                (isScriptRunning
                  ? runningOps !== null
                    ? 'Running'
                    : 'Loading...'
                  : 'Idle') + (runningOps ? ` / Ops: ${runningOpsDisplay}` : '')
              "
              :always="isScriptRunning && runningOps !== null && runningOps > 0"
            >
              <b-button
                type="is-danger"
                native-type="button"
                icon-left="stop"
                @click="stopScript"
                :disabled="stopDisabled"
                >Stop</b-button
              >
            </b-tooltip>
          </p>
        </b-field>
        <b-field style="margin-bottom: 0.75rem">
          <p class="control" v-if="!$data._isEmbedded">
            <b-dropdown
              aria-role="menu"
              :disabled="exampleScriptChangePromise !== null || isScriptRunning"
            >
              <button
                class="button"
                position="is-bottom-left"
                slot="trigger"
                role="button"
                type="button"
              >
                <span>Examples</span>
                <b-icon icon="menu-down" />
              </button>
              <b-dropdown-item
                aria-role="menu-item"
                v-for="i in exampleScriptList"
                :key="i.value"
                @click.native.prevent="loadExampleScript(i.value)"
                href="#"
                >{{ i.text }}</b-dropdown-item
              >
            </b-dropdown>
          </p>
          <p class="control">
            <b-dropdown aria-role="menu">
              <b-button
                icon-left="cog"
                slot="trigger"
                role="button"
                native-type="button"
                >Editor Configuration</b-button
              >

              <b-dropdown-item aria-role="menu-item" :focusable="false" custom>
                <b-field label="Editor Theme">
                  <b-select
                    v-model="selectedCmTheme"
                    :disabled="cmThemeChangePromise !== null"
                    expanded
                  >
                    <option value="default">Default</option>
                    <option
                      v-for="i in cmThemeList"
                      :key="i.value"
                      :value="i.value"
                    >
                      {{ i.text }}
                    </option>
                  </b-select>
                </b-field>
                <b-field label="Layout">
                  <b-select v-model="splitLayout" expanded>
                    <option value="auto">Auto</option>
                    <option value="h">Horizontal Split</option>
                    <option value="v">Vertical Split</option>
                    <option value="tabbed">Tabbed</option>
                  </b-select>
                </b-field>
                <div class="field">
                  <b-switch
                    v-model="isRunScriptOnWorker"
                    :disabled="isScriptRunning"
                  >
                    Run script using
                    <b>Web Worker</b>
                  </b-switch>
                </div>
              </b-dropdown-item>
            </b-dropdown>
          </p>
          <p class="control">
            <b-dropdown aria-role="menu">
              <b-button
                icon-left="help-circle"
                slot="trigger"
                role="button"
                native-type="button"
              ></b-button>

              <b-dropdown-item
                aria-role="menu-item"
                :focusable="false"
                custom
                paddingless
              >
                <div class="modal-card" style="width: 300px">
                  <section class="modal-card-body">
                    <div class="content">
                      <h1>What is Steel?</h1>
                      <p>
                        <a
                          href="https://github.com/mattwparas/steel"
                          target="_blank"
                          >Steel</a
                        >
                        is an embedded scheme implementation in Rust. It can be
                        used to enable scripting inside an application or on its
                        own as a standalone language.
                      </p>
                      <h1>Hotkeys</h1>
                      <p>
                        You can run the script by pressing
                        <kbd>Ctrl</kbd> + <kbd>Enter</kbd> when focused in the
                        editor.
                      </p>
                    </div>
                  </section>
                  <footer class="modal-card-foot">
                    <div>
                      <span>
                        <a
                          href="https://github.com/mattwparas/steel"
                          target="_blank"
                          >Steel Playground</a
                        >
                        version: {{ VERSION }} </span
                      ><br />
                      <span>compiled with Steel {{ STEEL_VERSION }}</span>
                    </div>
                  </footer>
                </div>
              </b-dropdown-item>
            </b-dropdown>
          </p>
        </b-field>
      </b-field>
    </header>
    <splittable-tabs
      :layout="splitLayout"
      @layoutChanged="cmRefresh()"
      @activeTabChanged="activeTabChanged"
    >
      <tab-item label="Code" ref="codeTab" splittable>
        <editor
          style="overflow: hidden; height: 100%"
          ref="editor"
          @change="codeChange"
          @requestRun="requestRun"
        ></editor>
      </tab-item>
      <tab-item label="Output" ref="outputTab" class="outputPanel">
        <textarea
          ref="result"
          class="result"
          readonly
          autocomplete="off"
          style="background-color: #002b36; color: #fff"
        ></textarea>
      </tab-item>
      <tab-item label="Bytecode">
        <bytecode-view
          style="overflow: hidden; height: 100%"
          ref="bytecodeView"
          :bytecode-text="bytecodeText"
        ></bytecode-view>
      </tab-item>
      <tab-item label="Raw AST">
        <ast-view
          style="overflow: hidden; height: 100%"
          ref="astView"
          :ast-text="astText"
        ></ast-view>
      </tab-item>
      <tab-item label="Expanded AST">
        <expanded-ast-view
          style="overflow: hidden; height: 100%"
          ref="expandedAstView"
          :expanded-text="expandedAstText"
        ></expanded-ast-view>
      </tab-item>
    </splittable-tabs>
  </div>
</template>

<script>
import { wasm, wasmLoadPromise } from "./wasm_loader.js";

import AstView from "./components/AstView.vue";
import BytecodeView from "./components/BytecodeView.vue";
import ExpandedAstView from "./components/ExpandedAstView.vue";
import Editor from "./components/editor.vue";
import SplittableTabs from "./components/SplittableTabs.vue";
import TabItem from "./components/TabItem.vue";
import * as Runner from "./playground-runner";

import CodeMirror from "codemirror";

wasmLoadPromise.then(() => {
  // wasm.init_codemirror_pass(CodeMirror.Pass);
  //   CodeMirror.mode = "scheme";
  //   CodeMirror.setOption("mode", "scheme");
  // CodeMirror
});

const initialCode = `\
(define (foo)
    (define x 10)
    (define y 20)
    (list 1 2 3 4 x y))

(foo)
`;

function initEditor(vm) {
  /**
   * @type CodeMirror.TextMarker?
   */
  let lastErrorMarker = null;
  /**
   *
   * @param {CodeMirror.Editor} editor
   */
  function tryCompileScript(editor) {
    if (lastErrorMarker) {
      lastErrorMarker.clear();
      lastErrorMarker = null;
    }
    try {
      const bytecode = wasm.compile_script(editor.getValue());
      return bytecode;
    } catch (e) {
      // TODO
      // console.log("Parse error:", e);
      return e;
    }
  }

  /**
   *
   * @param {CodeMirror.Editor} editor
   */
  function tryCompileAstScript(editor) {
    if (lastErrorMarker) {
      lastErrorMarker.clear();
      lastErrorMarker = null;
    }
    try {
      // console.log("Compiling the AST");
      const astText = wasm.compile_ast(editor.getValue());
      return astText;
    } catch (e) {
      // TODO
      // console.log("Parse error");
      return e;
    }
  }

  /**
   *
   * @param {CodeMirror.Editor} editor
   */
  function tryCompileExpandedAstScript(editor) {
    if (lastErrorMarker) {
      lastErrorMarker.clear();
      lastErrorMarker = null;
    }
    try {
      // console.log("Compiling the expanded AST");
      const astText = wasm.compile_expanded_ast(editor.getValue());
      return astText;
    } catch (e) {
      // TODO
      // console.log("Parse error");
      return e;
    }
  }

  const tryCompileDebounced = {
    delayMsec: 500,
    timeout: null,
    cancel() {
      if (this.timeout !== null) {
        window.clearTimeout(this.timeout);
      }
    },
    trigger(arg) {
      this.cancel();
      this.timeout = window.setTimeout(() => this._fire(arg), this.delayMsec);
    },
    _fire(editor) {
      // vm.astText = tryCompileAstScript(editor) || "";
      vm.bytecodeText = tryCompileScript(editor);
      vm.astText = tryCompileAstScript(editor);
      vm.expandedAstText = tryCompileExpandedAstScript(editor);
      // console.log(vm.expandedAstText);
      // vm.astText = "";
    },
  };

  function doRunScriptSync(editor, resultEl) {
    let script = editor.getValue();
    resultEl.value = "";
    function appendOutput(line) {
      let v = resultEl.value + line + "\n";
      if (v.length > 10000) {
        v = v.substr(v.length - 10000);
      }
      resultEl.value = v;
    }
    appendOutput(`Running script at ${new Date().toISOString()}\n`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let result = wasm.run_script(
            script,
            (s) => {
              appendOutput(`[PRINT] ${s}`);
            },
            (s) => {
              appendOutput(`[DEBUG] ${s}`);
            }
          );
          appendOutput(`\n\nScript returned: \n${result}\n`);
        } catch (ex) {
          appendOutput(`\nEXCEPTION: "${ex}"`);
        }
        appendOutput(`\n\nFinished at ${new Date().toISOString()}`);
        // Scroll to bottom
        resultEl.scrollTop = resultEl.scrollHeight - resultEl.clientHeight;
        resolve();
      }, 10);
    });
  }

  let runScriptPromise = null;
  async function doRunScriptAsync(editor, el, updateOps) {
    if (runScriptPromise) {
      console.log(
        "Blocked run script request as another script is already running."
      );
      return;
    }
    let script = editor.getValue();
    el.value = "";
    let appendBuffer = "";
    let appendBufferTimeout = null;
    let lastUpdateTime = null;
    function appendOutput(line) {
      appendBuffer += line + "\n";
      if (appendBufferTimeout === null) {
        // This limits the frequency of appending and scrolling of the
        // output to the screen refresh rate in order to reduce the
        // number of superfluous re-layouts in case the script prints
        // a lot of lines within a very short moment of time.
        const animFn = (ts) => {
          let elapsed = ts - lastUpdateTime;
          if (elapsed < 32) {
            // There isn't really much point updating the output
            // more than 30 times per seconds, so we limit it.
            appendBufferTimeout = requestAnimationFrame(animFn);
            return;
          }
          lastUpdateTime = ts;
          const scroll = el.scrollTop >= el.scrollHeight - el.clientHeight - 2;
          let v = el.value;
          const totalLen = v.length + appendBuffer.length;
          if (totalLen > 10000) {
            v = v.substr(totalLen - 10000);
          }
          v += appendBuffer;
          el.value = v;
          if (scroll) {
            // Scroll to bottom
            el.scrollTop = el.scrollHeight - el.clientHeight;
          }
          appendBuffer = "";
          appendBufferTimeout = null;
        };
        appendBufferTimeout = requestAnimationFrame(animFn);
      }
    }
    try {
      await (runScriptPromise = Runner.runScript(
        script,
        appendOutput,
        updateOps
      ));
    } catch (ex) {
      appendOutput(`\nEXCEPTION: "${ex}"`);
    } finally {
      runScriptPromise = null;
    }
  }

  let isScriptRunning = false;
  async function doRunScript(editor, isAsync, resultEl, updateOps) {
    if (isScriptRunning) {
      console.log(
        "Blocked run script request as another script is already running."
      );
      return;
    }
    isScriptRunning = true;
    if (isAsync) {
      await doRunScriptAsync(editor, resultEl, updateOps);
    } else {
      await doRunScriptSync(editor, resultEl);
    }
    isScriptRunning = false;
  }

  return {
    tryCompileDebounced,
    doRunScript,
  };
}

// With the help of webpack, we can get a list of all the example script files
// and the ability to lazily load them on demand:
const exampleScriptsImport = require.context(
  "!raw-loader!../example-scripts/",
  false,
  /\.scm$/,
  "lazy"
);
let exampleScriptList = [];
for (let key of exampleScriptsImport.keys()) {
  const value = key;
  if (key.startsWith("./")) {
    key = key.substr(2);
  }
  const text = key;
  exampleScriptList.push({ value, text });
}
Object.freeze(exampleScriptList);

// Include all the CodeMirror themes but load lazily:
const cmThemesImport = require.context(
  "codemirror/theme/",
  false,
  /\.css$/,
  "lazy"
);
let cmThemeList = [];
for (let key of cmThemesImport.keys()) {
  if (!key.startsWith("./") || !key.endsWith(".css")) {
    continue;
  }
  key = key.substring(2, key.length - 4);
  function addOpt(key, name) {
    const value = name ? `${key}/${name}` : key;
    const text = name || key;
    cmThemeList.push({ value, text });
  }
  if (key === "solarized") {
    addOpt(key, `${key} dark`);
    addOpt(key, `${key} light`);
  } else {
    addOpt(key);
  }
}
Object.freeze(cmThemeList);

export default {
  props: {
    initialCode: {
      type: String,
      default: initialCode,
    },
    isEmbedded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      exampleScriptList,
      exampleScriptChangePromise: null,
      selectedCmTheme: "material-darker",
      cmThemeList,
      cmThemeChangePromise: null,
      isRunScriptOnWorker: true,
      isScriptRunning: false,
      runningOps: null,
      stopDisabled: true,
      astText: "",
      bytecodeText: "",
      expandedAstText: "",
      splitLayout: "auto",
      _isEmbedded: this.isEmbedded,
    };
  },
  computed: {
    runDisabled() {
      return this.isScriptRunning || this.exampleScriptChangePromise !== null;
    },
    runningOpsDisplay() {
      if (this.runningOps !== null) {
        return this.runningOps.toLocaleString();
      } else {
        return "-";
      }
    },
    VERSION() {
      return VERSION;
    },
    STEEL_VERSION() {
      return STEEL_VERSION;
    },
  },
  methods: {
    codeChange(editor, changes) {
      this.$_r.tryCompileDebounced.trigger(editor);
    },
    async requestRun() {
      if (this.runDisabled) {
        return;
      }
      this.$refs.outputTab.makeTabActive();
      this.isScriptRunning = true;
      if (this.isRunScriptOnWorker) {
        this.stopDisabled = false;
      }
      this.runningOps = null;
      await this.$_r.doRunScript(
        this.$refs.editor.getEditor(),
        this.isRunScriptOnWorker,
        this.$refs.result,
        (ops) => {
          this.runningOps = ops;
        }
      );
      this.stopDisabled = true;
      this.isScriptRunning = false;
    },
    /**
     * @returns {CodeMirror.Editor}
     */
    getEditor() {
      return this.$refs.editor.getEditor();
    },
    stopScript() {
      Runner.stopScript();
    },
    loadExampleScript(key) {
      const cm = this.getEditor();
      this.$_r.tryCompileDebounced.cancel();
      cm.setOption("readOnly", true);
      this.exampleScriptChangePromise = exampleScriptsImport(key)
        .then((module) => {
          cm.setValue(module.default);
          this.$refs.codeTab.makeTabActive();
          this.$nextTick(() => {
            cm.focus();
          });
        })
        .catch((e) => {
          console.error("Error loading script", e);
        })
        .finally(() => {
          cm.setOption("readOnly", false);
          this.exampleScriptChangePromise = null;
        });
    },
    cmRefresh() {
      this.$nextTick(() => this.getEditor().refresh());
    },
    activeTabChanged(newTab) {
      if (newTab === 0) {
        this.cmRefresh();
      } else if (newTab === 2) {
        this.$nextTick(() => this.$refs.bytecodeView.getEditor().refresh());
      } else if (newTab === 3) {
        this.$nextTick(() => this.$refs.astView.getEditor().refresh());
      } else if (newTab === 4) {
        this.$nextTick(() => this.$refs.expandedAstView.getEditor().refresh());
      }
    },
  },
  watch: {
    selectedCmTheme(theme, oldVal) {
      if (!theme) {
        return;
      }
      const cm = this.getEditor();
      if (theme === "default") {
        cm.setOption("theme", "default");
        return;
      }
      let themeFile = theme;
      const slash = theme.indexOf("/");
      if (slash !== -1) {
        themeFile = theme.substring(0, slash);
        theme = theme.substring(slash + 1);
      }
      this.cmThemeChangePromise = cmThemesImport(`./${themeFile}.css`)
        .then((module) => {
          cm.setOption("theme", theme);
          this.$refs.bytecodeView.getEditor().setOption("theme", theme);
          this.$refs.astView.getEditor().setOption("theme", theme);
          this.$refs.expandedAstView.getEditor().setOption("theme", theme);
        })
        .catch((e) => {
          console.error("Error loading theme", e);
        })
        .finally(() => {
          this.cmThemeChangePromise = null;
        });
    },
  },
  mounted() {
    const cm = this.getEditor();
    const r = initEditor(this);
    r.tryCompileDebounced.trigger(cm);
    this.$_r = r;
    this.$nextTick(() => {
      cm.refresh();
      cm.setValue(this.initialCode);
      cm.focus();
    });
  },
  components: {
    AstView,
    BytecodeView,
    ExpandedAstView,
    Editor,
    SplittableTabs,
    TabItem,
  },
};
</script>
