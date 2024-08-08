import { createLazyFileRoute } from "@tanstack/react-router";

import { AboutPage } from "../../pages/about";

export const Route = createLazyFileRoute("/about/")({
  component: AboutPage,
});
