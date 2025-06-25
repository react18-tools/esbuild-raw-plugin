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
   * Map file extensions (without dot) to custom loaders.
   * Example: { md: "text", png: "dataurl" }
   */
  customLoaders?: Record<string, "text" | "base64" | "dataurl" | "file" | "binary" | "default">;

  /**
   * Plugin name override (for debugging, deduplication, etc.)
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
      const i = args.path.lastIndexOf("?");
      const filepath = i !== -1 ? args.path.slice(0, i) : args.path;
      const query = i !== -1 ? args.path.slice(i + 1) : undefined;

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
      const { fullPath, query } = args.pluginData;
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
      }

      return { contents: buffer, loader };
    });

    if (options?.customLoaders) {
      const customLoaderKeys = Object.keys(options.customLoaders).sort(
        (a, b) => b.length - a.length,
      );
      const pattern = new RegExp(
        `\\.(${customLoaderKeys
          .map(e => e.replace(/^\./, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("|")})$`,
      );

      build.onLoad({ filter: pattern }, args => {
        const path = args.path;
        const loaderKey = customLoaderKeys.find(suffix => path.endsWith(suffix));
        const loader = options.customLoaders?.[loaderKey ?? ""];
        if (!loader) return;

        const buffer = fs.readFileSync(path);
        return { contents: buffer, loader };
      });
    }
  },
});
