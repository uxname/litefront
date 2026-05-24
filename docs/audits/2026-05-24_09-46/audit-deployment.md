# Audit Report: Build & Deployment Configuration — 2026-05-24 09:46

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| DEP-04 | .dockerignore исключает node_modules, .git, .env | FAIL | HIGH | `.dockerignore:1` — `node_modules/` есть; `.git` отсутствует; `#.env` — закомментирован, `.env` НЕ исключён. Dockerfile:13 явно копирует `.git` (для `vite-plugin-version-mark`). | Добавить `.git` и `.env` (раскомментировать) в `.dockerignore`. Если `.git` нужен для версионирования — копировать только `.git/HEAD` + `.git/refs/heads/`, а не весь `.git`. | ✅ `.env` НЕ исключается — Vite требует VITE_* на build stage. `.git` в контексте сборки (нужен для версионирования). Runtime-образ (Caddy) содержит только dist/ — secrets не попадают в прод. |
| DEP-07 | .env исключён из VCS | PASS | HIGH | `.gitignore:6` — `.env` присутствует. | — | — |
| DEP-08 | .env.example документирует все переменные окружения | FAIL | HIGH | В коде используются `VITE_MOCK_AUTH` (`src/main.tsx:68`) и `VITE_APP_VERSION` (`src/shared/lib/sentry/config.ts:12`), но они отсутствуют в `.env.example`. | Добавить `VITE_MOCK_AUTH=false` и `VITE_APP_VERSION=development` в `.env.example`. | ✅ Добавлены в .env.example и .env |
| DEP-09 | NODE_ENV корректно устанавливается для production | FAIL | HIGH | Dockerfile не устанавливает `NODE_ENV=production` ни для build-стадии, ни для runtime. `vite.config.ts:33` использует `process.env.NODE_ENV` для sourcemap. Также `npm run build` в Dockerfile запускает `check` (tsc, stylelint, biome, knip, steiger) — это лишнее и может сломать сборку. | Добавить `ENV NODE_ENV=production` в build-stage; заменить `npm run build` на `npm run build:vite`. | ✅ Dockerfile: `ENV NODE_ENV=production` + `RUN npm run build:vite` |

## Findings

### Файлы проверено: 7
- `Dockerfile` — мультистейдж (node:lts-alpine → caddy:alpine), корректный SPA-деплой на Caddy
- `.dockerignore` — 10 записей, но `.env` закомментирован, `.git` не исключён
- `.env.example` — 11 переменных, но не хватает `VITE_MOCK_AUTH` и `VITE_APP_VERSION`
- `.gitignore` — `.env` исключён (OK)
- `package.json` — скрипты, `build` запускает `build:vite && check`
- `Caddyfile` — корректная SPA-конфигурация Caddy (security headers, SPA fallback, asset caching, zstd+gzip)
- `vite.config.ts` — sourcemap conditional на `NODE_ENV`

### Пропущено файлов: 2
- `.github/workflows/*.yml` — не найдены (CI/CD пайплайн отсутствует)
- `nginx.conf` — не используется (замена на Caddy)

### Критические проблемы

1. **Dockerfile запускает лишнюю проверку**: `npm run build` = `build:vite` + `check`. `check` запускает tsc, stylelint, biome, knip, steiger — это не нужно в Docker-сборке и увеличивает время билда + риск падения.

2. **`.dockerignore` не защищает `.env`**: строка `#.env` закомментирована — все `.env` файлы попадают в Docker build context. Потенциальная утечка секретов в слоях Docker-образа.

3. **Неполный `.env.example`**: `VITE_MOCK_AUTH` и `VITE_APP_VERSION` используются в рантайме, но не задокументированы.

4. **`NODE_ENV` не установлен**: Vite в production mode корректно работает через `import.meta.env.PROD`, но `vite.config.ts:33` проверяет `process.env.NODE_ENV` для sourcemap — без явной установки `NODE_ENV=production` sourcemap будут включены в production-сборке.

### Non-critical

- `.git` в build context — оправдано для `vite-plugin-version-mark` (git log), но можно оптимизировать: скопировать только `.git/HEAD` и `.git/refs/heads/`.
- Sentry `authToken` описан пустым в `.env.example` — не секрет, но лучше перенести в CI-secrets документацию.
- CI/CD pipeline отсутствует (no `.github/workflows/`).

## Audit Coverage
Файлов проверено: 7 | Пропущено: 2
