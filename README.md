# Esbuild Raw Plugin <img src="https://raw.githubusercontent.com/mayank1513/mayank1513/main/popper.png" style="height: 40px"/>

[![test](https://github.com/react18-tools/esbuild-raw-plugin/actions/workflows/test.yml/badge.svg)](https://github.com/react18-tools/esbuild-raw-plugin/actions/workflows/test.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/aa896ec14c570f3bb274/maintainability)](https://codeclimate.com/github/react18-tools/esbuild-raw-plugin/maintainability)
[![codecov](https://codecov.io/gh/react18-tools/esbuild-raw-plugin/graph/badge.svg)](https://codecov.io/gh/react18-tools/esbuild-raw-plugin)
[![Version](https://img.shields.io/npm/v/esbuild-raw-plugin.svg?colorB=green)](https://www.npmjs.com/package/esbuild-raw-plugin)
[![Downloads](https://img.jsdelivr.com/img.shields.io/npm/d18m/esbuild-raw-plugin.svg)](https://www.npmjs.com/package/esbuild-raw-plugin)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/esbuild-raw-plugin)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/from-referrer/)

**Lightweight ESBuild/TSUP plugin to import files as raw content — zero config required.**

> 🔌Import `.ts`, `.js`, `.css`, `.scss`, `.md`, `.html`, `.docx`, and more — perfect for documentation, live editors (`react-live`), markdown tooling, or template-driven workflows.
> ⚡️Power users: Load `.docx` templates directly for [mdast2docx](https://github.com/md2docx/mdast2docx).

> <img src="https://raw.githubusercontent.com/mayank1513/mayank1513/main/popper.png" style="height: 20px"/> Star [this repository](https://github.com/react18-tools/esbuild-raw-plugin) and share it with your dev circle.

---

## 🚀 Features

> 🔥 Import any file as raw content with zero config in ESBuild or TSUP — text, base64, binary, docx templates & more!\
> ⚡️ Fast, smart, and extensible → `esbuild-raw-plugin`

- 🔧 Supports `?raw`, `?text`, `?base64`, `?dataurl`, `?binary`, and `?file` query suffixes
- 🧠 Smart fallback to extensions like `.ts`, `.tsx`, `index.[ext]`, etc.
- 🔍 Custom loader mapping (e.g., `module.scss` → `text`, `png` → `dataurl`)
- ⚡ Ultra-fast using regex-based native `onLoad` filter (Go-native perf)
- 🪶 Works seamlessly with both [Tsup](https://tsup.egoist.dev/) and [ESBuild](https://esbuild.github.io/)

---

## 📦 Installation

```bash
npm install esbuild-raw-plugin --save-dev
```

_or_

```bash
yarn add esbuild-raw-plugin --dev
```

_or_

```bash
pnpm add esbuild-raw-plugin --save-dev
```

---

## 🛠 Usage

### ➤ With ESBuild

```ts
import { build } from "esbuild";
import { raw } from "esbuild-raw-plugin";

build({
  entryPoints: ["src/index.js"],
  bundle: true,
  outfile: "out.js",
  plugins: [raw()],
});
```

### ➤ With TSUP

```ts
import { defineConfig } from "tsup";
import { raw } from "esbuild-raw-plugin";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  esbuildPlugins: [raw()],
});
```

---

## 🧠 TypeScript Support

Add this to your `declarations.d.ts` file:

```ts
declare module "*?raw" {
  const content: string;
  export default content;
}
```

> For other suffixes (`?base64`, `?binary`, etc.), add similar declarations if needed.

---

## 📥 Importing Raw Files

```ts
import content from "./example.js?raw";

console.log(content); // Entire file content as string or Buffer
```

### ✅ Simplified Imports

You don’t need to specify full filenames or extensions:

```ts
import code from "./utils?raw"; // Resolves to utils/index.ts, utils.js, etc.
```

Great for:

- Library or folder-level imports
- Auto-resolving `.ts`, `.tsx`, `.css`, `.scss`, etc.

---

## ⚙️ Plugin Options

```ts
export interface RawPluginOptions {
  ext?: string[];
  loader?: "text" | "base64" | "dataurl" | "file" | "binary" | "default";
  customLoaders?: Record<string, "text" | "base64" | "dataurl" | "file" | "binary" | "default">;
  name?: string;
}
```

<details>
<summary><strong>🔧 Option Details</strong></summary>

- `ext`: Extensions to resolve if the file or folder is missing. Defaults to common types like `ts`, `tsx`, `module.css`, etc.
- `loader`: Default loader if no `?query` is specified. Usually `"text"`.
- `customLoaders`: Per-extension loader mapping. Example:

  ```ts
  {
    "module.scss": "text",
    "png": "dataurl",
    "docx": "file"
  }
  ```

- `name`: Optional plugin name override for debugging or deduplication.

</details>

---

## 🧪 Supported Query Loaders

Import with query-based syntax:

```ts
import doc from "./readme.md?text";
import logo from "./logo.png?base64";
import wasm from "./core.wasm?binary";
```

| Query Suffix | Description                                        |
| ------------ | -------------------------------------------------- |
| `?raw`       | Uses the default loader (options.loader ?? "text") |
| `?text`      | Loads file as UTF-8 text                           |
| `?base64`    | Returns base64 string                              |
| `?dataurl`   | Returns full data URL                              |
| `?file`      | Emits file to output dir                           |
| `?binary`    | Returns raw `Buffer`                               |

---

## 🧬 Use Case: Live Code Preview

```tsx
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import exampleCode from "./example.js?raw";

export default function LiveDemo() {
  return (
    <LiveProvider code={exampleCode}>
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  );
}
```

---

## 🔍 Why Choose `esbuild-raw-plugin`?

- ✅ Works out of the box — no config needed
- 📁 Handles smart file resolution
- 💬 Excellent developer experience
- 🧩 Supports both query-based and extension-based mappings
- 🧪 Stable, fast, and production-tested

---

## 🛠 Contributing

PRs and ideas welcome!
Open an issue or submit a pull request to help improve the plugin.

![Alt](https://repobeats.axiom.co/api/embed/1ae166ef108b33b36ceaa60be208a5dafce25c5c.svg "Repobeats analytics image")

---

## 🧾 License

Licensed under the **MPL-2.0** open-source license.

> <img src="https://raw.githubusercontent.com/mayank1513/mayank1513/main/popper.png" style="height: 20px"/> Please consider [sponsoring](https://github.com/sponsors/mayank1513) or [joining a course](https://mayank-chaudhari.vercel.app/courses) to support this work.

---

<p align="center" style="text-align:center">with 💖 by <a href="https://mayank-chaudhari.vercel.app" target="_blank">Mayank Kumar Chaudhari</a></p>
