import { AuthContextProps, useAuth } from "@features/auth";
import { createGraphQLClient, GraphQLProvider } from "@shared/api";
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
    () => createGraphQLClient(auth.user?.id_token),
    [auth.user?.id_token],
  );

  return (
    <GraphQLProvider value={graphqlClient}>
      <HeadContent />
      <Outlet />
      <Toaster closeButton />
      <Scripts />
      {isDevelopment && <TanStackRouterDevtools />}
    </GraphQLProvider>
  );
};

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
