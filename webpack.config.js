const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const webpack = require("webpack");
const gitRevisionPlugin = new GitRevisionPlugin({
  versionCommand: "describe --always --tags --dirty",
});

const fs = require('fs');
const crateVersion = {
  steel: {
    version: null,
    gitHash: null,
    isCratesIo: false,
  },
};
try {
  const cargoLock = fs.readFileSync(path.resolve(__dirname, "Cargo.lock"), { encoding: "utf8" });
  const matches = /\[\[package\]\]\r?\nname = "steel-core"\r?\nversion = "([0-9\.]+)"(?:\r?\nsource = "([^"\r\n]+)"\r?\n)?/.exec(cargoLock);
  if (matches) {
    crateVersion.steel.version = matches[1];
    if (typeof matches[2] !== "undefined") {
      if (matches[2].startsWith("git+")) {
        const gitHashMatches = /git[^#]+#([0-9a-f]+)/.exec(matches[2]);
        if (gitHashMatches) {
          crateVersion.steel.gitHash = gitHashMatches[1];
        }
      } else if (matches[2] === "registry+https://github.com/rust-lang/crates.io-index") {
        crateVersion.steel.isCratesIo = true;
      }
    }
  }
} catch (ex) {
  console.warn("Failed to read Cargo.lock, skipping crate version defs", ex);
}

let steelVersionString = "unknown";
if (crateVersion.steel.version !== null) {
  steelVersionString = crateVersion.steel.version;
  if (crateVersion.steel.gitHash !== null) {
    steelVersionString += ` (git+${crateVersion.steel.gitHash.substr(0, 7)})`;
  } else if (crateVersion.steel.isCratesIo) {
    steelVersionString += " (crates.io)";
  } else {
    steelVersionString += " (unknown source)";
  }
}

const dist = path.resolve(__dirname, "dist");

module.exports = {
  mode: "production",
  entry: {
    index: "./js/index.js"
  },
  output: {
    path: dist,
    filename: "[name].js",
    globalObject: "this",
  },
  devServer: {
    contentBase: dist,
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }, {
      test: /\.ttf$/,
      use: ['file-loader'],
    }, {
      test: /\.vue$/,
      use: ['vue-loader'],
    }, {
      test: /\.js$/,
      // This loader is needed because the script generated by wasm-pack uses
      // `import.meta` and webpack craps out on it.
      loader: require.resolve('@open-wc/webpack-import-meta-loader'),
    }, {
      test: /\.wasm$/,
      loader: 'file-loader',
    }],
    // HACK: Override the defaultRules in order to prevent the built-in .wasm
    //       loader from trying to process the file.
    //       See: https://github.com/webpack/webpack/issues/6725
    defaultRules: [
      {
        type: 'javascript/auto',
        resolve: {},
      },
      {
        test: /\.json$/i,
        type: 'json',
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      path.resolve(__dirname, "static")
    ]),

    new WasmPackPlugin({
      crateDirectory: __dirname,
      // We have wasm-pack output for `web` target because we don't want
      // webpack to touch our .wasm file.
      extraArgs: "--target web",
    }),

    new VueLoaderPlugin(),

    gitRevisionPlugin,

    new webpack.DefinePlugin({
      VERSION: JSON.stringify(gitRevisionPlugin.version()),
      STEEL_VERSION: JSON.stringify(steelVersionString),
    }),
  ],
};
