# Audit Report: Logging Best Practices — 2026-05-24 09:46

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| LOG-01 | Production-код не использует console.log/console.error напрямую | ❌ FAIL | Высокая | 3 production console.* вызова в 3 файлах: `src/app/providers/GlobalErrorBoundary.tsx:9` (console.error), `src/shared/lib/sentry/config.ts:5` (console.warn), `src/shared/ui/ErrorFallback/index.tsx:181` (console.error). Ещё 1 DEV- guarded (`src/shared/config/env.ts:30`) и 1 build-time (`src/app/vite-dotenv-checker.plugin.ts:52`) — допускаются. | 1) Обернуть console.warn в sentry/config.ts в `if (import.meta.env.DEV)`; 2) Заменить console.error в GlobalErrorBoundary.tsx на captureMessage или удалить (Sentry уже ловит); 3) console.error в ErrorFallback — допустим как fallback на clipboard fail, но можно заменить на captureException | Нет |
| LOG-03 | Секреты и токены не попадают в логи | ✅ PASS | Высокая | Ни один console.* вызов не логирует credentials, tokens, keys или PII. OIDC-клиент не содержит console.*. Sentry перед отправкой обрабатывает событие в beforeSend. | — | — |
| LOG-06 | Критические операции логируются (auth, create, update, delete) | ⚠️ WARN | Средняя | Нет явного логирования событий аутентификации (login/logout/token refresh). Ошибки auth попадают в Sentry через GlobalErrorBoundary, но успешные операции не логируются. Отсутствие observability для auth lifecycle. | Добавить Sentry captureMessage для ключевых точек auth: успешный логин, logout, ошибка токена | Нет |
| LOG-07 | User input санитизируется перед логированием (защита от log injection) | ⚠️ WARN | Средняя | `GlobalErrorBoundary.tsx:9` логирует `event.reason` без санитизации — потенциальный log injection (если Promise rejection содержит пользовательские данные с управляющими символами). Остальные console.* оперируют статическими строками или Error-объектами. | Применить санитизацию строк перед console.error в GlobalErrorBoundary или передавать только message без stack | Нет |

## Audit Coverage
Файлов проверено: 8 | Пропущено: 0

### Детали найденных console.*

| Файл | Строка | Вызов | DEV-guard | Оценка |
|------|--------|-------|-----------|--------|
| `src/app/vite-dotenv-checker.plugin.ts` | 52 | `console.log("✅ .env...")` | Build-time (Node.js) | Допустимо |
| `src/shared/lib/sentry/config.ts` | 5 | `console.warn("Sentry DSN...")` | Нет | ❌ Нарушение LOG-01 |
| `src/shared/ui/ErrorFallback/index.tsx` | 181 | `console.error("Failed to copy", err)` | Нет | ❌ Нарушение LOG-01 |
| `src/app/providers/GlobalErrorBoundary.tsx` | 9 | `console.error("Uncaught Promise...", event.reason)` | Нет | ❌ Нарушение LOG-01 + риск LOG-07 |
| `src/shared/config/env.ts` | 30 | `console.error("Missing required...")` | `import.meta.env.DEV` | ✅ Допустимо |
