import type { Plugin, PluginBuild } from "esbuild";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_EXT_ORDER_LIST = [
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

export interface RawPluginOptions {
  /**
   * File extensions to check in order of priority if the specified file is missing.
   * If it's a directory, the plugin will look for `dir/index.[ext]`.
   * @defaultValue ["ts", "tsx", "js", "jsx", "mjs", "mts", "module.css", "module.scss", "css", "scss"]
   */
  ext?: string[];

  /**
   * Custom loader for file processing.
   * Overridden by import query suffix (?text, ?base64, etc).
   * @defaultValue "text"
   */
  loader?: "text" | "base64" | "dataurl" | "file" | "binary" | "default";

  /**
   * Extensions to be treated as text files.
   */
  textExtensions?: string[];

  /**
   * Extension name in case you are using some other extension with conflicting names.
   */
  name?: string;
}

/**
 * ESBuild plugin to enable raw file imports.
 *
 * This plugin allows importing files with a `?raw` suffix,
 * treating them as raw text content. It supports resolving file
 * extensions in order of priority and handling custom loaders.
 */
export const raw = (options?: RawPluginOptions): Plugin => ({
  name: options?.name || "esbuild-raw-plugin",
  setup(build: PluginBuild) {
    const ext = options?.ext?.map(e => e.replace(/^\./, "")) ?? DEFAULT_EXT_ORDER_LIST;

    build.onResolve({ filter: /\?(raw|text|buffer|binary|base64|dataurl|file)$/ }, args => {
      const query = args.path.split("?").pop();
      const filepath = args.path.replace(new RegExp(`\\?${query}$`), "");
      return {
        path: filepath,
        namespace: "raw",
        pluginData: {
          fullPath: path.resolve(args.resolveDir, filepath),
          query,
        },
      };
    });

    build.onLoad({ filter: /.*/, namespace: "raw" }, args => {
      let { fullPath, query } = args.pluginData;
      let filePath = fullPath;

      if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "index");
      }

      if (!fs.existsSync(filePath)) {
        const resolved = ext.find(e => fs.existsSync(`${filePath}.${e}`));
        if (resolved) {
          filePath += `.${resolved}`;
        }
      }

      if (!fs.existsSync(filePath)) {
        throw new Error(
          `File not found: ${fullPath}\nChecked extensions: ${ext.join(", ")}.\nYou can customize extensions list using { ext: [...] }.`,
        );
      }

      const buffer = fs.readFileSync(filePath);
      const suffix = query?.toLowerCase();

      let loader = options?.loader ?? "text";
      switch (suffix) {
        case "buffer":
        case "binary":
          loader = "binary";
          break;
        case "text":
        case "file":
        case "base64":
        case "dataurl":
          loader = suffix;
          break;
        case "raw":
          break;
        default:
          console.warn(`?${suffix} not supported. Falling back to ${loader}`);
      }

      return { contents: buffer, loader };
    });

    if (options?.textExtensions?.length) {
      build.onLoad(
        {
          filter: new RegExp(
            `\\.(${options.textExtensions
              .map(e => e.replace(/^\./, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
              .join("|")})$`,
          ),
        },
        args => ({
          contents: fs.readFileSync(args.path),
          loader: "text",
        }),
      );
    }
  },
});
