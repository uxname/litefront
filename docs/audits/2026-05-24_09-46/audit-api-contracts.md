# Audit Report: API Contracts — 2026-05-24 09:46

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| API-01 | Форма ответов консистентна — единый envelope или его отсутствие по всему API | ✅ PASS | Высокая | GraphQL via URQL использует стандартный `{ data, errors }` envelope (см. `src/shared/api/graphql-client.ts:6-29`). Все ответы проходят через единый URQL Client — единого источника truth для транспорта. OIDC (`src/features/auth/api/oidc-client.ts`) — конфигурация OIDC провайдера, а не API вызов; envelope не применим. Дополнительно: кодогенерация GraphQL (`src/generated/graphql.tsx`) гарантирует строгую типизацию ответов через `__typename`. | Не требуется | — |
| API-04 | Именование полей консистентно (camelCase или snake_case, не смешано) | ✅ PASS | Высокая | GraphQL схема (серверная часть, не в репозитории, отражена в `src/generated/graphql.tsx`) использует исключительно `camelCase` для всех полей: `awsRegion`, `emojiU`, `continentFilterInput`, `StringQueryOperatorInput`. Все query-операции в `.graphql` файлах (`src/graphql/queries/get-country.graphql`) и сгенерированные React hooks (`useGetCountryQuery`) следуют `PascalCase` для типов и `camelCase` для переменных — консистентно. OIDC конфигурация (`client_id`, `post_logout_redirect_uri`, `redirect_uri`) — snake_case, но это стандартные имена параметров OIDC протокола, продиктованные библиотекой `oidc-client-ts`, а не кастомный API-контракт приложения; смешения в рамках одного домена нет. | Не требуется | — |

## Audit Coverage
Файлов проверено: 4 | Пропущено: 0

**Проверенные файлы:**
- `src/shared/api/graphql-client.ts` — URQL клиент, транспорт
- `src/generated/graphql.tsx` — сгенерированные GraphQL типы (164 строки, 1 query)
- `src/features/auth/api/oidc-client.ts` — OIDC конфигурация
- `src/graphql/queries/get-country.graphql` — исходная GraphQL операция

**Пропущенные проверки (серверные, не применимы к клиенту):**
API-02 (HTTP коды), API-03 (HTTP методы/статусы псевдонимов), API-05 (версионирование), API-06 (документация vs реализация), API-07 (REST конвенции GraphQL).

**Замечания:**
- Единственный потенциальный нюанс — snake_case в OIDC параметрах на фоне camelCase GraphQL схемы. Не является нарушением, т.к. это разные протоколы (OIDC vs GraphQL) с разными конвенциями, и snake_case продиктован внешней библиотекой.
- Клиент использует один GraphQL endpoint (`VITE_GRAPHQL_API_URL`), что исключает расхождение envelope между разными ручками.
- Всего 1 GraphQL операция (`GetCountry`) — при масштабировании рекомендуется следить за консистентностью именования новых операций.
