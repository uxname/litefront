import { AboutPage } from "@pages/about";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about/")({
  component: AboutPage,
});
