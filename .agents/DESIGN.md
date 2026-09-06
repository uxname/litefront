# Style — code, TypeScript, styling, theming & i18n

## Code style

- **English only** for code, comments and identifiers (repo-wide rule).
- 2-space indent, LF endings, trailing whitespace trimmed (EditorConfig).
- **Biome is the source of truth for formatting**; it formats JS/TS with **double
  quotes** and organizes imports (`organizeImports: on`).
- Unused imports, variables and parameters are **errors** (Biome + TS).
- Prefer small focused functions and explicit interfaces over clever generics.

## TypeScript

- `strict: true` — avoid `any`; prefer typed interfaces and unions.
- `noUnusedLocals` / `noUnusedParameters` are on.
- `useUnknownInCatchVariables` is **false**, so a caught error is typed `any`. Narrow
  it manually — this app's core is error normalization, so don't lean on the default.
- Use the path aliases (`@shared/*`, `@entities/*`, `@features/*`, `@widgets/*`,
  `@pages/*`, `@generated/*`, `@public/*`) rather than deep relative paths.
- `tsc --noEmit` currently checks only the app program: `vite.config.ts`,
  `vitest.config.ts` and the two Vite plugins live in `tsconfig.node.json`, which
  nothing typechecks and which has no `strict`. Treat changes there as unchecked and
  verify by running the build.

## Styling

- **Tailwind CSS v4** (+ SCSS modules if ever needed). Utility-first; keep any module
  styles scoped.
- Stylelint runs on `**/*.{css,scss}` and allows SCSS at-rules.
- **Use daisyUI semantic tokens, never hardcoded palette colors.** Use
  `bg-base-100/200/300`, `text-base-content` (`/60` for muted), `border-base-300`,
  `text-primary`, `text-error/success/info/warning`, and `*-content` for text on accent
  fills. **Never** `bg-white`, `text-slate-900`, `text-indigo-600`, `bg-red-50` — those
  ignore `data-theme` and stay light in dark mode. This exact mistake is why the theme
  once looked broken. Decorative gradient orbs are the only allowed exception.

## Theming

Two themes are declared in `src/index.css`: `cmyk` (light, default) and `dark`. The
toggle (`src/features/theme`) is a Zustand store that sets
`document.documentElement[data-theme]` and persists to `localStorage`, re-applying on
rehydrate.

The theme key is written in **two** places — the store and the blocking pre-paint
script in `src/routes/__root.tsx`. They must match, or dark-mode users get a flash of
the light theme on every load. (`scripts/rename-project.sh` in the meta-repo renames
both.)

## i18n (Paraglide JS)

Messages live in `messages/{en,ru}.json`; generated accessors in
`src/generated/paraglide`. The switcher is `src/features/locale`. Strategy order is set
in `vite.config.ts`:

```ts
strategy: ["cookie", "localStorage", "preferredLanguage", "baseLocale"]
```

- **`cookie` is first** because it is the only writable strategy the SSR server can
  read (Paraglide middleware in `src/server.ts`), so server render and client hydration
  agree on the locale. `setLocale` writes both cookie and localStorage, so an explicit
  choice wins over the browser language on reload.
- **`baseLocale` ("en") must stay last.** It is the guaranteed fallback: any unsupported
  locale is validated away by `toLocale()` and falls through to `en`. Remove it and
  `getLocale()` can throw "No locale found".
- A key missing from a non-base locale compiles to an alias of the base message, so
  untranslated strings render in English instead of breaking. Keep `en.json` and
  `ru.json` at full key parity anyway.
- Changing the strategy requires a **dev-server restart / rebuild** — it is compiled
  into `src/generated/paraglide/runtime.js`.
- **Adding a language:** add the code to `locales` in `project.inlang/settings.json`,
  create `messages/<locale>.json`, rebuild. `LocaleSwitcher` lists every locale
  automatically via `Intl.DisplayNames`.

**Adding a string:** add the key to **all** message files, then use `m.<key>()`. Never
hardcode user-facing text in a component.

> Numbers inside message text (e.g. "must be 1–100 characters") duplicate a validation
> limit. When you change a limit, update the schema, the messages, and the tests
> together — this trio has drifted before.

## Generated code

`src/generated/**` is generated (GraphQL + route tree + Paraglide). Never edit it by
hand; regenerate. Biome and knip ignore it.
