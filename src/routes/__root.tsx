import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import React, { useMemo } from "react";
import { Client, cacheExchange, fetchExchange, Provider } from "urql";

const RootComponent: React.FC = () => {
  const isDevelopment = import.meta.env.MODE === "development";
  const accessToken = useAuthStore((state) => state.accessToken);

  const graphqlClient = useMemo(
    () => makeGraphQLClient(accessToken),
    [accessToken],
  );

  return (
    <Provider value={graphqlClient}>
      <Outlet />
      {isDevelopment && <TanStackRouterDevtools />}
    </Provider>
  );
};

function makeGraphQLClient(accessToken: string | undefined): Client {
  return new Client({
    url: import.meta.env.VITE_GRAPHQL_API_URL,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    },
    requestPolicy: "cache-and-network",
  });
}

export const Route = createRootRoute({
  component: RootComponent,
});
