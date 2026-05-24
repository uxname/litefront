# Audit Report: Test & Linter Integrity — 2026-05-24 09:46

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| TST-01 | TypeScript strict mode включён | ✅ PASS | Высокая | `tsconfig.json:25` — `"strict": true`; также `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` | — | — |
| TST-02 | Coverage thresholds настроены и применяются в CI | ⚠️ PARTIAL | Средняя | `vite.config.ts:157-162` — thresholds lines=80, functions=80, branches=70, statements=80. `package.json` скрипт `test:cov` есть. **CI/CD пайплайнов нет** (`.github/workflows/` отсутствует) — thresholds сработают только локально при `npm run test:cov` | Добавить GitHub Actions (или аналог) для запуска `npm run test:cov` при push/PR | Нет |
| TST-03 | Pre-commit/pre-push хуки запускают проверки (tests, lint, typecheck) | ✅ PASS | Высокая | `lefthook.yml:1-13` — pre-commit запускает `npm run check` (stylelint + tsc + biome fix + knip + steiger); pre-push запускает `npm run check` + `npm run test:all` (unit + e2e). `postinstall` в `package.json:40` выполняет `lefthook install` | — | — |
| TST-04 | Критические пути покрыты тестами (auth, validation, error handling) | ✅ PASS | Высокая | **Auth guard:** `tests/unit/routes/protected-route.test.ts` (3 кейса: unauth throws, redirect to "/", auth passes) + E2E `tests/e2e/pages/protected.spec.ts` (3 кейса). **Error handling:** `tests/component/shared/ui/ErrorFallback.test.tsx` (7 кейсов: 401/403/network/500/unknown + retry/reload). **GraphQL client:** `tests/unit/shared/api/graphql-client.test.ts` (4 кейса: anonymous, bearer, error capture, network error). **404:** E2E `tests/e2e/pages/404.spec.ts`. **Home:** E2E `tests/e2e/pages/home.spec.ts` (title, hero, counter, nav) | — | — |
| TST-05 | Тесты изолированы — нет shared mutable state между тестами | ✅ PASS | Высокая | `store.test.ts:6` + `Counter.test.tsx:14` — `beforeEach` сбрасывает `useCounterStore.setState({ counter: 0 })`. `graphql-client.test.ts:40-44` — `beforeEach` чистит моки и refs. E2E — Playwright даёт изолированный page на каждый тест. Глобальные моки в `setup.ts` корректно переопределяются per-test через `vi.mocked()` | — | — |
| TST-06 | Нет пропущенных или зафиксированных тестов (.only/.skip без обоснования) | ✅ PASS | Высокая | `grep` по `.only`, `.skip`, `test.only`, `describe.only`, `test.todo`, `xit`, `xdescribe` — ничего не найдено. Все тесты активны | — | — |
| TST-07 | Тесты проверяют поведение, а не детали реализации | ✅ PASS | Высокая | Component-тесты используют `screen.getByRole`, `getByText` (поведенческие queries). Unit-тесты проверяют контракты (headers, exceptions, callbacks). Нет тестов, смотрящих во внутренние state/fn компонентов | — | — |
| TST-09 | Snapshot-тесты охватывают значимые изменения, не весь DOM | ⚠️ N/A | Высокая | Snapshot-тесты отсутствуют — ни одного `toMatchSnapshot`/`toMatchInlineSnapshot`, нет `__snapshots__/` директорий | Не требуется | — |

## Audit Coverage
Файлов проверено: 16 | Пропущено: 2
- `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `playwright.config.ts`, `package.json`, `lefthook.yml` — 6 config files
- `tests/setup.ts` — 1 setup file
- `tests/sum.test.ts` — 1 placeholder test
- `tests/unit/shared/api/graphql-client.test.ts` — 1 unit test (103 строк, 4 it)
- `tests/unit/routes/protected-route.test.ts` — 1 unit test (47 строк, 3 it)
- `tests/unit/entities/counter/store.test.ts` — 1 unit test (27 строк, 3 it)
- `tests/component/shared/ui/ErrorFallback.test.tsx` — 1 component test (86 строк, 7 it)
- `tests/component/entities/counter/Counter.test.tsx` — 1 component test (33 строк, 3 it)
- `tests/e2e/pages/protected.spec.ts` — 1 e2e (40 строк, 3 test)
- `tests/e2e/pages/404.spec.ts` — 1 e2e (16 строк, 2 test)
- `tests/e2e/pages/home.spec.ts` — 1 e2e (29 строк, 4 test)
- `.github/workflows/` — отсутствуют (CI не настроен)
- `.husky/` — отсутствует (lefthook вместо husky)

**Пропущено:** TST-08 (dynamic — не входит в чеклист)

## Итого
- ✅ PASS: 5 (TST-01, TST-03, TST-04, TST-05, TST-06, TST-07)
- ⚠️ PARTIAL: 1 (TST-02 — thresholds есть, CI нет)
- ⚠️ N/A: 1 (TST-09 — snapshot'ы не используются)
