![](./.github/logo.png)

[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
![Vite](https://img.shields.io/badge/Vite-7.x-blue?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![GitHub Stars](https://img.shields.io/github/stars/uxname/litefront)
![License](https://img.shields.io/badge/License-MIT-brightgreen)

A modern, scalable, and developer-friendly frontend boilerplate powered by **Vite, React 19, GraphQL, and TypeScript**. Built with the **[Feature-Sliced Design](https://feature-sliced.design)** methodology for maximum maintainability.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Perfect Pairing with LiteEnd](#perfect-pairing-with-liteend)
- [Get Started](#get-started)
- [Types Generation](#types-generation)
- [License](#license)
- [Contributing](#contributing)

## Overview

LiteFront is a lightweight and performant frontend boilerplate designed for building fast, efficient, and well-structured web applications. It integrates a modern toolchain to provide an exceptional developer experience (DX) right out of the box.

- **🚀 Performance**: Fast development server and optimized builds thanks to **Vite**.
- **🧩 Scalability**: **Feature-Sliced Design** ensures your project stays organized and maintainable as it grows.
- **✅ Reliability**: Type-safety with **TypeScript**, code quality enforced by **Biome**, and pre-commit checks with **Lefthook**.
- **🧪 Test-Ready**: Unit testing with **Vitest** and End-to-End testing with **Playwright** are pre-configured.

## Tech Stack

| Category              | Technology                                                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Core**              | [Vite](https://vitejs.dev), [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org)       |
| **Routing**           | [TanStack Router](https://tanstack.com/router) (Type-safe)                                                  |
| **Data Fetching**     | [GraphQL](https://graphql.org) with [URQL Client](https://formidable.com/open-source/urql)                    |
| **State Management**  | [Zustand](https://github.com/pmndrs/zustand)                                                                |
| **Styling**           | [Tailwind CSS](https://tailwindcss.com) + [SCSS Modules](https://github.com/css-modules/css-modules)          |
| **UI Components**     | [Ant Design](https://ant.design)                                                                            |
| **Forms**             | [React Hook Form](https://react-hook-form.com) with [Zod](https://zod.dev) for validation      |
| **Internationalization** | [i18next](https://www.i18next.com)                                                                        |
| **Code Generation**   | [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)                                             |
| **Linting/Formatting**| [Biome](https://biomejs.dev) (All-in-one tool)                                                              |
| **Git Hooks**         | [Lefthook](https://github.com/evilmartians/lefthook)                                                        |
| **Testing**           | [Vitest](https://vitest.dev) (Unit), [Playwright](https://playwright.dev) (E2E)                               |
| **Component Dev**     | [Ladle](https://ladle.dev) (Storybook alternative)                                                          |
| **Deployment**        | [Docker](https://www.docker.com) with [Caddy Server](https://caddyserver.com)                                 |

## Architecture

This boilerplate uses **[Feature-Sliced Design (FSD)](https://feature-sliced.design)**, a methodology for structuring frontend applications. It helps to keep the codebase clean, scalable, and easy to navigate by organizing code into layers (`shared`, `entities`, `features`, `widgets`, `pages`, `app`).

## Key Features

- **Automated Type Generation**: `npm run gen` command to generate TypeScript types from your GraphQL schema and operations.
- **Environment Consistency**: Custom Vite plugin ensures `.env` and `.env.example` are always in sync during development.
- **Optimized for Production**: Multi-stage Dockerfile for small and secure production images, served by the high-performance Caddy web server.
- **Image Optimization**: Automatic image optimization at build time with `vite-plugin-image-optimizer`.
- **Pre-configured Tooling**: Linters, formatters, and git-hooks are set up and ready to go.

## Perfect Pairing with [LiteEnd](https://github.com/uxname/liteend)

This LiteFront boilerplate is best suited for use with [LiteEnd](https://github.com/uxname/liteend), as they are
designed to work seamlessly together. LiteEnd provides a backend that integrates smoothly with LiteFront via GraphQL and
TypeScript, enabling a cohesive full-stack development experience.

## Get Started

### One-Liner

```bash
npx degit uxname/litefront my-app && cd my-app && git init && git add . && git commit -m "Initial commit" && npm install && cp .env.example .env && npm run gen && npm run start:dev
```

### Step-by-Step

1.  **Clone the repository**
    ```bash
    npx degit uxname/litefront my-app
    cd my-app
    ```
2.  **Initialize Git**
    ```bash
    git init && git add . && git commit -m "Initial commit"
    ```
3.  **Install dependencies**
    ```bash
    npm install
    ```
4.  **Setup environment variables**
    ```bash
    cp .env.example .env
    # Edit .env with your configuration
    ```
5.  **Generate GraphQL types**
    ```bash
    npm run gen
    ```
6.  **Run the development server**
    ```bash
    npm run start:dev
    ```
Your app should now be running on the port specified in your `.env` file (default: `http://localhost:3000`).

## Types Generation

Run `npm run gen` after every change to the GraphQL API Schema or after modifying any `*.graphql` files in the `src/graphql` directory. This command is crucial for maintaining type safety between your frontend and backend.

## License

LiteFront is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request with your changes.
