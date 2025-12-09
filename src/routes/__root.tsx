import { AuthContextProps, useAuth } from "@shared/auth";
import { ErrorFallback } from "@shared/ui/ErrorFallback";
import { Toaster } from "@shared/ui/Toaster";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import React, { useMemo } from "react";
import { Client, cacheExchange, fetchExchange, Provider } from "urql";

export interface MyRouterContext {
  auth: AuthContextProps;
}

const TanStackRouterDevtools = import.meta.env.DEV
  ? React.lazy(() =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    )
  : () => null;

const RootComponent: React.FC = () => {
  const isDevelopment = import.meta.env.MODE === "development";
  const auth = useAuth();

  const graphqlClient = useMemo(
    () => makeGraphQLClient(auth.user?.access_token),
    [auth.user?.access_token],
  );

  return (
    <Provider value={graphqlClient}>
      <Outlet />
      <Toaster closeButton />
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

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  errorComponent: ({ error, reset }) => (
    <div className="p-4 flex justify-center w-full">
      <ErrorFallback error={error} reset={reset} />
    </div>
  ),
});
