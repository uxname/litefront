![](./.github/logo.png)

A [Vite](https://vitejs.dev) + [GraphQL](https://graphql.org) + Typescript frontend boilerplate
using [Feature-Sliced Design](https://feature-sliced.design) as project architecture methodology.

## Table of Contents

- [Overview](#overview)
  - [Why Choose LiteFront?](#why-choose-litefront)
  - [Use Cases](#use-cases)
- [Tech Stack](#tech-stack)
- [Perfect Pairing with LiteEnd](#perfect-pairing-with-liteend)
- [Get Started](#get-started)
  - [One-liner](#one-liner)
  - [Step by Step](#step-by-step)
  - [Production Build](#production-build)
- [Types Generation](#types-generation)
- [License](#license)
- [Contributing](#contributing)

## Overview

LiteFront is a lightweight and scalable frontend boilerplate designed for building fast, efficient, and maintainable web
applications. It integrates **Vite** for fast builds, **GraphQL** for data querying, and **TypeScript** for type safety,
making it ideal for modern web development.

### Why Choose LiteFront?

- **Scalability**: Feature-Sliced Design ensures your project stays organized as it grows.
- **Developer Efficiency**: Fast development cycles with Vite's hot module replacement.
- **Maintainability**: Built-in tooling for code quality and automated testing.

### Use Cases

LiteFront is perfect for building single-page applications (SPAs), dashboards, and complex web apps that require a
maintainable architecture.

- **[ESLint](https://eslint.org)**, **[Prettier](https://prettier.io)**, and **[Stylelint](https://stylelint.io)** are
  used to ensure code quality and maintainability.
- **SCSS modules** are used to style the application.
- **[Docker](https://www.docker.com)** is used to build and run the application in development and production.
- **[Caddy](https://caddyserver.com)** is used to serve the application in production.
- **[Vitest](https://vitest.dev)** is used to test the application in development and production.
- **[Playwright](https://playwright.dev)** is used to test the application in development and production.
- **[Husky](https://github.com/typicode/husky)** is used to automatically run linting and formatting on code changes.

## Perfect Pairing with [LiteEnd](https://github.com/uxname/liteend)

This LiteFront boilerplate is best suited for use with [LiteEnd](https://github.com/uxname/liteend), as they are
designed to work seamlessly together. LiteEnd provides a backend that integrates smoothly with LiteFront via GraphQL and
TypeScript, enabling a cohesive full-stack development experience.

# Get started

**One-liner:**

- `npx degit uxname/litefront my-app && cd my-app && git init && git add . && git commit -m "Initial commit" && npm install && cp .env.example .env && npm run gen && npm run start:dev`

**Step by step:**

- `npx degit uxname/litefront my-app`
- `cd my-app`
- `git init && git add . && git commit -m "Initial commit"`
- `npm install`
- `cp .env.example .env`
- Edit `.env`
- `npm run gen`
- `npm run start:dev`

**Production build:**

- `npm run build`
- `npm start:prod`

## Types generation

Run `npm run gen` after every GraphQL API Schema changed or after `./graphql/*.graphql` files are modified

## License

LiteFront is licensed under the MIT License.

## Contributing

Contributions are welcome! Please submit a pull request with your changes.

I hope this rewritten version meets your requirements! Let me know if you need any further changes.
