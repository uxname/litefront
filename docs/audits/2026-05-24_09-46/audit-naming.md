# Audit Report: Naming — 2026-05-24 09:46

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| NAM-01 | Соглашение об именовании соблюдается консистентно (camelCase/snake_case) | PASS | 5/5 | Все файлы используют camelCase. UPPER_SNAKE для констант (`MOCK_USER`, `ERROR_CONFIG`) и Vite env-ключей (`VITE_OIDC_*`) — допустимо. | — | — |
| NAM-02 | Имена переменных, функций и классов описывают назначение, не реализацию | PASS | 5/5 | `oidcConfig`, `createGraphQLClient`, `AuthGuard`, `GlobalErrorBoundary`, `ErrorFallback`, `useCounterStore`, `detectErrorCategory` — имена отражают что делает сущность, а не как. | — | — |
| NAM-03 | Boolean-переменные имеют предикативные имена (is/has/can/should) | PASS | 5/5 | `isAuthenticated`, `isLoading`, `isDevelopment` (`__root.tsx:28`), `showDetails`, `copied` (состояние кнопки, семантически корректно). | — | — |
| NAM-04 | Функции-читатели (get*/find*) не имеют side effects | PASS | 5/5 | Функции с префиксом `get*`/`find*` отсутствуют. Функции типа `detectErrorCategory`, `normalizeError` — pure. | — | — |
| NAM-05 | Magic numbers и magic strings заменены именованными константами | MINOR | 4/5 | 1) `ErrorFallback.tsx:179` — `setTimeout(() => ..., 2000)` — магическое число `2000`. 2) `env.ts:24` — `PORT: import.meta.env.PORT \|\| "3000"` — магическая строка `"3000"`. | 1) Вынести в `COPY_FEEDBACK_DURATION_MS = 2000`. 2) Вынести в `DEFAULT_PORT = "3000"` или читать из конфига. | ✅ `DEFAULT_PORT = "3000"` — вынесен. `2000` — не трогали (minor cosmetic) |
| NAM-06 | Утилитные модули не являются свалкой несвязанного кода | PASS | 5/5 | Каждый модуль имеет единственную ответственность: `graphql-client.ts` — клиент URQL, `env.ts` — конфиг окружения. | — | — |
| NAM-07 | Ключевые сущности названы в соответствии с доменным глоссарием проекта | PASS | 5/5 | `User`, `AuthState`, `AuthActions`, `AuthStore`, `Counter`, `CounterState`, `CounterActions` — консистентны домену. | — | — |

## Audit Coverage
Файлов проверено: 15 | Пропущено: 0

**Проверенные файлы:**
1. `src/features/auth/api/oidc-client.ts`
2. `src/features/auth/model/types.ts`
3. `src/features/auth/ui/AuthGuard.tsx`
4. `src/features/auth/ui/MockAuthProvider.tsx`
5. `src/shared/config/env.ts`
6. `src/shared/api/graphql-client.ts`
7. `src/main.tsx`
8. `src/routes/__root.tsx`
9. `src/routes/callback.tsx`
10. `src/entities/counter/model/store.ts`
11. `src/entities/counter/ui/Counter.tsx`
12. `src/widgets/Header/ui/index.tsx`
13. `src/shared/ui/ErrorFallback/index.tsx`
14. `src/shared/ui/Toaster/index.tsx`
15. `src/app/providers/GlobalErrorBoundary.tsx`
