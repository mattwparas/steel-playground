<template>
  <div style="overflow: hidden"></div>
</template>

<script>
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { dynamicTheme } from "../themes";
import { basicExtensions } from "../codemirror";

function initEditor(vm) {
  return new EditorView({
    parent: vm.$el,
    extensions: [
      basicExtensions(),
      EditorState.readOnly.of(true),
      dynamicTheme.default
    ]
  });
}

export default {
  props: {
    astText: String,
    store: Object
  },
  watch: {
    astText(newVal) {
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
