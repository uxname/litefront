# Audit Verification Report — 2026-05-24 09:46

## Результаты верификации

| Аудит-файл | ✅ Подтверждено | ❌ False Positive | ⚠️ Устарело | 🔍 Пропущено |
|------------|---------------|-----------------|------------|-------------|
| audit-secrets | 3 | 0 | 0 | 0 |
| audit-owasp | 2 | 0 | 0 | 0 |
| audit-validation | 1 | 0 | 0 | 0 |
| audit-errors | 5 | 0 | 0 | 0 |
| audit-logging | 3 | 0 | 0 | 0 |
| audit-performance | 0 (all PASS) | 0 | 0 | 0 |
| audit-architecture | 1 | 0 | 0 | 0 |
| audit-concurrency | 0 (all PASS) | 0 | 0 | 0 |
| audit-naming | 0 (all PASS) | 0 | 0 | 0 |
| audit-yagni | 2 | 0 | 0 | 0 |
| audit-bugs | 1 | 0 | 0 | 0 |
| audit-tests | 0 (all PASS) | 0 | 0 | 0 |
| audit-deployment | 3 | 0 | 0 | 0 |
| audit-api-contracts | 0 (all PASS) | 0 | 0 | 0 |
| audit-meta | 2 | 1 | 0 | 0 |
| **Итого** | **23** | **1** | **0** | **0** |

## Детальная верификация

### audit-secrets.md — 3 находки проверены

| Check | Тип | Доказательство | Статус | Комментарий |
|-------|-----|---------------|--------|-------------|
| SEC-02 | ⚠️ WARNING | `.dockerignore:6` — `#.env` закомментирован | ✅ Подтверждено | Файл существует, строка 6 содержит `#.env` |
| SEC-04 | ❌ FAIL | `.env.example:7-8` — `VITE_OIDC_AUTHORITY` / `VITE_OIDC_CLIENT_ID` с реальными dev-credentials | ✅ Подтверждено | Файл существует, строки 7-8 содержат реальные (`https://oalmxx.logto.app/oidc`, `foxpqpb09d3rzxn9r4pfj`) |
| SEC-07 | ❌ FAIL | `lefthook.yml` — нет secret scanner | ✅ Подтверждено | Файл существует, содержит только `npm run check` и `npm run test:all`, gitleaks/trufflehog отсутствует |

### audit-owasp.md — 2 находки проверены

| Check | Тип | Доказательство | Статус | Комментарий |
|-------|-----|---------------|--------|-------------|
| OWA-05 | FAIL | `vite.config.ts:26` — `host: "0.0.0.0"` | ✅ Подтверждено | Строка 26: `host: "0.0.0.0"` |
| OWA-07 | FAIL | `src/shared/ui/ErrorFallback/index.tsx:265-269` — stack trace в UI | ✅ Подтверждено | Строки 263-269: `normalizedError.name`, `normalizedError.message`, `normalizedError.stack` без PROD-проверки |

### audit-validation.md — 1 находка проверена

| Check | Тип | Доказательство | Статус | Комментарий |
|-------|-----|---------------|--------|-------------|
| VAL-01 | FAIL | `src/routes/callback.tsx:15` — нет `validateSearch` | ✅ Подтверждено | Строка 15: `createFileRoute("/callback")` без `validateSearch`/`parseSearchWith` |

### audit-errors.md — 5 находок проверены

| Check | Тип | Доказательство | Статус | Комментарий |
|-------|-----|---------------|--------|-------------|
| ERR-02 | ⚠️ WARN | `ErrorFallback/index.tsx:263-269` — stack trace | ✅ Подтверждено | Строки 265-268: паказывает `normalizedError.name`, `message`, `stack` |
| ERR-04 | ⚠️ WARN | `GlobalErrorBoundary.tsx:8-14` — нет `error` listener | ✅ Подтверждено | Есть только `unhandledrejection`, `window.addEventListener('error')` отсутствует |
| ERR-05 | ❌ FAIL | `graphql-client.ts:4-29` — нет timeout; `oidc-client.ts:4-12` — нет timeout | ✅ Подтверждено | `graphql-client.ts` — `fetchOptions` без `timeout`/`signal`; `oidc-client.ts` — без конфигурации таймаута |
| ERR-08 | ❌ FAIL | `ErrorFallback/index.tsx:153-161` — retry без backoff | ✅ Подтверждено | Строки 153-161: `handleRetry` без exponential backoff |
| ERR-09 | ❌ FAIL | Нет AbortSignal в URQL или OIDC | ✅ Подтверждено | `graphql-client.ts` не принимает `signal` в параметрах |

### audit-logging.md — 3 находки проверены

