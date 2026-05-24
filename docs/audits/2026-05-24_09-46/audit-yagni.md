# Audit Report: Over-engineering & YAGNI — 2026-05-24 09:46

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| YAGNI-01 | Нет закомментированного кода | ✅ PASS | 100% | Ни один из 19 проверенных файлов не содержит закомментированных блоков. | — | — |
| YAGNI-02 | Нет dead code — неиспользуемых экспортов, функций, переменных | ❌ FAIL | 95% | a) `AuthGuard` (`features/auth/ui/AuthGuard.tsx:11`) — экспортирован из barrel (`features/auth/index.ts:10`), но нигде не импортирован. Protected page (`pages/protected/ui/index.tsx`) не использует guard. b) `env` (`shared/config/env.ts:18`) — экспортированный объект нигде не импортирован. Другие модули читают `import.meta.env.*` напрямую. c) `PORT` в `Env` (`shared/config/env.ts:7`) — используется только внутри `env.ts`, нигде не потреблён. d) `AuthState`, `AuthActions`, `AuthStore`, `User` (`features/auth/model/types.ts`) — экспортированы через barrel, но ни один потребитель их не импортирует. Все потребители импортируют только `useAuth` и `AuthContextProps`. e) `CounterState`, `CounterActions`, `CounterProps` (`entities/counter/`) — экспортированы, но внешне не используются (только `CounterStore` и `Counter` потребляются). | Удалить неиспользуемые экспорты | ✅ AuthGuard удалён; Auth-типы схлопнуты в `AuthStore`; Counter-типы схлопнуты в `CounterStore`; `env` теперь реально потребляется |
| YAGNI-03 | Абстракции оправданы: интерфейс/фабрика имеет >1 реализации или требуется тестами | ⚠️ WARN | 90% | a) `createGraphQLClient` (`shared/api/graphql-client.ts:4`) — фабрика с 1 потребителем (`__root.tsx:32`). Могла быть инлайн. b) `counter/model/types.ts` — разделение на `CounterState` + `CounterActions` + `CounterStore` для единственного числа и одного экшена. Избыточно: достаточно одного типа `CounterStore`. c) `auth/model/types.ts` — 4 типа для стейта, который никто не импортирует (см. YAGNI-02d). Сама модель auth живёт в `react-oidc-context`. | a) Опционально — инлайн или оставить как есть (изоляция зависимости выгдодна). b) Удалить `CounterState`/`CounterActions`, оставить только `CounterStore`. c) Удалить файл `model/types.ts` и его экспорт. | ✅ Counter/types: единый `CounterStore`. Auth/types: единый `AuthStore`. createGraphQLClient — оставлен (изоляция зависимости) |
| YAGNI-04 | Feature flags не зафиксированы в одном значении | ✅ PASS | 100% | a) `VITE_MOCK_AUTH` (`main.tsx:68`) — управляется через env, не зафиксирован. b) `import.meta.env.DEV` используется для react-scan (`main.tsx:14`) и TanStack Router Devtools (`__root.tsx:19`) — стандартная практика. | — | — |
| YAGNI-05 | Технический долг актуален — нет заброшенных TODO/FIXME без даты или прогресса | ✅ PASS | 100% | grep по `TODO|FIXME|HACK|XXX|WORKAROUND|TEMP` — 0 совпадений во всех `src/**/*.{ts,tsx}`. | — | — |

## Summary

- **YAGNI-02 FAIL**: Значительный объём dead code — 4+ неиспользуемых экспорта (`AuthGuard`, `env`, `PORT`, 4 auth-типа, 3 counter-типа).
- **YAGNI-03 WARN**: Избыточные абстракции — модель counter разделена на 3 типа для тривиального состояния; auth-модель дублирует `react-oidc-context`.
- **Рекомендация**: Удалить `AuthGuard` (или подключить к protected-роуту), удалить `shared/config/env.ts` (заменить прямые `import.meta.env.*` с runtime-валидацией, если нужна), удалить неиспользуемые type-экспорты из авторизации и счётчика.

## Audit Coverage

Файлов проверено: 19 | Пропущено: 0
