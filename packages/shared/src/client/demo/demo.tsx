"use client";

import styles from "./demo.module.scss";
import { LiveProvider, LiveEditor, LivePreview } from "react-live";
import { Dots1, Dots2, Bars1, Bars2 } from "react18-loaders/dist/server";
import text from "./index.ts?raw";
import code from "./loader-demo?raw";

/** React live demo */
export function Demo() {
  console.log({ text });
  return (
    <LiveProvider code={code.replace(/import.*/, "")} scope={{ Dots1, Dots2, Bars1, Bars2 }}>
      <div className={styles.demo}>
        <LiveEditor className={styles.code} />
        <LivePreview className={styles.preview} />
      </div>
    </LiveProvider>
  );
}
