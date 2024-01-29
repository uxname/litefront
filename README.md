![](./.github/logo.png)

[Vite](https://vitejs.dev) (SSR via [Vike](https://vike.dev)) + GraphQL + Typescript frontend boilerplate.

# Get started
- `npx degit uxname/litefront my-app`
- `npm install`
-  `cp .env_example .env`
- Edit `.env`
- `npm run gen`
- `npm run dev`

**Production build:**
- `npm run build`
- `npm start:prod`

## Types generation
Run `npm run gen` after every GraphQL API Schema changed or after `./graphql/*.graphql` files are modified

# Other info
Build info page available at `/_debug`: http://localhost:3000/_debug
