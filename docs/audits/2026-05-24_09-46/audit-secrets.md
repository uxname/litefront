# Audit Report: Secrets Leak — 2026-05-24 09:46

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| SEC-01 | Нет hardcoded credentials в коде | ✅ PASS | High | `src/features/auth/ui/MockAuthProvider.tsx:15-16` содержит `mock-access-token`, `mock-id-token` — это явно тестовые данные (префикс `mock-`), не рабочие credentials. Все реальные конфиги читаются через `import.meta.env.*`. Остальные файлы (`oidc-client.ts`, `graphql-client.ts`, `env.ts`, `main.tsx`) не содержат hardcoded secrets. | — | — |
| SEC-02 | Файлы с секретами исключены из VCS (.env\* в .gitignore) | ⚠️ WARNING | High | `.gitignore:6` содержит `.env` — `git check-ignore .env` подтверждает игнор. **Проблемы:** (1) `.dockerignore:6` — `.env` **закомментирован** (`#.env`), файл с реальными credentials (`VITE_OIDC_CLIENT_ID=3y6zi7wftm18g27wegxm9`, `VITE_OIDC_AUTHORITY=https://auth.uxna.me/oidc`) включится в Docker build context. (2) `.gitignore` не содержит `.env.*` — `.env.local`, `.env.production` не будут игнорироваться. | **A:** `.dockerignore:6` — раскомментировать `.env`. **B:** `.gitignore` — добавить `.env.*` glob. **C:** Проверить `git ls-files` на предмет уже закоммиченных `.env*` файлов. | ❌ |
| SEC-03 | Секреты не передаются через URL | ✅ PASS | High | GraphQL URL: `VITE_GRAPHQL_API_URL=https://countries.trevorblades.com/graphql` — без credentials. OIDC authority URL: `import.meta.env.VITE_OIDC_AUTHORITY` — без Basic Auth, query params с секретами. Bearer token передаётся в HTTP-заголовке (`Authorization: Bearer ${accessToken}`), не в URL. | — | — |
| SEC-04 | .env.example содержит только placeholder-значения | ❌ FAIL | Medium | `.env.example:7-8` — `VITE_OIDC_AUTHORITY=https://oalmxx.logto.app/oidc` и `VITE_OIDC_CLIENT_ID=foxpqpb09d3rzxn9r4pfj` выглядят как **реальные dev-credentials** (Logto tenant + client ID). Должны быть placeholder-значениями. | **A:** Заменить на `https://your-oidc-provider.example.com`. **B:** Заменить на `your-client-id`. **C:** Убедиться, что эти credentials не отозваны, если настоящие. | ❌ |
| SEC-05 | Dockerfile не содержит секретов в ENV-директивах | ✅ PASS | High | `Dockerfile` — многоступенчатая сборка (node:lts-alpine → caddy:alpine). ENV-директив нет. Все переменные передаются через `import.meta.env` на этапе сборки. Runtime-образ (Caddy) не содержит env-секретов. | — | — |
| SEC-06 | Комментарии в коде не содержат credentials | ✅ PASS | High | Проверены все .ts/.tsx файлы в `src/`. Комментарии содержат только технические заметки, URL документации, пояснения к коду. Никаких passwords, tokens, API-keys в комментариях. | — | — |
| SEC-07 | Автоматическое сканирование секретов настроено (pre-commit или CI) | ❌ FAIL | High | `lefthook.yml` — pre-commit хук запускает только `npm run check` (stylelint, tsc, biome, knip, steiger). **Нет** dedicated secret scanner (gitleaks, trufflehog, ggshield, git-secrets). `.github/workflows/` отсутствует — CI пайплайн не настроен. | **A:** Добавить `gitleaks detect` в lefthook pre-commit. **B:** Добавить GitHub Action с `gitleaks-action`. **C:** Добавить `trufflehog` или `ggshield` в pre-commit hook. | ❌ |

## Summary

| Статус | Количество |
|--------|-----------|
| ✅ PASS | 4 |
| ⚠️ WARNING | 1 |
| ❌ FAIL | 2 |

## Критические находки

### 1. `.dockerignore` не исключает `.env` (SEC-02)
**Файл:** `.dockerignore:6`
**Фрагмент:**
```
#.env
```
**Риск:** Файл `.env` содержит реальные credentials (`VITE_OIDC_CLIENT_ID`, `VITE_OIDC_AUTHORITY`). Из-за закомментированной строки он попадает в Docker build context. На builds stage он копируется в образ; хотя в runtime-образ (Caddy) попадает только папка `dist`, секреты остаются в слое build-stage образа.

**Варианты решения:**
1. Раскомментировать `.env` в `.dockerignore`
2. Удалить закомментированную строку и написать активную
3. Заменить на `.env*` для исключения всех env-файлов

### 2. `.env.example` с реальными credentials (SEC-04)
**Файл:** `.env.example:7-8`
**Фрагмент:**
```
VITE_OIDC_AUTHORITY=https://oalmxx.logto.app/oidc
VITE_OIDC_CLIENT_ID=foxpqpb09d3rzxn9r4pfj
```
**Риск:** В репозитории (даже в `.env.example`) не должно быть реальных credentials. Если это production-credentials, они скомпрометированы. Если dev — это всё равно bad practice.

**Варианты решения:**
1. Заменить на `https://your-oidc-provider.example.com` и `your-client-id`
2. Отозвать реальные client_id, если они активны
3. Добавить комментарий о необходимости заменить значения

### 3. Отсутствие secret scanning automation (SEC-07)
**Риск:** Нет автоматической проверки на утечку секретов. Разработчик может случайно закоммитить `.env` или hardcoded токен — обнаружение произойдёт только постфактум.

**Варианты решения:**
1. `lefthook.yml` — добавить шаг `gitleaks detect --verbose`
2. GitHub Action: `gitleaks/gitleaks-action@v2` в `on: [push, pull_request]`
3. Использовать `trufflehog` или `git-secrets` как альтернативу

### 4. `.gitignore` не покрывает `.env.*` (SEC-02)
**Файл:** `.gitignore:6`
**Фрагмент:**
```
.env
```
**Риск:** Файлы `.env.local`, `.env.production`, `.env.staging` не будут игнорироваться. Если разработчик создаст такой файл, credentials утекут в репозиторий.

**Варианты решения:**
1. Добавить `.env.*` в `.gitignore`
2. Добавить `.env*.local` как более точный паттерн
3. Проверить `git ls-files` на наличие уже закоммиченных env-файлов

## Audit Coverage

| Модуль | Файлы проверено |
|--------|----------------|
| `src/features/auth/api/` | 1 (`oidc-client.ts`) |
| `src/features/auth/model/` | 1 (`types.ts`) |
| `src/features/auth/ui/` | 2 (`AuthGuard.tsx`, `MockAuthProvider.tsx`) |
| `src/shared/config/` | 2 (`env.ts`, `index.ts`) |
| `src/shared/api/` | 1 (`graphql-client.ts`) |
| `src/` | 1 (`main.tsx`) |
| `src/routes/` | 1 (`__root.tsx`) |
| Конфиги корня | 5 (`.env.example`, `.gitignore`, `.dockerignore`, `Dockerfile`, `lefthook.yml`) |

**Файлов проверено:** 14
**Пропущено:** 0
**Generated code excluded:** `src/generated/`, `node_modules/`, `dist/`
