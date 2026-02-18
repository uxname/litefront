# LiteFront Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement E2E tests, Sentry error monitoring, proper FSD architecture, and unit/integration tests for LiteFront.

**Architecture:** Migration to Feature-Sliced Design with proper layering (app/entities/features/shared/widgets/pages), comprehensive test coverage (unit/component/integration/E2E), and production-ready error monitoring.

**Tech Stack:** React 19, TypeScript, Vite, TanStack Router, Playwright, Vitest, Testing Library, Sentry, Zustand, MSW

---

## Pre-Implementation Setup

### Task 0.1: Verify Environment

**Files:**
- Check: `package.json`
- Check: `vitest.config.ts` (via vite.config.ts)

**Step 1: Verify Node.js version**

Run: `node --version`
Expected: v18+ or v20+

**Step 2: Install dependencies**

Run: `npm install`
Expected: Clean install, no errors

**Step 3: Verify app runs**

Run: `npm run start:dev`
Wait: 5 seconds
Stop: Ctrl+C

**Step 4: Verify tests run**

Run: `npm run test:prod`
Expected: 1 test passing (sum.test.ts)

---

## Phase 1: FSD Architecture Restructure

### Task 1.1: Create Directory Structure

**Files:**
- Create: `src/app/providers/` directory
- Create: `src/entities/counter/` directory  
- Create: `src/entities/counter/model/` directory
- Create: `src/entities/counter/ui/` directory
- Create: `src/features/auth/` directory
- Create: `src/features/auth/model/` directory
- Create: `src/features/auth/api/` directory
- Create: `src/features/auth/ui/` directory
- Create: `src/shared/api/` directory
- Create: `src/shared/config/` directory
- Create: `src/shared/lib/` directory

**Step 1: Create directories**

Run:
```bash
mkdir -p src/app/providers
mkdir -p src/entities/counter/model src/entities/counter/ui
mkdir -p src/features/auth/model src/features/auth/api src/features/auth/ui
mkdir -p src/shared/api src/shared/config src/shared/lib
```

**Step 2: Verify structure**

Run: `find src -type d | sort`
Expected: All new directories listed

---

### Task 1.2: Migrate Counter to entities/

**Files:**
- Read: `src/shared/counter/store/counter.store.ts`
- Read: `src/shared/counter/components/index.tsx`
- Create: `src/entities/counter/model/store.ts`
- Create: `src/entities/counter/model/types.ts`
- Create: `src/entities/counter/ui/Counter.tsx`
- Create: `src/entities/counter/ui/Counter.stories.tsx`
- Create: `src/entities/counter/index.ts`

**Step 1: Read current counter store**

```typescript
// Content from src/shared/counter/store/counter.store.ts
```

**Step 2: Create store with types**

Create: `src/entities/counter/model/types.ts`

```typescript
export interface CounterState {
  count: number;
}

export interface CounterActions {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export type CounterStore = CounterState & CounterActions;
```

**Step 3: Create store implementation**

Create: `src/entities/counter/model/store.ts`

```typescript
import { create } from 'zustand';
import { CounterStore } from './types';

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

**Step 4: Create Counter component**

Create: `src/entities/counter/ui/Counter.tsx`

```typescript
import { useCounterStore } from '../model/store';

export const Counter = () => {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div className="flex flex-col items-center gap-4 p-4" data-testid="counter">
      <span data-testid="counter-value" className="text-2xl font-bold">
        {count}
      </span>
      <div className="flex gap-2">
        <button
          onClick={decrement}
          className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
          aria-label="Decrement"
        >
          -
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
          aria-label="Reset"
        >
          Reset
        </button>
        <button
          onClick={increment}
          className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
          aria-label="Increment"
        >
          +
        </button>
      </div>
    </div>
  );
};
```

**Step 5: Create barrel export**

Create: `src/entities/counter/index.ts`

```typescript
export { useCounterStore } from './model/store';
export type { CounterState, CounterActions, CounterStore } from './model/types';
export { Counter } from './ui/Counter';
```

**Step 6: Copy stories (optional)**

Copy content from `src/shared/counter/components/index.stories.tsx` to `src/entities/counter/ui/Counter.stories.tsx`
Update imports to use new paths.

**Step 7: Verify build**

Run: `npm run ts:check`
Expected: No TypeScript errors

---

### Task 1.3: Migrate Auth to features/

**Files:**
- Read: `src/shared/auth/index.ts`
- Create: `src/features/auth/model/types.ts`
- Create: `src/features/auth/model/store.ts`
- Create: `src/features/auth/api/oidc-client.ts`
- Create: `src/features/auth/ui/AuthGuard.tsx`
- Create: `src/features/auth/index.ts`

**Step 1: Read current auth implementation**

```typescript
// Content from src/shared/auth/index.ts
import { WebStorageStateStore } from "oidc-client-ts";
import { AuthProviderProps } from "react-oidc-context";

