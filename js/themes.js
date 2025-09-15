import { Compartment } from "@codemirror/state";
import {
  syntaxHighlighting,
  defaultHighlightStyle
} from "@codemirror/language";
import { materialDark } from "@ddietr/codemirror-themes/material-dark";
import { Store } from "vuex";

const compartment = new Compartment();

export const dynamicTheme = {
  default: compartment.of(materialDark),
  of(extension) {
    return compartment.of(extension);
  },
  async set(view, promise) {
    const themeExt = await promise;

    view.dispatch({ effects: compartment.reconfigure(themeExt) });
  },
  sync(view, store) {
    store.onThemeChange(() => {
      dynamicTheme.set(view, store.load());
    });
  }
};

export function createThemeStore(initial) {
  const store = new Store({
    state: {
      current: initial,
      busy: false
    },
    mutations: {
      busy(state) {
        state.busy = true;
      },
      idle(state) {
        state.busy = false;
      },
      update(state, payload) {
        state.current = payload;
      }
    }
  });

  let requests = new Set();

  return {
    state: store.state,
    onThemeChange(fn) {
      store.watch(state => state.current, fn);
    },
    subscribe: store.subscribe.bind(store),
    update(theme) {
      store.commit("update", theme);
    },
    async load() {
      const theme = Object.entries(themes).find(
        ([name]) => name === store.state.current
      )[1].extension;

      const request = theme();

      requests.add(request);

      if (requests.size === 1) {
        store.commit("busy");
      }

      const extension = await request;

      requests.delete(request);

      if (requests.size === 0) {
        store.commit("idle");
      }

      return extension;
    }
  };
}

export const themes = {
  default: {
    extension: async () => syntaxHighlighting(defaultHighlightStyle)
  },
  "material-light": {
    extension: () =>
      import("@ddietr/codemirror-themes/material-light").then(
        mod => mod.materialLight
      )
  },
  "material-dark": { dark: true, extension: async () => materialDark },
  "solarized-light": {
    extension: () =>
      import("@ddietr/codemirror-themes/solarized-light").then(
        mod => mod.solarizedLight
      )
  },
  "solarized-dark": {
    dark: true,
    extension: () =>
      import("@ddietr/codemirror-themes/solarized-dark").then(
        mod => mod.solarizedDark
      )
  },
  dracula: {
    dark: true,
    extension: () =>
      import("@ddietr/codemirror-themes/dracula").then(mod => mod.dracula)
  },
  "github-light": {
    extension: () =>
      import("@ddietr/codemirror-themes/github-light").then(
        mod => mod.githubLight
      )
  },
  "github-dark": {
    dark: true,
    extension: () =>
      import("@ddietr/codemirror-themes/github-dark").then(
        mod => mod.githubDark
      )
  },
  aura: {
    dark: true,
    extension: () =>
      import("@ddietr/codemirror-themes/aura").then(mod => mod.aura)
  },
  "tokyo-night": {
    dark: true,
    extension: () =>
      import("@ddietr/codemirror-themes/tokyo-night").then(
        mod => mod.tokyoNight
      )
  },
  "tokyo-night-storm": {
    dark: true,
    extension: () =>
      import("@ddietr/codemirror-themes/tokyo-night-storm").then(
        mod => mod.tokyoNightStorm
      )
  },
  "tokyo-night-day": {
    extension: () =>
      import("@ddietr/codemirror-themes/tokyo-night-day").then(
        mod => mod.tokyoNightDay
      )
  }
};
