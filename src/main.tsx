import React from "react";
import ReactDOM from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import "./index.scss";

import { routeTree } from "./generated/routeTree.gen.ts";

const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <ApolloProvider client={makeApolloClient()}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>,
);

function makeApolloClient(): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_API_URL,
    cache: new InMemoryCache(),
  });
}