export const oidcConfig: AuthProviderProps = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
  scope: import.meta.env.VITE_OIDC_SCOPE,
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export type { AuthContextProps } from "react-oidc-context";
export { AuthProvider, useAuth } from "react-oidc-context";
```

**Step 2: Create auth types**

Create: `src/features/auth/model/types.ts`

```typescript
export interface User {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: Error | null;
}

export interface AuthActions {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  handleCallback: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;
```

**Step 3: Create OIDC config**

Create: `src/features/auth/api/oidc-client.ts`

```typescript
import { WebStorageStateStore } from 'oidc-client-ts';
import type { AuthProviderProps } from 'react-oidc-context';

export const oidcConfig: AuthProviderProps = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
  scope: import.meta.env.VITE_OIDC_SCOPE,
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

// Re-export for convenience
export type { AuthContextProps } from 'react-oidc-context';
export { AuthProvider, useAuth } from 'react-oidc-context';
```

**Step 4: Create AuthGuard component**

Create: `src/features/auth/ui/AuthGuard.tsx`

```typescript
import { Navigate } from '@tanstack/react-router';
import { useAuth } from '../api/oidc-client';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner" />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
```

**Step 5: Create barrel export**

Create: `src/features/auth/index.ts`

```typescript
export { oidcConfig } from './api/oidc-client';
export type { AuthContextProps } from './api/oidc-client';
export { AuthProvider, useAuth } from './api/oidc-client';
export { AuthGuard } from './ui/AuthGuard';
export type { User, AuthState, AuthActions, AuthStore } from './model/types';
```

**Step 6: Verify build**

Run: `npm run ts:check`
Expected: No TypeScript errors

---

### Task 1.4: Create Shared API Layer

**Files:**
- Read: `src/routes/__root.tsx` (GraphQL client setup)
- Create: `src/shared/api/graphql-client.ts`
- Create: `src/shared/api/index.ts`

**Step 1: Extract GraphQL client**

Create: `src/shared/api/graphql-client.ts`

```typescript
import { Client, cacheExchange, fetchExchange } from 'urql';

export const createGraphQLClient = (accessToken?: string): Client => {
  return new Client({
    url: import.meta.env.VITE_GRAPHQL_API_URL,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {},
    },
    requestPolicy: 'cache-and-network',
  });
};

export { Provider as GraphQLProvider } from 'urql';
```

**Step 2: Create barrel export**

Create: `src/shared/api/index.ts`

```typescript
export { createGraphQLClient, GraphQLProvider } from './graphql-client';
```

**Step 3: Verify build**

Run: `npm run ts:check`
Expected: No TypeScript errors

---

### Task 1.5: Create Shared Config Layer

**Files:**
- Create: `src/shared/config/env.ts`
- Create: `src/shared/config/index.ts`

**Step 1: Create environment validation**

Create: `src/shared/config/env.ts`

```typescript
interface Env {
  VITE_OIDC_AUTHORITY: string;
  VITE_OIDC_CLIENT_ID: string;
  VITE_OIDC_REDIRECT_URI: string;
  VITE_OIDC_SCOPE: string;
  VITE_GRAPHQL_API_URL: string;
  PORT: string;
}

const requiredEnvVars: (keyof Env)[] = [
  'VITE_OIDC_AUTHORITY',
  'VITE_OIDC_CLIENT_ID',
  'VITE_OIDC_REDIRECT_URI',
  'VITE_OIDC_SCOPE',
  'VITE_GRAPHQL_API_URL',
];

