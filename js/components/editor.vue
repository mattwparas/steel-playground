<style>
.cm-editor, .cm-scroller {
  height: 100%;
}
</style>
<template>
  <div style="overflow: hidden"></div>
</template>

<script>
import { EditorView, keymap, ViewPlugin } from "@codemirror/view";
import {
  StateField,
  StateEffect,
  EditorState,
  Compartment
} from "@codemirror/state";
import {
  history,
  historyKeymap,
  indentWithTab,
  defaultKeymap
} from "@codemirror/commands";
import { indentUnit, foldGutter } from "@codemirror/language";
import { closeBrackets } from "@codemirror/autocomplete";
import {
  helix,
  commands,
  themeListener,
  changeTheme as helixChangeTheme
} from "codemirror-helix";
import { dynamicTheme, themes } from "../themes";
import { basicExtensions } from "../codemirror";

const readOnlyEffect = StateEffect.define();
const readOnlyField = StateField.define({
  create() {
    return false;
  },
  update(current, tr) {
    for (const effect of tr.effects) {
      if (effect.is(readOnlyEffect)) {
        return effect.value;
      }
    }

    return current;
  }
});

const defaultKeybindings = (run, themeExt) => [
  history(),
  keymap.of([
    {
      key: "Ctrl-Enter",
      run() {
        run();
        return true;
      }
    }
  ]),
  keymap.of(historyKeymap),
  keymap.of(defaultKeymap),
  keymap.of(indentWithTab),
  foldGutter(),
  themeExt ? dynamicTheme.of(themeExt) : dynamicTheme.default
];

const helixThemes = Object.entries(themes).map(([name, obj]) => ({
  ...obj,
  name
}));

const helixKeybindings = (run, examples, theme) => {
  return [
    helix({
      themes: helixThemes,
      config: { theme: theme.current }
    }),
    commands.of([
      {
        name: "run",
        aliases: ["write", "w"],
        help: "Run the current code in Steel",
        handler: run
      },
      {
        name: "example",
        help: "Switch to a different example",
        autocomplete(args) {
          return examples.options.flatMap(opt =>
            !args[0] || opt.text.includes(args[0]) ? [opt.text] : []
          );
        },
        handler(view, args) {
          const example = examples.options.find(opt => opt.text === args[0]);

          if (!example) {
            return { message: `Unknown example '${args[0]}'`, error: true };
          }

          examples.update(example.value);
        }
      }
    ]),
    themeListener.of(theme.update)
  ];
};

const keybindingsCompartment = new Compartment();

function initEditor(vm) {
  const editor = new EditorView({
    parent: vm.$el,
    extensions: [
      basicExtensions({ fold: false }),
      ViewPlugin.define(() => ({
        update(viewUpdate) {
          if (viewUpdate.docChanged) {
            vm.change(editor, viewUpdate);
          }
        }
      })),
      readOnlyField,
      EditorState.readOnly.from(readOnlyField),
      closeBrackets(),
      indentUnit.of(" ".repeat(4)),
      keybindingsCompartment.of(defaultKeybindings(() => vm.requestRun()))
    ]
  });

  return editor;
}

let changeTheme = defaultChangeTheme;

function defaultChangeTheme(view, store) {
  dynamicTheme.set(view, store.load());
}

function changeThemeForHelix(view, store) {
  helixChangeTheme(view, store.state.current);
}

export default {
  methods: {
    change(editor, changes) {
      this.$emit("change", this.getEditor(), changes);
    },
    requestRun() {
      this.$emit("requestRun", this.$_cm);
    },
    getEditor() {
      const cm = this.$_cm;
      const that = this;

      return {
        doc() {
          return cm.state.doc.toString();
        },
        async setKeybinding(keybinding) {
          const run = () => that.requestRun();
          const updateTheme = theme => that.store.update(theme.name);
          const updateExample = example => that.$emit("switchExample", example);

          const effect =
            keybinding === "helix"
              ? keybindingsCompartment.reconfigure(
                  helixKeybindings(
                    run,
                    { options: that.examples, update: updateExample },
                    { current: that.store.state.current, update: updateTheme }
                  )
                )
              : keybindingsCompartment.reconfigure(
                  defaultKeybindings(run, await that.store.load())
                );

          changeTheme =
            keybinding === "helix" ? changeThemeForHelix : defaultChangeTheme;

          cm.dispatch({ effects: effect });
        },
        setValue(value) {
          cm.dispatch({
            changes: {
              from: 0,
              to: cm.state.doc.length,
              insert: value
            }
          });
        },
        focus() {
          cm.focus();
        }
      };
    }
  },
  watch: {
    readOnly(readOnly) {
      this.$_cm.dispatch({ effects: readOnlyEffect.of(readOnly) });
    }
  },
  props: ["store", "readOnly", "examples"],
  mounted() {
    this.$_cm = initEditor(this);
    this.store.onThemeChange(() => {
      changeTheme(this.$_cm, this.store);
    });
  }
};
</script>
