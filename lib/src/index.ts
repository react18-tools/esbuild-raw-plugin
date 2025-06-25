import type { Plugin, PluginBuild } from "esbuild";
import fs from "node:fs";
import path from "node:path";

export interface RawPluginOptions {
  /**
   * File extensions to check in order of priority if the specified file is missing.
   * If it's a directory, the plugin will look for `dir/index.[ext]`.
   * @defaultValue ["ts", "tsx", "js", "jsx", "mjs", "mts", "module.css", "module.scss", "css", "scss"]
   */
  ext?: string[];

  /**
   * Custom loader for file processing.
   * @defaultValue "text"
   */
  loader?: "text" | "base64" | "dataurl" | "file" | "binary" | "default";

  /**
   * Extensions to be treated as text files.
   */
  textExtensions?: string[];
}

/**
 * ESBuild plugin to enable raw file imports.
 *
 * This plugin allows importing files with a `?raw` suffix,
 * treating them as raw text content. It supports resolving file
 * extensions in order of priority and handling custom loaders.
 */
export const raw: (options?: RawPluginOptions) => Plugin = options => ({
  name: `esbuild-raw-plugin`,
  setup(build: PluginBuild) {
    const ext = options?.ext ?? [
      "ts",
      "tsx",
      "js",
      "jsx",
      "mjs",
      "mts",
      "module.css",
      "module.scss",
      "css",
      "scss",
    ];

    build.onResolve({ filter: /\?raw$/ }, args => ({
      path: args.path,
      pluginData: path.resolve(args.resolveDir, args.path).replace(/\?raw$/, ""),
      namespace: "raw",
    }));

    build.onLoad({ filter: /\?raw$/, namespace: "raw" }, args => {
      let filePath = args.pluginData;
      if (options?.loader && options.loader !== "text") {
        return { contents: fs.readFileSync(filePath, "utf8"), loader: options.loader };
      }

      if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "index");
      }

      if (!fs.existsSync(filePath)) {
        for (const e of ext) {
          if (fs.existsSync(`${filePath}.${e}`)) {
            filePath += `.${e}`;
            break;
          }
        }
      }

      if (!fs.existsSync(filePath)) {
        throw new Error(
          /* v8 ignore next */
          `File not found: ${args.pluginData}\nChecked extensions: ${ext.join(", ")}. You can customize this using { ext: [...] }.`,
          /* v8 ignore next */
        );
      }

      return { contents: fs.readFileSync(filePath, "utf8"), loader: "text" };
    });

    if (options?.textExtensions?.length) {
      build.onLoad(
        {
          filter: new RegExp(
            `\.(${options.textExtensions.map(e => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})$`,
          ),
        },
        args => ({
          contents: fs.readFileSync(args.path, "utf8"),
          loader: "text",
        }),
      );
    }
  },
});