export const env: Env = {
  VITE_OIDC_AUTHORITY: import.meta.env.VITE_OIDC_AUTHORITY,
  VITE_OIDC_CLIENT_ID: import.meta.env.VITE_OIDC_CLIENT_ID,
  VITE_OIDC_REDIRECT_URI: import.meta.env.VITE_OIDC_REDIRECT_URI,
  VITE_OIDC_SCOPE: import.meta.env.VITE_OIDC_SCOPE,
  VITE_GRAPHQL_API_URL: import.meta.env.VITE_GRAPHQL_API_URL,
  PORT: import.meta.env.PORT || '3000',
};

// Validation (runs only in development)
if (import.meta.env.DEV) {
  const missing = requiredEnvVars.filter((key) => !env[key]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

**Step 2: Create barrel export**

Create: `src/shared/config/index.ts`

```typescript
export { env } from './env';
```

---

### Task 1.6: Update Imports in Main Files

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/routes/__root.tsx`

**Step 1: Update main.tsx**

Modify: `src/main.tsx`

Old:
```typescript
import { AuthProvider, oidcConfig } from "@shared/auth";
```

New:
```typescript
import { AuthProvider, oidcConfig } from "@features/auth";
```

**Step 2: Update __root.tsx**

Modify: `src/routes/__root.tsx`

Old:
```typescript
import { AuthContextProps, useAuth } from "@shared/auth";
import { Client, cacheExchange, fetchExchange, Provider } from "urql";
```

New:
```typescript
import { AuthContextProps, useAuth } from "@features/auth";
import { createGraphQLClient, GraphQLProvider } from "@shared/api";
```

Replace client creation:
Old:
```typescript
const graphqlClient = useMemo(
  () => makeGraphQLClient(auth.user?.id_token),
  [auth.user?.id_token],
);

function makeGraphQLClient(accessToken: string | undefined): Client {
  return new Client({...});
}
```

New:
```typescript
const graphqlClient = useMemo(
  () => createGraphQLClient(auth.user?.id_token),
  [auth.user?.id_token],
);
```

Replace Provider usage:
Old: `<Provider value={graphqlClient}>`
New: `<GraphQLProvider value={graphqlClient}>`

**Step 3: Update home page**

Modify: `src/pages/home/ui/index.tsx`

Old:
```typescript
import { Counter } from "@shared/counter";
```

New:
```typescript
import { Counter } from "@entities/counter";
```

**Step 4: Update protected page**

Modify: `src/pages/protected/ui/index.tsx`

Old:
```typescript
import { useAuth } from "@shared/auth";
```

New:
```typescript
import { useAuth } from "@features/auth";
```

**Step 5: Verify build**

Run: `npm run ts:check`
Expected: No errors

Run: `npm run build`
Expected: Successful build

---

### Task 1.7: Update Path Aliases

**Files:**
- Modify: `tsconfig.json`
- Modify: `vite.config.ts`
- Modify: `knip.json`

**Step 1: Update tsconfig.json**

Modify: `tsconfig.json`

Add to paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@app/*": ["./src/app/*"],
      "@entities/*": ["./src/entities/*"],
      "@features/*": ["./src/features/*"],
      "@shared/*": ["./src/shared/*"],
      "@widgets/*": ["./src/widgets/*"],
      "@pages/*": ["./src/pages/*"],
      "@generated/*": ["./src/generated/*"]
    }
  }
}
```

**Step 2: Update vite.config.ts**

Modify: `vite.config.ts`

Add to plugins (if tsconfigPaths doesn't pick up new paths):
```typescript
// Ensure tsconfigPaths() is in plugins array
plugins: [
  tsconfigPaths(),
  // ... other plugins
]
```

**Step 3: Update knip.json**

Modify: `knip.json`

Update paths section:
```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@app/*": ["./src/app/*"],
    "@entities/*": ["./src/entities/*"],
    "@features/*": ["./src/features/*"],
    "@shared/*": ["./src/shared/*"],
    "@widgets/*": ["./src/widgets/*"],
    "@pages/*": ["./src/pages/*"],
    "@public/*": ["./public/*"]
  }
}
```

**Step 4: Run checks**

Run:
```bash
npm run ts:check
npm run knip
npm run lint
```

Expected: All pass

---

### Task 1.8: Remove Old Structure

**Files:**
- Delete: `src/shared/counter/` directory
- Delete: `src/shared/auth/` directory
- Modify: `src/shared/index.ts` (if exists)

**Step 1: Delete old directories**

Run:
```bash
rm -rf src/shared/counter
rm -rf src/shared/auth
```

**Step 2: Verify build still works**

Run: `npm run build`
Expected: Successful build

Run: `npm run start:dev`
Wait: 5 seconds
Stop: Ctrl+C

**Step 3: Commit**

```bash
git add -A
git commit -m "refactor: migrate to proper FSD architecture

- Move counter to entities layer
- Move auth to features layer  
- Create shared/api and shared/config layers
- Update all imports
- Add new path aliases"
```

---

## Phase 2: Unit and Component Tests

### Task 2.1: Setup Test Infrastructure

**Files:**
- Create: `tests/setup.ts`
- Modify: `vite.config.ts`
- Create: `tests/unit/entities/counter/store.test.ts`

**Step 1: Install test dependencies**

Run:
```bash
npm install -D @testing-library/jest-dom @testing-library/react @testing-library/user-event jsdom @vitest/coverage-v8
```

**Step 2: Create test setup**

Create: `tests/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock environment variables
vi.stubGlobal('import.meta', {
  env: {
    VITE_GRAPHQL_API_URL: 'http://localhost:4000/graphql',
    VITE_OIDC_AUTHORITY: 'https://test.oidc.com',
    VITE_OIDC_CLIENT_ID: 'test-client',
    VITE_OIDC_REDIRECT_URI: 'http://localhost:3000/callback',
    VITE_OIDC_SCOPE: 'openid profile',
    DEV: true,
    PROD: false,
  },
});
```

**Step 3: Update vite.config.ts**

Modify: `vite.config.ts`

Update test configuration:
```typescript
export default defineConfig({
  // ... existing config
  test: {
    exclude: ['tests/e2e', 'node_modules', 'dist'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
      exclude: [
        'node_modules/',
        'src/generated/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.stories.*',
      ],
    },
  },
});
```

**Step 4: Verify test setup**

Run: `npm run test:prod`
Expected: Test runner starts successfully

---

### Task 2.2: Write Counter Store Tests

**Files:**
- Create: `tests/unit/entities/counter/store.test.ts`

**Step 1: Write failing test**

Create: `tests/unit/entities/counter/store.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useCounterStore } from '@/entities/counter';

describe('CounterStore', () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 });
  });

  it('should initialize with count 0', () => {
    const state = useCounterStore.getState();
    expect(state.count).toBe(0);
  });

  it('should increment count', () => {
    const { increment } = useCounterStore.getState();
    increment();
    expect(useCounterStore.getState().count).toBe(1);
  });

  it('should decrement count', () => {
    useCounterStore.setState({ count: 5 });
    const { decrement } = useCounterStore.getState();
    decrement();
    expect(useCounterStore.getState().count).toBe(4);
  });

  it('should reset count to 0', () => {
    useCounterStore.setState({ count: 10 });
    const { reset } = useCounterStore.getState();
    reset();
    expect(useCounterStore.getState().count).toBe(0);
  });
});
```

**Step 2: Run test**

Run: `npm run test:prod -- tests/unit/entities/counter/store.test.ts`
Expected: 4 tests passing

**Step 3: Commit**

```bash
git add -A
git commit -m "test: add CounterStore unit tests"
```

---

### Task 2.3: Write Counter Component Tests

**Files:**
- Create: `tests/component/entities/counter/Counter.test.tsx`

**Step 1: Write component test**

Create: `tests/component/entities/counter/Counter.test.tsx`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter, useCounterStore } from '@/entities/counter';

describe('Counter Component', () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 });
  });

  it('renders with initial count 0', () => {
    render(<Counter />);
    expect(screen.getByTestId('counter-value')).toHaveTextContent('0');
  });

  it('increments when + button clicked', () => {
    render(<Counter />);
    fireEvent.click(screen.getByRole('button', { name: /increment/i }));
    expect(screen.getByTestId('counter-value')).toHaveTextContent('1');
  });

  it('decrements when - button clicked', () => {
    render(<Counter />);
    fireEvent.click(screen.getByRole('button', { name: /decrement/i }));
    expect(screen.getByTestId('counter-value')).toHaveTextContent('-1');
  });

  it('resets to 0 when reset button clicked', () => {
    useCounterStore.setState({ count: 5 });
    render(<Counter />);
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(screen.getByTestId('counter-value')).toHaveTextContent('0');
  });
});
```

**Step 2: Run test**

Run: `npm run test:prod -- tests/component/entities/counter/Counter.test.tsx`
Expected: 4 tests passing

**Step 3: Commit**

```bash
git add -A
git commit -m "test: add Counter component tests"
```

---

### Task 2.4: Write ErrorFallback Component Tests

**Files:**
- Create: `tests/component/shared/ui/ErrorFallback.test.tsx`

**Step 1: Read ErrorFallback component**

Read: `src/shared/ui/ErrorFallback/index.tsx`

**Step 2: Write test**

Create: `tests/component/shared/ui/ErrorFallback.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorFallback } from '@/shared/ui/ErrorFallback';

