# LiteFront Improvements Design

**Date:** 2026-02-18  
**Scope:** E2E Tests, Sentry Integration, FSD Architecture, Unit Tests

---

## Overview

This design document outlines improvements for the LiteFront project focusing on four key areas:
1. E2E test coverage with Playwright
2. Error monitoring with Sentry
3. Proper FSD architecture implementation
4. Unit and integration test coverage

---

## 1. E2E Tests (Playwright)

### Problem Statement
Current E2E tests (`tests/e2e/example.spec.ts`) test external site (playwright.dev) instead of the actual application, providing zero value for regression detection.

### Solution Design

#### Test Coverage

| Page | Test Cases |
|------|------------|
| **Home** | Page load, GraphQL data display, Counter interaction, Error boundary trigger, Copy command functionality |
| **Protected** | Redirect to login for unauthenticated users, Display user data for authenticated users, Session information display, Logout functionality |
| **404** | Custom error page display, Navigation back to home |
| **Auth Flow** | OIDC redirect, Callback handling, Token persistence |

#### Architecture

```
tests/e2e/
├── auth/
│   └── auth-flow.spec.ts          # Login/logout flow with OIDC
├── pages/
│   ├── home.spec.ts               # Home page comprehensive tests
│   ├── protected.spec.ts          # Protected route tests (authenticated)
│   └── 404.spec.ts                # Not found page tests
├── fixtures/
│   └── auth-helpers.ts            # Authentication utilities
└── utils/
    └── test-utils.ts              # Common test utilities
```

#### Implementation Strategy

**Option A: Real OIDC Provider**
- Pros: Tests real auth flow, catches integration issues
- Cons: Requires test user setup, slower, flaky potential

**Option B: Mock Auth (Recommended)**
- Use Playwright's `storageState` to inject authenticated session
- Mock GraphQL responses with MSW or direct API mocking
- Pros: Fast, reliable, no external dependencies

**Recommendation:** Start with Option B for reliability, add smoke tests with real OIDC separately.

#### Key Test Scenarios

```typescript
// tests/e2e/pages/home.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('loads and displays GraphQL data', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Brazil')).toBeVisible();
  });

  test('counter increments on click', async ({ page }) => {
    await page.goto('/');
    const counter = page.getByTestId('counter-value');
    await expect(counter).toHaveText('0');
    await page.getByRole('button', { name: /increment/i }).click();
    await expect(counter).toHaveText('1');
  });

  test('error boundary catches errors', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /crash application/i }).click();
    await expect(page.getByText(/error boundary/i)).toBeVisible();
  });
});
```

---

## 2. Sentry Integration (Error Monitoring)

### Problem Statement
No error tracking in production. Runtime errors, GraphQL failures, and auth issues go unnoticed.

### Solution Design

#### Components

| Component | Purpose |
|-----------|---------|
| `@sentry/react` | React error boundaries, component tracing |
| `@sentry/browser` | Core SDK |
| `@sentry/vite-plugin` | Source map upload |

#### Integration Points

1. **Global Error Boundary** (`src/app/providers/GlobalErrorBoundary.tsx`)
   - Capture React errors to Sentry
   - Include user context when authenticated

2. **GraphQL Client** (`src/routes/__root.tsx`)
   - Capture GraphQL errors
   - Track slow queries

3. **Auth Flow** (`src/shared/auth/`)
   - Capture OIDC errors
   - Track login/logout events

4. **Performance Monitoring**
   - Web Vitals (LCP, FID, CLS)
   - Route change tracking

#### Configuration

```typescript
// src/shared/lib/sentry/config.ts
import * as Sentry from '@sentry/react';

export const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
    
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    beforeSend: (event) => {
      // Sanitize PII
      if (event.exception) {
        // Remove sensitive data from error messages
      }
      return event;
    },
  });
};
```

#### Environment Variables

