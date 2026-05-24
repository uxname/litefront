# Audit Report: Boundary Data Validation — 2026-05-24 09:46

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| VAL-01 | Все входящие данные (body, params, query) проходят schema-валидацию | FAIL | high | `src/routes/callback.tsx:15` — route `/callback` не использует `validateSearch`/`parseSearchWith` для проверки query-параметров от OIDC-провайдера (code, state). GraphQL-ответы (`src/pages/home/ui/index.tsx:62`) типизированы статически через codegen, но не проходят runtime-валидацию (zod/yup отсутствуют в зависимостях). | Добавить `validateSearch` со схемой для `/callback`. Для GraphQL-ответов не критично (данные с доверенного сервера). | ✅ Добавлен `validateSearch` с типами `CallbackSearch` (code, state, iss) в callback.tsx |
| VAL-02 | Строки имеют maxLength, числа — диапазон, enum-значения — whitelist | PASS | high | В проекте нет форм ввода. Единственный пользовательский компонент с пропсами — `Counter` (`src/entities/counter/ui/Counter.tsx:10`, `title?: string`) без maxLength, но это demo-компонент без внешнего ввода. | Нет действий. | — |
| VAL-03 | JSON.parse обёрнут в try/catch с последующей валидацией структуры | PASS | high | `JSON.parse` не используется нигде в исходном коде (`src/`). | Нет действий. | — |
| VAL-04 | Identity данные берутся из аутентифицированного контекста (не из user input) | PASS | high | Identity читается только из `auth.user.profile` (`src/pages/protected/ui/index.tsx:20`, `src/main.tsx:48`). Нигде не из user input. | Нет действий. | — |
| VAL-06 | Валидатор не выполняет неявный coercion [⚡ dynamic] | PASS | high | Валидаторов в проекте нет. Единственное место с coercion: `auth.user?.expires_in \|\| 0` (`src/pages/protected/ui/index.tsx:35`) и `Math.min(...)` — только для read-only отображения, не для отправки. | Нет действий. | — |
| VAL-07 | Prototype pollution: merge/assign с user input фильтрует __proto__, constructor, prototype | PASS | high | Нет merge/assign/spread операций с user input. `Object.prototype.hasOwnProperty.call` в `src/app/vite-dotenv-checker.plugin.ts:34,44` используется с .env-файлами (build-time), не с user input. | Нет действий. | — |

## Audit Coverage

| Компонент | Файлы | Статус |
|-----------|-------|--------|
| OIDC callback | `src/routes/callback.tsx` | Проверено |
| Auth guard | `src/features/auth/ui/AuthGuard.tsx` | Проверено |
| OIDC config | `src/features/auth/api/oidc-client.ts` | Проверено |
| Mock auth | `src/features/auth/ui/MockAuthProvider.tsx` | Проверено |
| Env config | `src/shared/config/env.ts` | Проверено |
| GraphQL client | `src/shared/api/graphql-client.ts` | Проверено |
| Root route | `src/routes/__root.tsx` | Проверено |
| Home page | `src/pages/home/ui/index.tsx` | Проверено |
| Protected page | `src/pages/protected/ui/index.tsx` | Проверено |
| Counter store/UI | `src/entities/counter/model/store.ts`, `src/entities/counter/ui/Counter.tsx` | Проверено |
| Main entry | `src/main.tsx` | Проверено |
| Dotenv plugin | `src/app/vite-dotenv-checker.plugin.ts` | Проверено |

Файлов проверено: **12** | Пропущено: **0**

## Примечания

- **VAL-01 (FAIL)** — Основная находка: маршрут `/callback` принимает query-параметры от OIDC-провайдера без явной схемы. OIDC-библиотека (`oidc-client-ts`) внутренне парсит callback и проверяет state, что снижает практический риск, но на уровне кода контракт не декларирован. Рекомендуется добавить `validateSearch` с zod-схемой для документации и защиты от регрессий.
- GraphQL-запросы (`useGetCountryQuery`) имеют переменную `{ code: "BR" }` — хардкод, не user input. Другие GraphQL-запросы будут типизированы codegen'ом, но runtime-валидация не предусмотрена (принято, т.к. сервер доверенный).
- Неприменимые проверки пропущены: VAL-05 (вложенные структуры — серверная ответственность), VAL-08 (загрузка файлов — нет функционала).