describe('ErrorFallback', () => {
  it('displays error message', () => {
    const error = new Error('Test error message');
    render(
      <ErrorFallback
        error={error}
        reset={vi.fn()}
        pathname="/test"
      />
    );
    expect(screen.getByText(/test error message/i)).toBeInTheDocument();
  });

  it('calls reset when retry button clicked', () => {
    const reset = vi.fn();
    const onRetry = vi.fn();
    const error = new Error('Test error');
    
    render(
      <ErrorFallback
        error={error}
        reset={reset}
        onRetry={onRetry}
        pathname="/test"
      />
    );
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);
    
    expect(reset).toHaveBeenCalled();
    expect(onRetry).toHaveBeenCalled();
  });
});
```

**Step 3: Run test**

Run: `npm run test:prod -- tests/component/shared/ui/ErrorFallback.test.tsx`
Expected: Tests pass (adjust if component interface differs)

**Step 4: Commit**

```bash
git add -A
git commit -m "test: add ErrorFallback component tests"
```

---

### Task 2.5: Add Coverage Reporting

**Files:**
- Modify: `package.json`

**Step 1: Add coverage script**

Modify: `package.json`

Add to scripts:
```json
{
  "scripts": {
    "test:coverage": "vitest run --coverage"
  }
}
```

**Step 2: Run coverage**

Run: `npm run test:coverage`
Expected: Coverage report generated

**Step 3: Verify thresholds**

Check that coverage meets thresholds (80% lines/functions, 70% branches)

**Step 4: Commit**

```bash
git add -A
git commit -m "test: add coverage reporting and thresholds"
```

---

## Phase 3: E2E Tests with Playwright

### Task 3.1: Update Playwright Configuration

**Files:**
- Modify: `playwright.config.ts`
- Create: `tests/e2e/fixtures/auth.ts`

**Step 1: Update playwright config**

Modify: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config({ quiet: true });

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.VITE_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run start:dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

**Step 2: Create auth fixtures**

Create: `tests/e2e/fixtures/auth.ts`

```typescript
import { test as base, expect, Page } from '@playwright/test';