```env
VITE_SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz
VITE_SENTRY_ORG=your-org
VITE_SENTRY_PROJECT=your-project
VITE_SENTRY_AUTH_TOKEN=your-auth-token  # Build-time only
```

#### Source Maps

Configure Vite plugin for automatic upload:

```typescript
// vite.config.ts
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  plugins: [
    sentryVitePlugin({
      org: process.env.VITE_SENTRY_ORG,
      project: process.env.VITE_SENTRY_PROJECT,
      authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
    }),
  ],
  build: {
    sourcemap: true,
  },
});
```

---

## 3. FSD Architecture Implementation

### Problem Statement
Current structure violates FSD principles:
- `shared/counter` is a feature, not shared code
- `shared/auth` is a feature with business logic
- Missing layers: `entities`, `features`, `app`

### Solution Design

#### Target Structure

```
src/
├── app/                          # Application initialization
│   ├── entry-client.tsx         # Client entry point
│   ├── entry-server.tsx         # Server entry point (SSR-ready)
│   ├── providers/               # Global providers composition
│   │   ├── AppProviders.tsx
│   │   ├── GlobalErrorBoundary.tsx
│   │   └── SentryProvider.tsx   # NEW
│   ├── styles/                  # Global styles
│   │   └── index.css
│   └── router.tsx               # Router configuration
│
├── entities/                     # Business entities
│   └── counter/                 # Moved from shared/counter
│       ├── index.ts
│       ├── model/
│       │   ├── store.ts         # Zustand store
│       │   └── types.ts
│       └── ui/
│           ├── Counter.tsx
│           └── Counter.stories.tsx
│
├── features/                     # User features
│   └── auth/                    # Moved from shared/auth
│       ├── index.ts
│       ├── model/
│       │   ├── store.ts
│       │   ├── types.ts
│       │   └── lib.ts
│       ├── api/
│       │   └── oidc-client.ts
│       └── ui/
│           ├── AuthGuard.tsx
│           ├── LoginButton.tsx
│           └── LogoutButton.tsx
│
├── shared/                       # Shared kernel
│   ├── api/                     # API clients
│   │   ├── graphql-client.ts    # URQL client setup
│   │   └── index.ts
│   ├── config/                  # Configuration
│   │   ├── env.ts               # Environment variables validation
│   │   └── index.ts
│   ├── lib/                     # Utility functions
│   │   ├── sentry/              # Sentry utilities
│   │   └── index.ts
│   └── ui/                      # UI kit
│       ├── Toaster/
│       ├── ErrorFallback/
│       └── index.ts
│
├── widgets/                      # Compositional components
│   └── Header/
│       ├── index.ts
│       └── ui/
│           └── Header.tsx
│
├── pages/                        # Route pages
│   ├── home/
│   ├── protected/
│   └── 404/
│
└── routes/                       # TanStack Router
    └── (generated files)
```

#### Migration Steps

1. **Create `entities/counter`**
   - Copy from `shared/counter`
   - Update exports
   - Add barrel exports

2. **Create `features/auth`**
   - Move from `shared/auth`
   - Split into model/api/ui
   - Keep facade pattern

3. **Update `shared/`**
   - Move GraphQL client to `shared/api`
   - Add environment validation to `shared/config`
   - Keep pure UI components in `shared/ui`

4. **Create `app/` layer**
   - Move providers from `src/app/`
   - Add entry points
   - Compose all providers

5. **Update imports**
   - Use path aliases: `@entities/counter`, `@features/auth`
   - Update tsconfig.json paths

#### Steiger Configuration

```javascript
// steiger.config.ts
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-rules';

export default defineConfig({
  rules: {
    ...fsd.rules,
    'no-public-api-sidestep': 'error',
    'no-cross-imports': 'error',
    'no-layer-imports': 'error',
  },
});
```

---

## 4. Unit and Integration Tests

