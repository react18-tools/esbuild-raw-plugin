# esbuild-raw-plugin

## 0.3.1

### Patch Changes

- 6959695: fix: backward compatibility - add support for and deprecate the deprecated textExtensions field in raw plugin options

## 0.3.0

### Minor Changes

- a899336: ### ✨ Enhancements
  - Replaced `textExtensions` with `customLoaders` for fine-grained extension-to-loader mapping.
  - Introduced `name` option for overriding the plugin name (useful for debugging or deduplication).
  - Added support for multiple query-based loaders: `?text`, `?base64`, `?dataurl`, `?file`, `?binary`.
  - Improved fallback logic for resolving files: now tries extensions or `index.[ext]` for folders.
  - Regex-based `onLoad` filtering boosts performance (leveraging Go-native ESBuild internals).

  ### 🛠 Internal Refactors
  - Code refactored for better readability and maintainability.
  - Error messages are now clearer and more actionable.
  - Switched to consistent plugin naming (`"esbuild-raw-plugin"` instead of randomized suffix).

## 0.2.0

### Minor Changes

- d0c3c48: - Added support for custom loaders (loader option) to handle different file processing methods.
  - Introduced textExtensions option to specify extensions that should be treated as text files.
  - Improved documentation and clarified plugin usage.

## 0.1.1

### Patch Changes

- c32902e: Fix a bug in autoimport logic

## 0.1.0

### Minor Changes

- 8a7e550: Autocomplete extensions if not added in import statement.