export type AuthFixture = {
  authPage: Page;
};

export const test = base.extend<AuthFixture>({
  authPage: async ({ page }, use) => {
    // Mock authenticated state by setting localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem(
        'oidc.user:https://test.oidc.com:test-client',
        JSON.stringify({
          access_token: 'mock-token',
          expires_at: Date.now() + 3600000,
          profile: {
            sub: 'test-user-id',
            email: 'test@example.com',
            name: 'Test User',
          },
        })
      );
    });
    await use(page);
  },
});

export { expect };
```

---

### Task 3.2: Write Home Page E2E Tests

**Files:**
- Delete: `tests/e2e/example.spec.ts`
- Create: `tests/e2e/pages/home.spec.ts`

**Step 1: Delete old example test**

Run: `rm tests/e2e/example.spec.ts`

**Step 2: Write home page tests**

Create: `tests/e2e/pages/home.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/LiteFront/i);
  });

  test('displays hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Build Modern Frontends/i })).toBeVisible();
  });

  test('displays GraphQL data (country)', async ({ page }) => {
    // Wait for GraphQL data to load
    await expect(page.getByText('Brazil')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Brasília/)).toBeVisible();
  });

  test('counter increments on click', async ({ page }) => {
    const counterValue = page.getByTestId('counter-value');
    await expect(counterValue).toHaveText('0');
    
    await page.getByRole('button', { name: /increment/i }).click();
    await expect(counterValue).toHaveText('1');
  });

  test('copy command button works', async ({ page }) => {
    const copyButton = page.getByRole('button', { name: /npx degit/i });
    await copyButton.click();
    
    // Check for toast notification
    await expect(page.getByText(/copied to clipboard/i)).toBeVisible();
  });

  test('navigation to protected page redirects to home when not authenticated', async ({ page }) => {
    await page.goto('/protected');
    // Should redirect back to home since user is not authenticated
    await expect(page).toHaveURL('/');
  });
});
```

**Step 3: Run tests**

Run: `npm run test:e2e:prod -- tests/e2e/pages/home.spec.ts`
Expected: All tests pass

**Step 4: Commit**

```bash
git add -A
git commit -m "test: add E2E tests for home page"
```

---

### Task 3.3: Write Protected Page E2E Tests

**Files:**
- Create: `tests/e2e/pages/protected.spec.ts`

**Step 1: Write protected page tests**

Create: `tests/e2e/pages/protected.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Protected Page', () => {
  test('redirects unauthenticated users to home', async ({ page }) => {
    await page.goto('/protected');
    await expect(page).toHaveURL('/');
  });

  test.describe('Authenticated', () => {
    test.beforeEach(async ({ page }) => {
      // Set up authenticated state
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem(
          'oidc.user:https://oalmxx.logto.app/oidc:foxpqpb09d3rzxn9r4pfj',
          JSON.stringify({
            access_token: 'mock-token',
            expires_at: Date.now() + 3600000,
            profile: {
              sub: 'test-user-id',
              email: 'test@example.com',
              name: 'Test User',
            },
          })
        );
      });
    });

    test('displays identity dashboard for authenticated user', async ({ page }) => {
      await page.goto('/protected');
      await expect(page.getByText('Identity Dashboard')).toBeVisible();
    });

    test('displays user email', async ({ page }) => {
      await page.goto('/protected');
      await expect(page.getByText('test@example.com')).toBeVisible();
    });

    test('logout button is visible', async ({ page }) => {
      await page.goto('/protected');
      await expect(page.getByRole('button', { name: /end session/i })).toBeVisible();
    });

    test('token claims table is displayed', async ({ page }) => {
      await page.goto('/protected');
      await expect(page.getByText('Token Claims')).toBeVisible();
      await expect(page.getByText('sub')).toBeVisible();
      await expect(page.getByText('email')).toBeVisible();
    });
  });
});
```

**Step 2: Run tests**

Run: `npm run test:e2e:prod -- tests/e2e/pages/protected.spec.ts`
Expected: All tests pass

**Step 3: Commit**

```bash
git add -A
git commit -m "test: add E2E tests for protected page"
```

---

### Task 3.4: Write 404 Page E2E Tests

**Files:**
- Create: `tests/e2e/pages/404.spec.ts`

**Step 1: Write 404 tests**

Create: `tests/e2e/pages/404.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('404 Page', () => {
  test('displays custom 404 page for unknown routes', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Check that custom 404 content is displayed
    await expect(page.getByText(/404|not found/i)).toBeVisible();
  });

  test('has link back to home', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    const homeLink = page.getByRole('link', { name: /home|back/i });
    await expect(homeLink).toBeVisible();
    
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });
});
```

**Step 2: Run tests**

Run: `npm run test:e2e:prod -- tests/e2e/pages/404.spec.ts`
Expected: Tests pass

**Step 3: Run all E2E tests**

Run: `npm run test:e2e:prod`
Expected: All E2E tests pass

**Step 4: Commit**

```bash
git add -A
git commit -m "test: add E2E tests for 404 page"
```

---

## Phase 4: Sentry Integration

### Task 4.1: Install Sentry Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install packages**

Run:
```bash
npm install @sentry/react
npm install -D @sentry/vite-plugin
```

**Step 2: Verify installation**

Run: `npm run ts:check`
Expected: No errors

---

### Task 4.2: Create Sentry Configuration

**Files:**
- Create: `src/shared/lib/sentry/config.ts`
- Create: `src/shared/lib/sentry/index.ts`
- Modify: `src/shared/lib/index.ts` (create if not exists)

**Step 1: Create Sentry config**

Create: `src/shared/lib/sentry/config.ts`

```typescript
import * as Sentry from '@sentry/react';

