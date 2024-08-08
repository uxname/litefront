import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { cacheExchange, Client, fetchExchange, Provider } from "urql";

export const Route = createRootRoute({
  component: () => {
    const isDevelopment = import.meta.env.MODE === "development";

    return (
      <>
        <Provider value={makeGraphQLClient()}>
          <Outlet />
          {isDevelopment && <TanStackRouterDevtools />}
        </Provider>
      </>
    );
  },
});

function makeGraphQLClient(): Client {
  return new Client({
    url: import.meta.env.VITE_GRAPHQL_API_URL,
    exchanges: [cacheExchange, fetchExchange],
    requestPolicy: "cache-and-network",
  });
}
