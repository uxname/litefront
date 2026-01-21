# Project Context

## Purpose

This project is a modern, high-performance frontend application designed for scalability and maintainability. It utilizes a modular architecture to handle complex user interfaces, secure authentication, and type-safe data interactions with a GraphQL backend.

## Tech Stack

- **Core:** React 19, TypeScript 5.x (Strict Mode), Vite 7.x.
- **Architecture:** Feature-Sliced Design (FSD).
- **Routing:** TanStack Router (File-based, type-safe routing).
- **State Management:**
  - **Server State:** URQL (GraphQL Client).
  - **Client State:** Zustand.
- **Styling:** Tailwind CSS v4 + DaisyUI (Primary), CSS/SCSS Modules (Secondary/Complex components).
- **UI Libraries:**
  - **Icons:** `lucide-react`.
  - **Notifications:** `sonner` (exposed via `@shared/ui/Toaster`).
- **Internationalization:** Paraglide JS (Type-safe i18n).
- **Tooling:** Biome, Knip, Lefthook, Ladle (Component isolation).
- **Testing:** Vitest (Unit), Playwright (E2E).

## Project Conventions

### Code Style & Quality Assurance

- **Linter & Formatter:** We use **Biome** exclusively (no ESLint/Prettier).
  - *Reference:* Rules defined in `biome.json`.
- **Strict Typing:**
  - `any` is strictly forbidden.
  - All GraphQL operations must use auto-generated types via `npm run gen`.
- **React Compiler:** The project uses `babel-plugin-react-compiler`. Manual optimizations via `useMemo` and `useCallback` are generally unnecessary unless specifically required for complex cases.
- **Dead Code Analysis:** **Knip** is used to detect unused files and exports.
  - *Reference:* Configuration in `knip.json`.
- **Mandatory Verification:** All code changes must pass the strict verification script: `npm run check`.
  - This script aggregates **Stylelint**, **TypeScript compilation**, **Biome fixes**, **Knip analysis**, and **FSD architecture linting** (`steiger`).

### Design & UI/UX Strategy

The application targets a **"Modern, Clean, and Interesting"** aesthetic.
- **Visual Style:** Use subtle gradients ("blobs"), glassmorphism (`backdrop-blur`), and generous whitespace. Avoid generic "Bootstrap-like" layouts.
- **Interactivity:** Elements should feel alive. Use `hover:-translate-y`, `active:scale-95`, and smooth transitions for interactive elements.
- **Motion:** Use entry animations (e.g., `animate-in`, `fade-in`, `slide-in-from-bottom`) for page content to create a polished feel.
- **Shapes:** Prefer larger border radiuses (`rounded-xl` to `rounded-3xl`) and thin, delicate borders (`border-slate-200`).
- **Color Palette:**
  - **Structure:** Slate (50-900) for backgrounds and text.
  - **Accents:** Indigo/Violet/Blue for primary actions and decorative elements.
  - **Status:** Emerald (Success), Rose (Error), Amber (Warning).

### Architecture Patterns (Feature-Sliced Design)

The project strictly follows **Feature-Sliced Design (FSD)**.
- **Layers (Order of dependency):**
  1. `app/` - Global providers, styles, and initialization.
  2. `pages/` - Composition of widgets/features into routes.
  3. `widgets/` - Big, self-contained UI blocks (e.g., Header, Sidebar).
  4. `features/` - User interactions (e.g., AuthForm, AddToCart).
  5. `entities/` - Business logic and data visualization (e.g., User, Product).
  6. `shared/` - Reusable, business-agnostic code (UI kit, libs, API).
- **Auth Facade:** Authentication logic is decoupled. Always import auth hooks (`useAuth`) and providers from `@shared/auth`. Never import directly from `react-oidc-context` or `oidc-client-ts`.
- **Dependency Rule:** A layer can only import from layers **below** it.

### Routing Strategy

- **File-Based Routing:** Routes are defined in `src/routes`.
- **Generated Tree:** TanStack Router automatically generates the route tree in `src/generated/routeTree.gen.ts`.
- **Conventions:**
  - Use `__root.tsx` for the layout shell.
  - **Lazy Loading:** Heavy route components (page content) must use the `.lazy.tsx` suffix pattern (e.g., `index.lazy.tsx`) to ensure automatic code splitting by the router.
  - Use `beforeLoad` in route files for guards (e.g., AuthGuard).

### Data Fetching & GraphQL

- **Workflow:**
  1. **Create Operation:** Define queries or mutations in a new file within `src/graphql/**/*.graphql` (e.g., `src/graphql/user/GetKey.graphql`).
  2. **Generate Types:** Run `npm run gen` to update the generated hooks.
  3. **Implementation:** Use the generated hooks (e.g., `useGetKeyQuery`) in your components.
- **Client:** The app uses **URQL** configured in `src/routes/__root.tsx`.
- **Type Safety:** Never manually type GraphQL responses; rely exclusively on the Codegen output.

### Internationalization (I18n)

- **Tooling:** Paraglide JS.
- **Workflow:**
  1. Add/Edit keys in `messages/{locale}.json` (e.g., `messages/en.json`).
  2. Paraglide automatically compiles these into `src/generated/paraglide/messages.js`.
  3. Import `m` from `@generated/paraglide/messages` to use strings (e.g., `m.hello_world()`).

### Git Workflow

- **Pre-commit Hooks:** **Lefthook** ensures `npm run check` standards are met.
- **Branching:** Follow standard feature-branch workflows.

## Domain Context

- **Authentication:**
  - Protocol: **OIDC / OAuth 2.0** with PKCE.
  - Implementation: `react-oidc-context` (encapsulated in `src/shared/auth`).
  - Access Control: Routes are protected via TanStack Router `beforeLoad` checks or the `AuthGuard`.
  - Token Management: Automatic silent renewal is enabled.
- **Error Handling:**
  - Global `ErrorFallback` UI handles runtime errors.
  - Specialized handling for 401 (Auth), 403 (Access), and Network errors.

## Important Constraints

- **Environment Variables:**
  - Access variables via `import.meta.env.VITE_VAR_NAME` (Vite standard), **not** `process.env`.
  - Variables must be defined in `.env` and matched in `.env.example` (checked at build time).
- **Build Consistency:** The build process uses a custom Vite plugin (`vite-dotenv-checker`) to ensure `.env` and `.env.example` are consistent. Missing variables will fail the build.
- **CSS Architecture:**
  - Prefer **Tailwind CSS v4** utility classes for layout and spacing.
  - Use **DaisyUI** for base component styles.
  - Use **CSS/SCSS Modules** (`*.module.scss`) only for complex, isolated component styling that Tailwind cannot easily handle.
- **No Circular Dependencies:** FSD strictness makes circular dependencies fatal. Always move shared logic down to a lower layer (e.g., `shared`).

## External Dependencies

- **Backend API:** A GraphQL API endpoint (URL defined in `VITE_GRAPHQL_API_URL`).
- **Identity Provider:** Any OIDC-compliant provider (Logto, Keycloak, Auth0).
- **Docker:** Production builds are served via **Caddy** within a Docker container.