export const initSentry = () => {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn('Sentry DSN not configured');
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION || 'development',
    
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // Performance monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    
    // Session replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    beforeSend: (event) => {
      // Sanitize sensitive data
      if (event.exception) {
        // Remove potential PII from error messages
        event.exception.values?.forEach((value) => {
          if (value.stacktrace) {
            value.stacktrace.frames?.forEach((frame) => {
              // Remove query params from filenames
              if (frame.filename) {
                frame.filename = frame.filename.split('?')[0];
              }
            });
          }
        });
      }
      return event;
    },
  });
};

export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const setUser = Sentry.setUser;
export const withScope = Sentry.withScope;
```

**Step 2: Create barrel export**

Create: `src/shared/lib/sentry/index.ts`

```typescript
export { initSentry, captureException, captureMessage, setUser, withScope } from './config';
```

---

### Task 4.3: Initialize Sentry in Application

**Files:**
- Modify: `src/main.tsx`

**Step 1: Add Sentry initialization**

Modify: `src/main.tsx`

Add at the top of the file (before other imports):
```typescript
import { initSentry } from '@/shared/lib/sentry';

// Initialize Sentry before React
initSentry();
```

**Step 2: Update imports**

Add to imports:
```typescript
import { setUser } from '@/shared/lib/sentry';
```

**Step 3: Set user context when authenticated**

Modify App component to set Sentry user:
```typescript
const App = () => {
  const auth = useAuth();

  // Set Sentry user context
  React.useEffect(() => {
    if (auth.isAuthenticated && auth.user?.profile) {
      setUser({
        id: auth.user.profile.sub,
        email: auth.user.profile.email,
        username: auth.user.profile.name,
      });
    } else {
      setUser(null);
    }
  }, [auth.isAuthenticated, auth.user]);

  if (auth.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  return <RouterProvider router={router} context={{ auth }} />;
};
```

**Step 4: Verify build**

Run: `npm run ts:check`
Expected: No errors

---

### Task 4.4: Integrate Sentry with Error Boundary

**Files:**
- Modify: `src/app/providers/GlobalErrorBoundary.tsx`

**Step 1: Add Sentry capture**

Modify: `src/app/providers/GlobalErrorBoundary.tsx`

Add import:
```typescript
import { captureException } from '@/shared/lib/sentry';
```

Add to componentDidCatch or error handler:
```typescript
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  // Log to Sentry
  captureException(error, {
    extra: {
      componentStack: errorInfo.componentStack,
    },
  });
  
  // Existing error handling...
}
```

**Step 2: Verify build**

Run: `npm run ts:check`
Expected: No errors

---

### Task 4.5: Configure Source Maps Upload

**Files:**
- Modify: `vite.config.ts`
- Modify: `.env.example`

**Step 1: Add Sentry Vite plugin**

Modify: `vite.config.ts`

Add import:
```typescript
import { sentryVitePlugin } from '@sentry/vite-plugin';
```

Add to plugins (last in array):
```typescript
plugins: [
  // ... other plugins
  sentryVitePlugin({
    org: process.env.VITE_SENTRY_ORG,
    project: process.env.VITE_SENTRY_PROJECT,
    authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
    sourcemaps: {
      filesToDeleteAfterUpload: ['**/*.map'],
    },
  }),
],
```

**Step 2: Update .env.example**

Modify: `.env.example`

Add:
```env
# Sentry Configuration (optional)
VITE_SENTRY_DSN=
VITE_SENTRY_ORG=
VITE_SENTRY_PROJECT=
VITE_SENTRY_AUTH_TOKEN=  # Build-time only
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds (Sentry plugin will warn if auth token missing)

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: integrate Sentry for error monitoring

