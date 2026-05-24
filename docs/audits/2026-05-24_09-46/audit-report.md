# Full Audit Report — 2026-05-24 09:46

## Компоненты системы

1. **Аутентификация** — `features/auth/*`, `routes/callback.tsx`, `routes/protected/*`
2. **Роутинг и Страницы** — `routes/*`, `pages/{home,protected,404}/*`
3. **Виджеты** — `widgets/Header/*`
4. **Сущности** — `entities/counter/*`
5. **Общие UI-компоненты** — `shared/ui/{ErrorFallback,Toaster}/*`
6. **API-слой** — `shared/api/graphql-client.ts`
7. **Конфигурация** — `shared/config/env.ts`
8. **Мониторинг (Sentry)** — `shared/lib/sentry/*`
9. **Провайдеры приложения** — `app/providers/GlobalErrorBoundary.tsx`
10. **Сборка и Деплой** — `Dockerfile`, `.dockerignore`, `.env.example`, `.gitignore`, `Caddyfile`
11. **CI и Тесты** — `lefthook.yml`, `package.json`, `tsconfig.json`, `tests/*`
12. **Генерация кода** — `generated/graphql.tsx`, `generated/routeTree.gen.ts`

---

## Компонент: Аутентификация

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| VAL-01 | OIDC callback без validateSearch | ❌ FAIL 🟡 | `src/routes/callback.tsx:15` — `createFileRoute("/callback")` без `validateSearch` | **1. Добавить validateSearch с zod-схемой** \\ 2. Добавить parseSearchWith для дефолтной валидации \\ 3. OIDC-библиотека проверяет state внутренне — риск снижен | Нет |
| ERR-05 | Нет таймаутов OIDC | ❌ FAIL 🟠 | `src/features/auth/api/oidc-client.ts:4-12` — нет конфигурации таймаута | **1. Добавить timeout в AuthProvider** \\ 2. Использовать AbortSignal.timeout() \\ 3. Добавить глобальный timeout в oidc-client | Нет |
| YAGNI-02 | Dead code: AuthGuard не используется | ❌ FAIL 🟡 | `src/features/auth/ui/AuthGuard.tsx:11` — экспортирован, но нигде не импортирован | **1. Удалить AuthGuard** \\ 2. Подключить к protected-роуту \\ 3. Оставить как документированный компонент | Нет |
| YAGNI-02 | Dead code: AuthState, AuthActions, AuthStore, User | ❌ FAIL 🟡 | `src/features/auth/model/types.ts` — типы не потребляются | **1. Удалить неиспользуемые типы** \\ 2. Оставить только используемый AuthStore | Нет |
| ERR-09 | Нет AbortSignal в OIDC | ❌ FAIL 🟠 | `oidc-client.ts` — не принимает signal | **См. ERR-05** | Нет |

## Компонент: Общие UI-компоненты (ErrorFallback)

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| BUG-03 | JSON.stringify крашит fallback | ❌ FAIL 🟡 | `src/shared/ui/ErrorFallback/index.tsx:126` — `JSON.stringify(error)` без try-catch | **1. Обернуть в try-catch** \\ 2. Использовать `String(error)` \\ 3. Использовать safeStringify | Нет |
| OWA-07 | Stack trace в production UI | ❌ FAIL 🟠 | `src/shared/ui/ErrorFallback/index.tsx:265-269` — `normalizedError.stack` без `import.meta.env.PROD` | **1. Обернуть в `if (import.meta.env.DEV)`** \\ 2. Показывать Sentry event ID вместо stack trace в production \\ 3. Логировать в Sentry, не показывать пользователю | Нет |
| ERR-08 | Retry без exponential backoff | ❌ FAIL 🟠 | `ErrorFallback/index.tsx:153-161` — `handleRetry` делает мгновенную попытку | **1. Добавить attempt-счётчик с увеличивающейся задержкой** \\ 2. Установить `@urql/exchange-retry` \\ 3. Добавить jitter в retry-логику | Нет |
| LOG-01 | console.error в ErrorFallback | ❌ FAIL 🟡 | `src/shared/ui/ErrorFallback/index.tsx:181` — `console.error("Failed to copy", err)` | **1. Заменить на Sentry captureException** \\ 2. Обернуть в DEV-условие | Нет |
| ERR-02 | Stack trace утекает (cross-ref) | ⚠️ WARN | См. OWA-07 | — | — |

