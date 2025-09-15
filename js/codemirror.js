import {
  highlightActiveLine,
  lineNumbers,
  highlightActiveLineGutter
} from "@codemirror/view";
import { bracketMatching, foldGutter } from "@codemirror/language";
import { scheme } from "codemirror-lang-scheme";

export const basicExtensions = ({ fold = true } = {}) => [
  lineNumbers(),
  highlightActiveLine(),
  highlightActiveLineGutter(),
  bracketMatching(),
  scheme(),
  ...(fold ? [foldGutter()] : [])
];
