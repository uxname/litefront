import { AuthContextProps, useAuth } from "@shared/auth";
import { ErrorFallback } from "@shared/ui/ErrorFallback";
import { Toaster } from "@shared/ui/Toaster";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
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
      <HeadContent />
      <Outlet />
      <Toaster closeButton />
      <Scripts />
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
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    const routerState = useRouterState();

    return (
      <div className="p-4 flex justify-center w-full">
        <ErrorFallback
          error={error}
          reset={reset}
          pathname={routerState.location.pathname}
          onRetry={() => {
            reset();
            router.invalidate();
          }}
        />
      </div>
    );
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "LiteFront",
      },
      {
        name: "description",
        content: "Modern Enterprise Boilerplate with React 19, GraphQL and FSD",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:site_name",
        content: "LiteFront App",
      },
    ],
  }),
});
