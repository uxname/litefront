import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { cacheExchange, Client, fetchExchange, Provider } from "urql";

export const Route = createRootRoute({
  component: () => {
    const isDevelopment = import.meta.env.MODE === "development";
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const accessToken = useAuthStore((state) => state.accessToken);

    return (
      <>
        <Provider value={makeGraphQLClient(accessToken)}>
          <Outlet />
          {isDevelopment && <TanStackRouterDevtools />}
        </Provider>
      </>
    );
  },
});

function makeGraphQLClient(accessToken: string | undefined): Client {
  return new Client({
    url: import.meta.env.VITE_GRAPHQL_API_URL,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      ...(accessToken && {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    },
    requestPolicy: "cache-and-network",
  });
}