## Компонент: API-слой

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| ERR-05 | Нет таймаутов GraphQL | ❌ FAIL 🟠 | `src/shared/api/graphql-client.ts:4-29` — URQL без fetchOptions.timeout | **1. Добавить `fetchOptions: { signal: AbortSignal.timeout(15000) }`** \\ 2. Использовать custom fetch с таймаутом \\ 3. Установить @urql/exchange-retry | Нет |
| ERR-09 | Нет AbortSignal в URQL | ❌ FAIL 🟠 | `graphql-client.ts` — не принимает signal | **1. Добавить поддержку signal в обёртку** \\ 2. Рассмотреть TanStack Query | Нет |
| ARC-05 | import.meta.env напрямую | ❌ FAIL 🟠 | `src/shared/api/graphql-client.ts:6` — VITE_GRAPHQL_API_URL | **См. Конфигурация** | Нет |

## Компонент: Конфигурация

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| ARC-05 | import.meta.env напрямую (4 файла) | ❌ FAIL 🟠 | `oidc-client.ts:5-9`, `graphql-client.ts:6`, `sentry/config.ts:4,10,12,22`, `main.tsx:68` | **1. Заменить на импорт из `@shared/config/env`** \\ 2. Удалить env.ts если не используется \\ 3. Добавить runtime-валидацию env при старте | Нет |
| YAGNI-02 | Dead code: env.ts и PORT | ❌ FAIL 🟡 | `shared/config/env.ts` — экспорт нигде не импортирован | **1. Удалить env.ts** \\ 2. Подключить потребителей к env.ts | Нет |
| NAM-05 | Magic string "3000" | ❌ FAIL 🟢 | `shared/config/env.ts:24` — `PORT: import.meta.env.PORT \|\| "3000"` | **1. Вынести в DEFAULT_PORT = "3000"** | Нет |

## Компонент: Мониторинг (Sentry)

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| ARC-05 | import.meta.env в sentry/config | ❌ FAIL 🟠 | `src/shared/lib/sentry/config.ts:4,10,12,22` | **См. Конфигурация** | Нет |
| LOG-01 | console.warn в sentry/config | ❌ FAIL 🟡 | `src/shared/lib/sentry/config.ts:5` — `console.warn("Sentry DSN not configured")` | **1. Обернуть в `if (import.meta.env.DEV)`** \\ 2. Удалить, Sentry сам логирует отсутствие DSN | Нет |

## Компонент: Провайдеры приложения

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| LOG-01 | console.error в GlobalErrorBoundary | ❌ FAIL 🟡 | `src/app/providers/GlobalErrorBoundary.tsx:9` — `console.error("Uncaught Promise...")` | **1. Заменить на Sentry captureMessage** \\ 2. Удалить (Sentry уже ловит) | Нет |
| LOG-07 | event.reason без санитизации | ⚠️ WARN | `GlobalErrorBoundary.tsx:9` — `event.reason` логируется без санитизации | **1. Санитизировать перед console.error** \\ 2. Передавать только message | Нет |
| ERR-04 | Нет window.error обработчика | ⚠️ WARN | `GlobalErrorBoundary.tsx:8-14` — только unhandledrejection | **1. Добавить `window.addEventListener('error', handler)`** | Нет |

