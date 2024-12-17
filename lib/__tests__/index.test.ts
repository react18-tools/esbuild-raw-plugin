import { beforeAll, describe, test } from "vitest";
import esbuild, { BuildOptions } from "esbuild";
import path from "node:path";
import { raw } from "../src";
import fs from "node:fs";

const buildOptions: BuildOptions = {
  format: "cjs",
  target: "es2019",
  sourcemap: false,
  bundle: true,
  minify: true,
  entryPoints: [path.resolve(__dirname, "test.ts")],
  outdir: "__tests__/dist",
  treeShaking: true,
  plugins: [raw()],
};

describe("WebGL plugins", () => {
  test("test raw import", async ({ expect }) => {
    await esbuild.build(buildOptions);
    const fileContent = fs.readFileSync(path.resolve(__dirname, "../src/index.ts"), "utf-8");
    // @ts-ignore
    const generatedCodeContent = (await import("./dist/test.js")).getText();
    expect(fileContent).toBe(generatedCodeContent);
  });

  test("test raw import with auto ext", async ({ expect }) => {
    await esbuild.build({ ...buildOptions, entryPoints: [path.resolve(__dirname, "test1.ts")] });
    const fileContent = fs.readFileSync(path.resolve(__dirname, "../src/index.ts"), "utf-8");
    // @ts-ignore
    const generatedCodeContent = (await import("./dist/test1.js")).getText();
    expect(fileContent).toBe(generatedCodeContent);
  });
});
