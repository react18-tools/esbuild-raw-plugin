---
esbuild-raw-plugin: minor
---

### ✨ Enhancements

- Replaced `textExtensions` with `customLoaders` for fine-grained extension-to-loader mapping.
- Introduced `name` option for overriding the plugin name (useful for debugging or deduplication).
- Added support for multiple query-based loaders: `?text`, `?base64`, `?dataurl`, `?file`, `?binary`.
- Improved fallback logic for resolving files: now tries extensions or `index.[ext]` for folders.
- Regex-based `onLoad` filtering boosts performance (leveraging Go-native ESBuild internals).

### 🛠 Internal Refactors

- Code refactored for better readability and maintainability.
- Error messages are now clearer and more actionable.
- Switched to consistent plugin naming (`"esbuild-raw-plugin"` instead of randomized suffix).
