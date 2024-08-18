import React from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "@generated/routeTree.gen.ts";
import { NotFoundPage } from "@pages/404";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import "./index.scss";
import "./app/i18next.ts";

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