### Problem Statement
Only demo test exists (`tests/sum.test.ts`). No coverage for:
- State management (Zustand stores)
- Business logic
- Component rendering
- Integration scenarios

### Solution Design

#### Test Types

| Type | Scope | Tools |
|------|-------|-------|
| **Unit** | Pure functions, stores | Vitest |
| **Component** | React components in isolation | Vitest + Testing Library |
| **Integration** | Feature workflows | Vitest + MSW |

#### Test Structure

```
tests/
├── unit/
│   ├── entities/
│   │   └── counter/
│   │       └── store.test.ts
│   ├── features/
│   │   └── auth/
│   │       └── store.test.ts
│   └── shared/
│       └── lib/
│           └── utils.test.ts
├── component/
│   ├── entities/
│   │   └── counter/
│   │       └── Counter.test.tsx
│   └── shared/
│       └── ui/
│           ├── Toaster.test.tsx
│           └── ErrorFallback.test.tsx
└── integration/
    └── features/
        └── auth/
            └── auth-flow.test.tsx
```

#### Test Examples

**Store Unit Test:**

```typescript
// tests/unit/entities/counter/store.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useCounterStore } from '@/entities/counter/model/store';

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
});
```

**Component Test:**

```typescript
// tests/component/entities/counter/Counter.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from '@/entities/counter/ui/Counter';

describe('Counter', () => {
  it('renders with initial count 0', () => {
    render(<Counter />);
    expect(screen.getByTestId('counter-value')).toHaveTextContent('0');
  });

  it('increments when + button clicked', () => {
    render(<Counter />);
    fireEvent.click(screen.getByRole('button', { name: /increment/i }));
    expect(screen.getByTestId('counter-value')).toHaveTextContent('1');
  });
});
```

**Integration Test:**

```typescript
// tests/integration/features/auth/auth-flow.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/features/auth/model/store';

describe('Auth Flow', () => {
  it('should handle complete login flow', async () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(false);
    
    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'pass' });
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });
});
```

#### Coverage Configuration

```typescript
// vite.config.ts
export default defineConfig({
  test: {
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
        '**/mock/**',
      ],
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
  },
});
```

#### Test Utilities

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
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

// Mock import.meta.env
vi.mock('import.meta.env', () => ({
  VITE_GRAPHQL_API_URL: 'http://localhost:4000/graphql',
  VITE_OIDC_AUTHORITY: 'https://test.oidc.com',
  VITE_OIDC_CLIENT_ID: 'test-client',
  VITE_OIDC_REDIRECT_URI: 'http://localhost:3000/callback',
  VITE_OIDC_SCOPE: 'openid profile',
}));
```

---

## Implementation Order

### Phase 1: Foundation (Week 1)
1. FSD architecture restructure
2. Add unit test infrastructure
3. Write store and utility tests

### Phase 2: Coverage (Week 2)
1. Component tests
2. Integration tests for auth
3. E2E test setup with mocks

### Phase 3: Monitoring (Week 3)
1. Sentry integration
2. Source maps configuration
3. E2E tests with real auth (optional)

---

## Success Criteria

- [ ] E2E tests cover all critical user flows
- [ ] Sentry reports production errors
- [ ] FSD structure passes Steiger validation
- [ ] Unit test coverage ≥ 80%
- [ ] CI/CD runs all test suites

---

## Open Questions

1. **E2E Auth:** Use mock auth or real OIDC provider for E2E?
2. **Sentry:** Cloud (sentry.io) or self-hosted?
3. **Test Data:** How to handle test user setup?

---

## Appendix

### Package Additions

```json
{
  "devDependencies": {
    "@sentry/vite-plugin": "^2.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/react": "^14.x",
    "@testing-library/user-event": "^14.x",
    "jsdom": "^24.x",
    "msw": "^2.x",
    "@vitest/coverage-v8": "^1.x"
  },
  "dependencies": {
    "@sentry/react": "^7.x"
  }
}
```

### Path Aliases Update

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
