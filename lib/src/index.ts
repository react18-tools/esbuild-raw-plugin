import type { Plugin, PluginBuild } from "esbuild";
import fs from "node:fs";
import path from "node:path";

/** Plugin to load `.glsl` files as minified strings */
export const raw: () => Plugin = () => ({
  /** generate randmo name to avoid collision among the plugins */
  name: `raw-${(Date.now() * Math.random()).toString(36).slice(0, 8)}`,
  setup(build: PluginBuild) {
    build.onResolve({ filter: /\?raw$/ }, args => {
      const filePath = args.path;
      return {
        path: filePath,
        pluginData: path.resolve(args.resolveDir, filePath).replace(/\?raw$/, ""),
        namespace: "raw",
      };
    });
    build.onLoad({ filter: /\?raw$/, namespace: "raw" }, async args => {
      return {
        contents: fs.readFileSync(args.pluginData, "utf8"),
        loader: "text",
      };
    });
  },
});