## Компонент: Сборка и Деплой

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| SEC-04 | .env.example с реальными credentials | ❌ FAIL 🟠 | `.env.example:7-8` — `VITE_OIDC_AUTHORITY=https://oalmxx.logto.app/oidc`, `VITE_OIDC_CLIENT_ID=foxpqpb09d3rzxn9r4pfj` | **1. Заменить на `https://your-oidc-provider.example.com`** \\ 2. Отозвать реальные client_id \\ 3. Добавить комментарий о замене | Нет |
| SEC-02 | .dockerignore: .env закомментирован | ⚠️ WARN | `.dockerignore:6` — `#.env` | **1. Раскомментировать `.env`** \\ 2. Добавить `.env.*` | Нет |
| DEP-04 | .git и .env в Docker build context | ❌ FAIL 🟠 | `.dockerignore` — нет `.git`; `.env` закомментирован | **1. Добавить `.git` и `.env` в .dockerignore** \\ 2. Копировать только `.git/HEAD` + `.git/refs/` | Нет |
| DEP-08 | .env.example неполный | ❌ FAIL 🟠 | Нет `VITE_MOCK_AUTH` и `VITE_APP_VERSION` | **1. Добавить `VITE_MOCK_AUTH=false`** \\ **2. Добавить `VITE_APP_VERSION=development`** | Нет |
| DEP-09 | NODE_ENV не установлен | ❌ FAIL 🟠 | Dockerfile — нет `ENV NODE_ENV=production` | **1. Добавить `ENV NODE_ENV=production`** \\ 2. Заменить `npm run build` на `npm run build:vite` | Нет |

## Компонент: CI и Тесты

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| SEC-07 | Нет secret scanning | ❌ FAIL 🟠 | `lefthook.yml` — pre-commit без gitleaks/trufflehog | **1. Добавить `gitleaks detect` в lefthook** \\ 2. Добавить GitHub Action с gitleaks \\ 3. Использовать trufflehog | Нет |
| TST-02 | Coverage thresholds не в CI | ⚠️ WARN | `vite.config.ts:157-162` — thresholds есть, но `.github/workflows/` отсутствует | **1. Добавить GitHub Actions** \\ 2. Запускать `npm run test:cov` при push | Нет |

## Компонент: Аутентификация (доп. OWASP)

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| OWA-05 | dev-сервер на 0.0.0.0 | ❌ FAIL 🟡 | `vite.config.ts:26` — `host: "0.0.0.0"` | **1. Заменить на `host: "localhost"`** \\ 2. Оставить для Docker, документировать риск | Нет |

---

## Сводка

| Компонент | 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low | ⏸ ACCEPTED | Итого FAIL |
|-----------|-----------|---------|----------|--------|------------|------------|
| Аутентификация | 0 | 3 | 3 | 0 | 0 | 6 |
| Общие UI | 0 | 2 | 2 | 0 | 0 | 4 |
| API-слой | 0 | 2 | 0 | 0 | 0 | 2 |
| Конфигурация | 0 | 1 | 1 | 1 | 0 | 3 |
| Мониторинг | 0 | 1 | 1 | 0 | 0 | 2 |
| Провайдеры | 0 | 0 | 1 | 0 | 0 | 1 |
| Сборка/Деплой | 0 | 4 | 0 | 0 | 0 | 4 |
| CI/Тесты | 0 | 1 | 0 | 0 | 0 | 1 |
| **ИТОГО** | **0** | **14** | **8** | **1** | **0** | **23** |

## Критические риски 🔴

Нет — все FAIL уровня 🟠 (High) и 🟡 (Medium).

## Разбор FAIL 🟠

### 🟠 SEC-04 — Сборка/Деплой
**Файл:** `.env.example:7-8`
**Проблема:** Реальные dev-credentials (Logto tenant, client ID) в репозитории.
**Решение:** Заменить на placeholder-значения, отозвать client_id.

### 🟠 SEC-07 — CI/Тесты
**Файл:** `lefthook.yml`
**Проблема:** Нет secret scanning в pre-commit и CI.
**Решение:** Добавить gitleaks в lefthook + GitHub Action.

### 🟠 OWA-07 — Общие UI
**Файл:** `shared/ui/ErrorFallback/index.tsx:265-269`
**Проблема:** Stack trace показывается пользователю в production.
**Решение:** Обернуть в `if (import.meta.env.DEV)`.