- Add Sentry React SDK
- Configure error boundary integration
- Add user context from auth
- Configure source map upload"
```

---

### Task 4.6: Add GraphQL Error Capture

**Files:**
- Modify: `src/shared/api/graphql-client.ts`

**Step 1: Add error handling**

Modify: `src/shared/api/graphql-client.ts`

```typescript
import { Client, cacheExchange, fetchExchange, errorExchange } from 'urql';
import { captureException } from '@/shared/lib/sentry';

export const createGraphQLClient = (accessToken?: string): Client => {
  return new Client({
    url: import.meta.env.VITE_GRAPHQL_API_URL,
    exchanges: [
      cacheExchange,
      errorExchange({
        onError: (error) => {
          captureException(error, {
            tags: { source: 'graphql' },
            extra: {
              query: error.query,
            },
          });
        },
      }),
      fetchExchange,
    ],
    fetchOptions: {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {},
    },
    requestPolicy: 'cache-and-network',
  });
};

export { Provider as GraphQLProvider } from 'urql';
```

**Step 2: Verify build**

Run: `npm run ts:check`
Expected: No errors

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: capture GraphQL errors to Sentry"
```

---

## Phase 5: Final Integration and Verification

### Task 5.1: Run All Tests

**Files:**
- All test files

**Step 1: Run unit tests**

