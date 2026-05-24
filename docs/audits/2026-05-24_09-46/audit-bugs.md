# Audit Report: Bugs & Logic Errors — 2026-05-24 09:46

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| BUG-01 | Преобразования типов безопасны (NaN, radix, coercion) | ✅ PASS | High | Все файлы проверены. `Number(match[1])` в ErrorFallback:94 защищён guard-условием `match ? Number(match[1]) : null`; `PORT \|\| "3000"` в env.ts — string coercion корректна; `Math.floor(Date.now() / 1000)` — тип number гарантирован | — | — |
| BUG-02 | async/await используется корректно | ✅ PASS | High | Нет `await` в `forEach`; нет `if(asyncFn())`; `void auth.signoutRedirect()` и `void auth.signinRedirect()` — корректный fire-and-forget для redirect-action; динамический import `react-scan` через `.then()` — правильно | — | — |
| BUG-03 | Null-safety — обращения к свойствам защищены от undefined/null | ❌ FAIL | High | **ErrorFallback:126** — `JSON.stringify(error)` выбрасывает TypeError при циклических ссылках (circular references). Это крашит fallback-компонент, который должен быть отказоустойчивым | **try-catch**; `String(error)`; проверка `typeof error === "object"` с try-catch | ✅ `normalizeError` обёрнут в try-catch |
| BUG-04 | Функции не мутируют входные аргументы | ✅ PASS | High | Нет мутаций: Zustand использует `set()` с фабрикой нового объекта; нет sort/splice/reverse/push на массивах; все обновления иммутабельны | — | — |
| BUG-05 | Exhaustive handling — все enum/union-ветки обработаны | ✅ PASS | High | `ErrorCategory` (5 значений) — `ERROR_CONFIG` покрывает все, `detectErrorCategory` всегда возвращает валидный `ErrorCategory` (+ `UNKNOWN` fallback); `Header` — `isLoading`/`isAuthenticated`/else покрывают все 3 состояния | — | — |
| BUG-06 | Математические guard-условия (деление на ноль, граничные значения) | ✅ PASS | High | Деление только на литерал 1000 в `MockAuthProvider:17` (`Date.now() / 1000`); counter лишь инкрементирует на 1 | — | — |
| BUG-07 | Off-by-one: границы диапазонов корректны | ✅ PASS | High | Нет работы с индексами массивов, slice, loop boundaries. Counter: `state.counter + 1` и отображение `${counter + 1}` консистентны | — | — |
| BUG-09 | Дата/время хранятся и обрабатываются в UTC | ✅ PASS | High | `Date.now()` — UTC timestamp; `new Date().toISOString()` в ErrorFallback:172 — всегда UTC | — | — |

## FAIL Details

### BUG-03-1: `JSON.stringify` на циклическом объекте крашит ErrorFallback

**Файл:** `src/shared/ui/ErrorFallback/index.tsx:126`

**Код:**
```ts
const normalizeError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  const message = typeof error === "string" ? error : JSON.stringify(error);
  return new Error(message || "Unknown error occurred");
};
```

**Проблема:** Если `error` не `Error` и не строка, а объект с циклическими ссылками (например, React-ошибка или объект из `react-error-boundary`), `JSON.stringify` выбрасывает `TypeError: Converting circular structure to JSON`. Поскольку `normalizeError` вызывается внутри `useMemo` на верхнем уровне рендера, компонент падает при попытке отобразить ошибку — fallback сам становится ошибкой.

**Варианты решения:**

1. **`normalizeError` с try-catch:**
   ```ts
   const normalizeError = (error: unknown): Error => {
     if (error instanceof Error) return error;
     try {
       const message = typeof error === "string" ? error : JSON.stringify(error);
       return new Error(message || "Unknown error occurred");
     } catch {
       return new Error("Non-serializable error (circular or BigInt)");
     }
   };
   ```

2. Использовать `String(error)` вместо `JSON.stringify(error)` — `String()` на объекте возвращает `"[object Object]"`, но никогда не падает.

3. Проверять на циклические ссылки через `JSON.stringify` с try-catch или утилиту типа `safeStringify`.

## Audit Coverage

Проверено: `src/features/auth/**`, `src/shared/**`, `src/entities/counter/**`, `src/widgets/Header/**`, `src/app/providers/**`, `src/routes/**`, `src/main.tsx`

Файлов проверено: 17 | Пропущено: 0 (generated, node_modules, dist)
