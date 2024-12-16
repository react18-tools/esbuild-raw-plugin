import { beforeAll, describe, test } from "vitest";
import esbuild from "esbuild";
import path from "node:path";
import { raw } from "../src";
import fs from "node:fs";

describe("WebGL plugins", () => {
  beforeAll(async () => {
    await esbuild.build({
      format: "cjs",
      target: "es2019",
      sourcemap: false,
      bundle: true,
      minify: true,
      entryPoints: [path.resolve(__dirname, "test.ts")],
      outdir: "__tests__/dist",
      treeShaking: true,
      plugins: [raw()],
    });
  });
  test("test raw import", async ({ expect }) => {
    const fileContent = fs.readFileSync(path.resolve(__dirname, "../src/index.ts"), "utf-8");
    // @ts-ignore
    const generatedCodeContent = (await import("./dist/test.js")).getText();
    expect(fileContent).toBe(generatedCodeContent);
  });
});
