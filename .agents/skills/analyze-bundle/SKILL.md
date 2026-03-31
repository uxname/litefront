---
name: analyze-bundle
description: Use this skill when the user asks to analyze the bundle size, find large dependencies, optimize the build output, check what's included in the bundle, or reduce the app size. Trigger phrases: "анализ бандла", "размер бандла", "analyze bundle", "bundle size", "что в бандле", "оптимизация сборки", "large bundle", "reduce bundle size".
version: 1.0.0
---

# Analyze Bundle

Analyzes the production bundle to identify size issues and optimization opportunities.

## Generate Bundle Report

```bash
ANALYZE=true npm run build:vite
```

This generates `stats.html` in the project root (via `rollup-plugin-visualizer`). Open it in a browser to see an interactive treemap of the bundle.

Alternatively, build and open directly:

```bash
# Linux
npm run build:vite && xdg-open stats.html
# macOS
npm run build:vite && open stats.html
```

## Reading the Visualizer

- **Large boxes** = large chunks — investigate these first
- **node_modules boxes** = third-party dependencies
- **src/ boxes** = your application code

## Common Issues and Fixes

### Large third-party libraries

Check if the library supports tree-shaking. Import only what you need:

```ts
// Bad — imports entire library
import _ from "lodash";

// Good — imports only the function
import debounce from "lodash/debounce";
```

### Routes not code-split

TanStack Router automatically code-splits routes. Verify your route components are not imported statically elsewhere.

### Icons imported wholesale

Lucide React supports tree-shaking — import individual icons:

```ts
// Good
import { Home, User, Settings } from "lucide-react";
```

### Large assets in JS bundle

Images and fonts should be in `public/` or `src/assets/`, not imported into JS as data URLs.

## Lazy Loading Routes

For pages with heavy dependencies, ensure they're loaded lazily. TanStack Router does this automatically via file-based routing — each route is a separate chunk.

## Bundle Size Budget

General targets for a modern SPA:
- Initial JS (gzipped): < 200KB
- Per-route chunk: < 100KB
- Total assets: < 2MB

## Optimization Checklist

- [ ] Run `ANALYZE=true npm run build:vite` and open `stats.html`
- [ ] Identify the largest 3-5 chunks
- [ ] Check if large libraries have lighter alternatives
- [ ] Verify routes are code-split (separate chunks in visualizer)
- [ ] Ensure images are optimized (vite-plugin-image-optimizer handles this at build time)
- [ ] Remove unused dependencies (`npm run knip` catches unused packages)
