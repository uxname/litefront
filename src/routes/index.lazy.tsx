import { createLazyFileRoute } from "@tanstack/react-router";

import { IndexPage } from "../pages/index";

export const Route = createLazyFileRoute("/")({
  component: IndexPage,
});
