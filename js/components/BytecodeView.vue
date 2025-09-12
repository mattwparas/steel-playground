<template>
  <div style="overflow: hidden"></div>
</template>

<script>
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { dynamicTheme } from "../themes";

function initEditor(vm) {
  const view = new EditorView({
    parent: vm.$el,
    extensions: [EditorState.readOnly.of(false), dynamicTheme.default]
  });

  return view;
}

export default {
  props: {
    bytecodeText: String,
    store: Object
  },
  watch: {
    bytecodeText(newVal) {
      this._cm.dispatch({
        changes: {
          from: 0,
          to: this._cm.state.doc.length,
          insert: newVal
        }
      });
    }
  },
  mounted() {
    this._cm = initEditor(this);
    dynamicTheme.sync(this._cm, this.store);
  }
};
</script>
