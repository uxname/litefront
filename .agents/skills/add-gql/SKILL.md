---
name: add-gql
description: Use this skill when the user asks to add a GraphQL query, mutation, or subscription, fetch data from the API, or work with GraphQL operations. Trigger phrases: "add graphql query", "add mutation", "add subscription", "graphql codegen".
version: 1.0.0
---

# Add GraphQL Operation

Adds a new GraphQL query or mutation and regenerates typed hooks.

## How It Works

1. Write `.graphql` file in `src/graphql/queries/`
2. Run `npm run gen` — generates typed hooks in `src/generated/graphql.tsx`
3. Use generated hooks in components

**Never edit `src/generated/graphql.tsx` manually — it is always overwritten by codegen.**

## Step 1: Write the operation file

```graphql
# src/graphql/queries/user.graphql

query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}

mutation UpdateUser($id: ID!, $name: String!) {
  updateUser(id: $id, name: $name) {
    id
    name
  }
}
```

Conventions:
- One file per domain/entity (e.g., `user.graphql`, `products.graphql`)
- Use PascalCase operation names: `GetUser`, `UpdateUser`
- Files live in `src/graphql/queries/`

## Step 2: Run codegen

```bash
npm run gen
```

Requires `VITE_GRAPHQL_API_URL` to be set in `.env`. The codegen fetches the schema from the API.

## Step 3: Use generated hooks (via FSD api/ layer)

**Do not import from `@generated/graphql` directly in UI components.** Wrap hooks in the `api/` folder of the relevant FSD slice:

```ts
// src/entities/user/api/queries.ts
import { useGetUserQuery, useUpdateUserMutation } from "@generated/graphql";

export { useGetUserQuery as useUser, useUpdateUserMutation as useUpdateUser };
```

Then use the slice's public API from `index.ts`:

```ts
// src/entities/user/index.ts
export { useUser, useUpdateUser } from "./api/queries";
```

And consume in a component:

```tsx
// src/features/user-profile/ui/UserProfile.tsx
import { useUser } from "@entities/user";

function UserProfile({ userId }: { userId: string }) {
  const [{ data, fetching, error }] = useUser({ variables: { id: userId } });

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div>{data?.user?.name}</div>;
}
```

This keeps the `@generated/graphql` import boundary inside the entity's `api/` folder.

**Global operations:** If the query/mutation does not belong to a specific FSD entity or feature, place the wrapped hook in `src/shared/api/queries.ts` and export it from `src/shared/api/index.ts`.

## URQL Client

The URQL client is configured in `src/shared/api/`. It automatically:
- Adds the Bearer token from OIDC to requests
- Handles errors via Sentry integration

No manual client setup is needed per-operation.

## Checklist

- [ ] `.graphql` file created in `src/graphql/queries/`
- [ ] `npm run gen` executed successfully
- [ ] Generated hooks imported from `@generated/graphql` (not from the file directly)
- [ ] Never editing `src/generated/graphql.tsx` manually
- [ ] Operation placed in the correct FSD layer (`api/` subfolder of the relevant slice)
