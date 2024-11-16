import { useMemo } from "react";
import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { cacheExchange, Client, fetchExchange, Provider } from "urql";

export const Route = createRootRoute({
  component: () => {
    const isDevelopment = import.meta.env.MODE === "development";
    // eslint-disable-next-line react-hooks/rules-of-hooks,sonarjs/rules-of-hooks
    const accessToken = useAuthStore((state) => state.accessToken);

    // eslint-disable-next-line sonarjs/rules-of-hooks,react-hooks/rules-of-hooks
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
  },
});

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
