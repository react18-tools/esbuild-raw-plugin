# Esbuild Raw Plugin <img src="https://raw.githubusercontent.com/mayank1513/mayank1513/main/popper.png" style="height: 40px"/>

[![test](https://github.com/react18-tools/esbuild-raw-plugin/actions/workflows/test.yml/badge.svg)](https://github.com/react18-tools/esbuild-raw-plugin/actions/workflows/test.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/aa896ec14c570f3bb274/maintainability)](https://codeclimate.com/github/react18-tools/esbuild-raw-plugin/maintainability) [![codecov](https://codecov.io/gh/react18-tools/esbuild-raw-plugin/graph/badge.svg)](https://codecov.io/gh/react18-tools/esbuild-raw-plugin) [![Version](https://img.shields.io/npm/v/esbuild-raw-plugin.svg?colorB=green)](https://www.npmjs.com/package/esbuild-raw-plugin) [![Downloads](https://img.jsdelivr.com/img.shields.io/npm/d18m/esbuild-raw-plugin.svg)](https://www.npmjs.com/package/esbuild-raw-plugin) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/esbuild-raw-plugin) [![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/from-referrer/)

**An ESBuild/TSUP plugin to import files as raw text.**  
Ideal for scenarios like importing code files for documentation, interactive tools like `react-live`, or other text-based use cases.

> <img src="https://raw.githubusercontent.com/mayank1513/mayank1513/main/popper.png" style="height: 20px"/> Star [this repository](https://github.com/react18-tools/esbuild-raw-plugin) and share it with your friends.

---

## Features

- Import any file (e.g., `.js`, `.ts`, `.css`, etc.) as raw text.
- Works seamlessly with **ESBuild** and **TSUP**.
- Perfect for documentation generators, live code editors, and similar tools.

---

## Installation

Using npm:

```bash
npm install esbuild-raw-plugin --save-dev
```

Using yarn:

```bash
yarn add esbuild-raw-plugin --dev
```

Using pnpm:

```bash
pnpm add esbuild-raw-plugin --save-dev
```

---

## Usage

### ESBuild Configuration

Add the plugin to your ESBuild configuration:

```js
import { build } from "esbuild";
import { raw } from "esbuild-raw-plugin";

build({
  entryPoints: ["src/index.js"],
  bundle: true,
  outfile: "out.js",
  plugins: [raw()],
});
```

### TSUP Configuration

Add the plugin to your TSUP configuration:

```js
import { defineConfig } from "tsup";
import { raw } from "esbuild-raw-plugin";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  esbuildPlugins: [raw()],
});
```

---

## IDE Setup for IntelliSense and Type Checking

Add following to your declaration file. If you do not have one, create `declarations.d.ts` file and add following.

```typescript
declare module "*?raw" {
  const value: string;
  export default value;
}
```

## Importing Files as Raw Text

With the plugin enabled, you can import files as raw text directly:

```js
import myCode from "./example.js?raw";

console.log(myCode);
// Outputs the content of 'example.js' as a string.
```

### Good News:

With the latest update, you no longer need to specify the file extension explicitly.

```js
import myCode from "./example?raw";
```

This works seamlessly! Additionally, if you're exporting from files like `index.tsx`, `index.jsx`, etc., you can simplify imports. For example, if your file path is `my-lib/index.ts`, you can import the raw content like this:

```js
import myCode from "./my-lib?raw";
```

### Extension Options (Optional)

```ts
export interface RawPluginOptions {
  /**
   * Extensions to check in order if the file does not exist.
   * If it's a directory, the plugin will look for `dir/index.[ext]`.
   * @defaultValue ["tsx", "ts", "jsx", "js", "mjs", "mts", "module.css", "module.scss", "css", "scss"]
   *
   * You can provide your own extensions to optimize build performance or extend the list based on your use case.
   */
  ext?: string[];
}
```

### Supported File Types

You can use `?raw` with any file type, including:

- `.js`, `.ts`, `.jsx`, `.tsx`
- `.css`, `.scss`
- `.html`
- `.md`
- and more!

---

## Example Use Case

### Live Code Preview with `react-live`

```jsx
import React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import exampleCode from "./example.js?raw";

const App = () => (
  <LiveProvider code={exampleCode}>
    <LiveEditor />
    <LiveError />
    <LivePreview />
  </LiveProvider>
);

export default App;
```

---

## Why Use `esbuild-raw-plugin`?

- Simplifies importing files as raw text for documentation and live previews.
- Seamlessly integrates with modern build tools like ESBuild and TSUP.
- Lightweight and easy to configure.

---

## Keywords

`esbuild`, `esbuild-plugin`, `tsup-plugin`, `raw-text-import`, `import-as-text`, `file-loader`, `react-live`, `documentation-tools`, `frontend-tooling`

---

## Contributing

Contributions are welcome!  
Feel free to open issues or pull requests to improve the plugin.

---

Let me know if you'd like further tweaks! 🚀

![Alt](https://repobeats.axiom.co/api/embed/1ae166ef108b33b36ceaa60be208a5dafce25c5c.svg "Repobeats analytics image")

---

## License

This library is licensed under the MPL-2.0 open-source license.

> <img src="https://raw.githubusercontent.com/mayank1513/mayank1513/main/popper.png" style="height: 20px"/> Please enroll in [our courses](https://mayank-chaudhari.vercel.app/courses) or [sponsor](https://github.com/sponsors/mayank1513) our work.

<hr />

<p align="center" style="text-align:center">with 💖 by <a href="https://mayank-chaudhari.vercel.app" target="_blank">Mayank Kumar Chaudhari</a></p>