### 🟠 ERR-05 — API-слой + Аутентификация
**Файл:** `shared/api/graphql-client.ts:4-29`, `features/auth/api/oidc-client.ts:4-12`
**Проблема:** Нет таймаутов для GraphQL и OIDC запросов.
**Решение:** Добавить `AbortSignal.timeout(15000)`.

### 🟠 ERR-08 — Общие UI
**Файл:** `ErrorFallback/index.tsx:153-161`
**Проблема:** Retry без exponential backoff.
**Решение:** Добавить attempt-счётчик с увеличивающейся задержкой.

### 🟠 ERR-09 — API-слой + Аутентификация
**Файл:** `graphql-client.ts`, `oidc-client.ts`
**Проблема:** Нет AbortSignal — запросы нельзя отменить.
**Решение:** Добавить поддержку signal.

### 🟠 ARC-05 — Конфигурация (4 файла)
**Файл:** `oidc-client.ts:5-9`, `graphql-client.ts:6`, `sentry/config.ts:4,10,12,22`, `main.tsx:68`
**Проблема:** `import.meta.env.*` напрямую вместо `shared/config/env.ts`.
**Решение:** Заменить на импорт из `@shared/config/env`.

### 🟠 DEP-04 — Сборка/Деплой
**Файл:** `.dockerignore`
**Проблема:** `.git` не исключён, `.env` закомментирован — секреты в Docker build context.
**Решение:** Добавить `.git` и `.env` в `.dockerignore`.

### 🟠 DEP-08 — Сборка/Деплой
**Файл:** `.env.example`
**Проблема:** Отсутствуют `VITE_MOCK_AUTH` и `VITE_APP_VERSION`.
**Решение:** Добавить недостающие переменные.

### 🟠 DEP-09 — Сборка/Деплой
**Файл:** `Dockerfile`
**Проблема:** `NODE_ENV` не установлен; `npm run build` запускает лишние проверки.
**Решение:** Добавить `ENV NODE_ENV=production`; заменить на `npm run build:vite`.

---

## Проведённые аудиты (15 из 14)

| # | Аудит | Статус | Файл |
|---|-------|--------|------|
| 1 | Secrets Leak | ✅ 4 PASS, 2 FAIL | `audit-secrets.md` |
| 2 | OWASP Security | ✅ 2 PASS, 2 FAIL | `audit-owasp.md` |
| 3 | Boundary Validation | ✅ 5 PASS, 1 FAIL | `audit-validation.md` |
| 4 | Bugs & Logic | ✅ 7 PASS, 1 FAIL | `audit-bugs.md` |
| 5 | Error Handling | ✅ 3 PASS, 3 FAIL | `audit-errors.md` |
| 6 | Concurrency | ✅ 3 PASS, 0 FAIL | `audit-concurrency.md` |
| 7 | Architecture | ✅ 5 PASS, 1 FAIL | `audit-architecture.md` |
| 8 | Naming | ✅ 6 PASS, 1 FAIL | `audit-naming.md` |
| 9 | YAGNI | ✅ 3 PASS, 1 FAIL | `audit-yagni.md` |
| 10 | Tests & Linters | ✅ 5 PASS, 0 FAIL | `audit-tests.md` |
| 11 | Logging | ✅ 1 PASS, 1 FAIL | `audit-logging.md` |
| 12 | Performance | ✅ 3 PASS, 0 FAIL | `audit-performance.md` |
| 13 | Deployment | ✅ 1 PASS, 3 FAIL | `audit-deployment.md` |
| 14 | API Contracts | ✅ 2 PASS, 0 FAIL | `audit-api-contracts.md` |
| 15 | Meta Control | — | `audit-meta.md` |
| — | Verification | 23 confirmed, 1 FP | `audit-verify.md` |

---

## Верификация

Все 23 FAIL/WARNING находки подтверждены: код по указанным `file:line` существует. 1 False Positive в `audit-meta.md` (написан до завершения остальных аудитов).

**Папка сессии:** `docs/audits/2026-05-24_09-46/`
**Всего FAIL:** 23 (0 🔴, 14 🟠, 8 🟡, 1 🟢)
