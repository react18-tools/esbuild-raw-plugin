import type { Plugin, PluginBuild } from "esbuild";
import fs from "node:fs";
import path from "node:path";

export interface RawPluginOptions {
  /** Extensions to check in order if the file does not exist.
   * If it is directory we check dir/index.[ext]
   * @defaultValue ["tsx", "ts", "jsx", "js", "mjs", "mts", "module.css", "module.scss", "css", "scss"]
   */
  ext?: string[];
}

/** Plugin to load `.glsl` files as minified strings */
export const raw: (options?: RawPluginOptions) => Plugin = options => ({
  /** generate randmo name to avoid collision among the plugins */
  name: `raw-${(Date.now() * Math.random()).toString(36).slice(0, 8)}`,
  setup(build: PluginBuild) {
    const ext = options?.ext ?? [
      "tsx",
      "ts",
      "jsx",
      "js",
      "mjs",
      "mts",
      "module.css",
      "module.scss",
      "css",
      "scss",
    ];
    build.onResolve({ filter: /\?raw$/ }, args => {
      const filePath = args.path;
      return {
        path: filePath,
        pluginData: path.resolve(args.resolveDir, filePath).replace(/\?raw$/, ""),
        namespace: "raw",
      };
    });
    build.onLoad({ filter: /\?raw$/, namespace: "raw" }, async args => {
      let filePath = args.pluginData;
      if (fs.lstatSync(filePath).isDirectory()) filePath += path.sep + "index";
      if (!fs.existsSync(filePath))
        for (const e of ext)
          if (fs.existsSync(filePath + "." + e)) {
            filePath += "." + e;
            break;
          }
      return {
        contents: fs.readFileSync(filePath, "utf8"),
        loader: "text",
      };
    });
  },
});
