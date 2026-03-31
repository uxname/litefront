---
name: write-tests
description: Use this skill when the user asks to write tests, add test coverage, create unit tests, component tests, or E2E tests. Trigger phrases: "write tests", "unit test", "component test", "e2e test", "playwright test", "vitest".
version: 1.0.0
---

# Write Tests

Writes tests following the project's three-tier testing strategy.

## Test Types

| Type | Tool | Location | What to test |
|---|---|---|---|
| Unit | Vitest | `tests/unit/` | Stores, utilities, pure logic |
| Component | Vitest + Testing Library | `tests/component/` | React components in isolation |
| E2E | Playwright | `tests/e2e/` | Full user flows in a browser |

## Running Tests

```bash
npm run test:prod          # Unit + component (one run)
npm run test:dev           # Unit + component (watch mode)
npm run test:coverage      # Coverage report (thresholds: 80% lines/functions)
npm run test:e2e:prod      # E2E headless chromium
npm run test:e2e:dev       # E2E with UI
```

## Unit Test (Zustand Store)

```ts
// tests/unit/entities/counter/store.test.ts
import { beforeEach, describe, expect, it } from "vitest";
import { useCounterStore } from "@entities/counter";

describe("counterStore", () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 });
  });

  it("increments count", () => {
    useCounterStore.getState().increment();
    expect(useCounterStore.getState().count).toBe(1);
  });

  it("decrements count", () => {
    useCounterStore.setState({ count: 5 });
    useCounterStore.getState().decrement();
    expect(useCounterStore.getState().count).toBe(4);
  });

  it("resets to zero", () => {
    useCounterStore.setState({ count: 10 });
    useCounterStore.getState().reset();
    expect(useCounterStore.getState().count).toBe(0);
  });
});
```

## Component Test

```tsx
// tests/component/entities/counter/Counter.test.tsx
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Counter } from "@entities/counter";

afterEach(cleanup);

describe("Counter", () => {
  it("renders initial count", () => {
    render(<Counter />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("increments on button click", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole("button", { name: /increment/i }));

    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
```

## E2E Test (Playwright)

```ts
// tests/e2e/pages/dashboard.spec.ts
import { expect, test } from "@playwright/test";

test.describe("Dashboard page", () => {
  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/dashboard");
    // Should redirect to OIDC provider
    await expect(page).toHaveURL(/oidc|login|auth/);
  });

  test("shows title on home page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
```

## Test Setup

Global mocks live in `tests/setup.ts`. The setup is imported automatically via `vite.config.ts`.

For component tests, the `@testing-library/jest-dom` matchers (`.toBeInTheDocument()`, `.toBeVisible()`, etc.) are available globally.

## Coverage Thresholds

Vitest enforces minimum coverage:
- Lines: **80%**
- Functions: **80%**
- Branches: **70%**
- Statements: **80%**

## Checklist

- [ ] Test file in correct directory (`tests/unit/`, `tests/component/`, `tests/e2e/`)
- [ ] File naming: `*.test.ts(x)` for Vitest, `*.spec.ts` for Playwright
- [ ] Unit tests reset store state in `beforeEach`
- [ ] Component tests call `cleanup` in `afterEach`
- [ ] `npm run test:prod` passes
- [ ] `npm run test:coverage` meets thresholds