| Check | Тип | Доказательство | Статус | Комментарий |
|-------|-----|---------------|--------|-------------|
| LOG-01 | ❌ FAIL | `GlobalErrorBoundary.tsx:9` — `console.error`; `sentry/config.ts:5` — `console.warn`; `ErrorFallback/index.tsx:181` — `console.error` | ✅ Подтверждено | Все 3 файла существуют, строки содержат указанные console.* вызовы |
| LOG-06 | ⚠️ WARN | Нет логирования auth-событий | ✅ Подтверждено | В коде нет captureMessage для login/logout |
| LOG-07 | ⚠️ WARN | `GlobalErrorBoundary.tsx:9` — `event.reason` без санитизации | ✅ Подтверждено | Строка 9: `console.error("Uncaught Promise Rejection:", event.reason)` |

### audit-architecture.md — 1 находка проверена

| Check | Тип | Доказательство | Статус | Комментарий |
|-------|-----|---------------|--------|-------------|
| ARC-05 | **FAIL** | `oidc-client.ts:5-9`, `graphql-client.ts:6`, `sentry/config.ts:4,10,12,22`, `main.tsx:68` — прямой `import.meta.env.*` | ✅ Подтверждено | Все 4 файла используют `import.meta.env.*` напрямую вместо `@shared/config/env` |

### audit-yagni.md — 2 находки проверены

| Check | Тип | Доказательство | Статус | Комментарий |
|-------|-----|---------------|--------|-------------|
| YAGNI-02 | ❌ FAIL | `AuthGuard.tsx:11` — не импортирован; `env.ts:18` — не потреблён; `env.ts:7` — PORT только внутри; `features/auth/model/types.ts` — не потреблён | ✅ Подтверждено | Все файлы существуют, экспорты не имеют внешних потребителей |
| YAGNI-03 | ⚠️ WARN | Избыточные абстракции counter/types и auth/types | ✅ Подтверждено | Типы разделены на 3-4 отдельных, но реально используется 1 (`CounterStore`, `AuthStore`) |

### audit-bugs.md — 1 находка проверена

| Check | Тип | Доказательство | Статус | Комментарий |
|-------|-----|---------------|--------|-------------|
| BUG-03 | ❌ FAIL | `ErrorFallback/index.tsx:126` — `JSON.stringify(error)` без try-catch | ✅ Подтверждено | Строка 126: `const message = typeof error === "string" ? error : JSON.stringify(error);` — циклические ссылки вызовут TypeError |

### audit-deployment.md — 3 находки проверены

| Check | Тип | Доказательство | Статус | Комментарий |
|-------|-----|---------------|--------|-------------|
| DEP-04 | FAIL | `.dockerignore` — `.git` не исключён, `#.env` закомментирован | ✅ Подтверждено | `.dockerignore` не содержит `.git`; строка 6: `#.env` — закомментирована |
| DEP-08 | FAIL | `.env.example` — нет `VITE_MOCK_AUTH` и `VITE_APP_VERSION` | ✅ Подтверждено | `.env.example` (16 строк) не содержит эти переменные; `main.tsx:68` и `sentry/config.ts:12` их используют |
| DEP-09 | FAIL | `Dockerfile` — нет `NODE_ENV=production` | ✅ Подтверждено | `Dockerfile` (38 строк) не содержит `ENV NODE_ENV=production` или `ARG NODE_ENV=production` |

### audit-meta.md — 3 находки проверены

| Check | Тип | Доказательство | Статус | Комментарий |
|-------|-----|---------------|--------|-------------|
| "5/14 отсутствуют" | ❌ FAIL | Утверждает, что 5 аудитов (api-contracts, deployment, logging, performance, tests) не выполнены | ❌ **False Positive** | Все 15 .md файлов присутствуют в директории. Отчёт meta был написан до выполнения этих 5 аудитов и не обновлён. На момент верификации — все 15 отчётов на месте. |
| Baseline пуст | ⚠️ WARN | `docs/audit-baseline.yml` — секции `accepted`, `false_positives`, `intentional` пусты | ✅ Подтверждено | Файл существует (170 строк), но содержит только шаблон check_id и пустые секции |
| Формат неконсистентен | ⚠️ WARN | Статусы в разных отчётах: `✅ PASS` vs `PASS`, `❌ FAIL` vs `FAIL` | ✅ Подтверждено | audit-secrets/errors/logging используют emoji, audit-architecture/owasp/validation — без emoji |

## Проверка baseline

Файл `docs/audit-baseline.yml` содержит пустые секции `accepted`, `false_positives`, `intentional`. Записей с истёкшими сроками действия нет. ACCEPTED риски не зарегистрированы.

## Исправленные документы

- **audit-meta.md**: Секция "Все 14 аудитов выполнены" — ❌ FAIL устарел. На момент верификации выполнены все 15 аудитов. Рекомендуется обновить meta-отчёт.

## Пропущенные критические риски

[Не обнаружено]

Все FAIL и WARNING находки подтверждены: код по указанным `file:line` существует и соответствует описанию. Единственный false positive — meta-отчёт, который был написан до завершения остальных 5 аудитов.

## Рекомендации

1. Обновить `audit-meta.md`: исправить секцию о невыполненных аудитах (0 отсутствуют вместо 5)
2. Заполнить `docs/audit-baseline.yml`: внести accepted-риски, false-positives и intentional-design решения
3. Устранить FAIL-находки согласно рекомендациям в каждом отчёте