Run: `npm run test:prod`
Expected: All unit tests pass

**Step 2: Run E2E tests**

Run: `npm run test:e2e:prod`
Expected: All E2E tests pass

**Step 3: Run linting**

Run: `npm run check`
Expected: No lint errors

---

### Task 5.2: Verify Production Build

**Files:**
- Build output

**Step 1: Build application**

Run: `npm run build`
Expected: Successful build

**Step 2: Verify build output**

Check that dist/ contains:
- HTML files
- JS bundles
- Source maps (if Sentry DSN configured)

**Step 3: Test production build**

Run: `npm run start:prod`
Wait: 5 seconds
Test: Open browser at http://localhost:3000
Verify: App loads, no console errors
Stop: Ctrl+C

---

### Task 5.3: Update Documentation

**Files:**
- Modify: `README.md`

**Step 1: Add testing section**

Add to README.md:

```markdown
## Testing

### Unit Tests
\`\`\`bash
npm run test:prod
\`\`\`

### E2E Tests
\`\`\`bash
# Run in headless mode
npm run test:e2e:prod

# Run with UI
npm run test:e2e:dev
\`\`\`

### Coverage
\`\`\`bash
npm run test:coverage
\`\`\`

## Error Monitoring

This application uses Sentry for error monitoring. Configure via environment variables:

\`\`\`env
VITE_SENTRY_DSN=your-sentry-dsn
\`\`\`
```

**Step 2: Commit documentation**

```bash
git add README.md
git commit -m "docs: update README with testing and Sentry info"
```

---

### Task 5.4: Final Commit

**Step 1: Run final checks**

Run:
```bash
npm run check
npm run test:prod
npm run build
```

**Step 2: Commit any remaining changes**

```bash
git add -A
git commit -m "feat: complete LiteFront improvements implementation

- Implement proper FSD architecture
- Add comprehensive test coverage (unit, component, E2E)
- Integrate Sentry for error monitoring
- Add GraphQL error tracking
- Configure source map upload
- Update documentation"
```

---

## Summary

### Changes Made

1. **FSD Architecture**: Restructured codebase into proper layers (app, entities, features, shared, widgets, pages)
2. **Unit Tests**: Added tests for stores and utilities
3. **Component Tests**: Added tests for React components
4. **E2E Tests**: Added Playwright tests for all pages
5. **Sentry Integration**: Added error monitoring and source maps

### Test Coverage

- Unit: Counter store, utilities
- Component: Counter, ErrorFallback
- E2E: Home, Protected, 404 pages

### New Dependencies

- `@sentry/react` - Error monitoring
- `@sentry/vite-plugin` - Source map upload
- `@testing-library/jest-dom` - Testing utilities
- `@testing-library/react` - React testing
- `@testing-library/user-event` - User interactions
- `jsdom` - Browser environment for tests
- `@vitest/coverage-v8` - Coverage reporting

### Environment Variables Added

```env
VITE_SENTRY_DSN=          # Sentry project DSN
VITE_SENTRY_ORG=          # Sentry organization
VITE_SENTRY_PROJECT=      # Sentry project name
VITE_SENTRY_AUTH_TOKEN=   # Sentry auth token (build-time only)
```

---

## Next Steps

1. **Configure Sentry**: Add DSN to production environment
2. **Set up CI/CD**: Run tests on every PR
3. **Increase coverage**: Add more component and integration tests
4. **Add visual testing**: Consider Chromatic or Loki for visual regression
5. **Performance budgets**: Add bundle size monitoring
