# Audit Report: OWASP Application Security — 2026-05-24 09:46

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| OWA-02 | A01: Все защищённые маршруты имеют auth-middleware (guard) | PASS | HIGH | `src/routes/protected/index.tsx:5-11` — `beforeLoad` проверяет `context.auth.isAuthenticated` и редиректит. Всего 1 защищённый маршрут (`/protected/`). Компонент `AuthGuard` (`src/features/auth/ui/AuthGuard.tsx`) — dead code (не импортируется нигде, подтверждено `grep`). | N/A | N/A |
| OWA-05 | A05: Безопасная конфигурация (CORS, security headers) | FAIL | MEDIUM | `vite.config.ts:26` — `host: "0.0.0.0"` открывает dev-сервер на всех интерфейсах. Для production-frontend security headers (CSP, HSTS, X-Frame-Options) не настроены — хотя это обычно ответственность reverse proxy, а не SPA. | **Вариант 1:** Заменить `host: "0.0.0.0"` на `host: "localhost"` в dev-режиме. **Вариант 2:** Добавить CSP через Vite `server.headers` для dev-сервера. **Вариант 3:** Вынести security headers в reverse proxy конфиг (nginx ingress) с явным чек-листом заголовков. | НЕТ |
| OWA-06 | A07: Защита от перебора (rate limiting) | N/A | N/A | Клиентское SPA не может имплементировать server-side rate limiting. Rate limiting должен быть на API-шлюзе. В коде нет попыток клиентского rate limiting для auth endpoints. | N/A | N/A |
| OWA-07 | A09: Техническая информация не утекает в ответы (stack trace) | FAIL | HIGH | `src/shared/ui/ErrorFallback/index.tsx:265-269` — stack trace (`normalizedError.stack`), имя ошибки, полный URL (`window.location.href`) и pathname показываются пользователю через toggle "show details". Отсутствует проверка `import.meta.env.PROD` — в production детали реализации утекают энд-юзеру. | **Вариант 1:** Обернуть блок `showDetails` в `if (import.meta.env.DEV)` в ErrorFallback, в production показывать только user-friendly сообщение. **Вариант 2:** В production показывать `errorId` (Sentry event ID) вместо stack trace, оставляя details только для Sentry. **Вариант 3:** В production логировать stack trace в Sentry при рендере ErrorFallback, пользователю показывать generic сообщение. | НЕТ |
| OWA-09 | A05: CSRF-защита реализована (SameSite cookies / CSRF-токены) | PASS | MEDIUM | SPA использует Bearer token auth (`src/shared/api/graphql-client.ts:26`) в `Authorization` header — браузеры не прикрепляют этот заголовок автоматически на cross-origin запросы. OIDC flow использует PKCE с state/nonce валидацией. Cookie-based сессий нет. | N/A | N/A |

## Дополнительные находки (out of scope основного чеклиста, но релевантны)

| # | Проблема | Файл | Серьёзность | Описание |
|---|----------|------|-------------|----------|
| F1 | `id_token` используется как Bearer token для API | `src/routes/__root.tsx:32` — `createGraphQLClient(auth.user?.id_token)` | MEDIUM | В OIDC `id_token` предназначен для идентификации клиентом, `access_token` — для API-доступа. Использование `id_token` как bearer token может работать, но нарушает OIDC spec. При смене провайдера может сломаться. |
| F2 | OIDC state хранится в localStorage вместо sessionStorage | `src/features/auth/api/oidc-client.ts:11` — `store: window.localStorage` | LOW | Токены персистят между сессиями браузера. При XSS-атаке злоумышленник получает доступ к токенам. sessionStorage (вкладка) безопаснее. |
| F3 | AuthGuard — dead code (экспортируется, но не используется) | `src/features/auth/ui/AuthGuard.tsx` + `src/features/auth/index.ts:10` | LOW | Компонент экспортируется в public API, но не импортируется ни одним роутом. Защита роутов реализована через `beforeLoad`. Может запутать разработчиков. |
| F4 | Отсутствует Content Security Policy (CSP) | — (не настроен ни в Vite, ни в конфиге reverse proxy) | MEDIUM | SPA без CSP уязвимо для XSS. Даже при server-side настройке, CSP header в Vite dev-режиме (`server.headers`) улучшил бы защиту при разработке. |

## Audit Coverage

```
src/features/auth/api/oidc-client.ts
src/features/auth/model/types.ts
src/features/auth/ui/AuthGuard.tsx
src/features/auth/ui/MockAuthProvider.tsx
src/features/auth/index.ts
src/shared/config/env.ts
src/shared/api/graphql-client.ts
src/routes/__root.tsx
src/routes/index.lazy.tsx
src/routes/index.tsx
src/routes/protected/index.tsx
src/routes/callback.tsx
src/main.tsx
src/shared/ui/ErrorFallback/index.tsx
src/app/providers/GlobalErrorBoundary.tsx
vite.config.ts
.env.example
src/pages/protected/ui/index.tsx
```

Файлов проверено: 18 | Пропущено: 0 (все файлы из чеклиста прочитаны и проанализированы)
