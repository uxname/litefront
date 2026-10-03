import { m } from "@generated/paraglide/messages";
import { HomePage } from "@pages/home";
import { createFileRoute } from "@tanstack/react-router";

// Public, server-rendered route (inherits defaultSsr: true). With TanStack
// Start's autoCodeSplitting the component is split automatically, so the route
// lives in a single file — no separate .lazy module.
export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: m.meta_home_title() },
      { name: "description", content: m.meta_home_description() },
      { property: "og:title", content: m.meta_home_title() },
      { property: "og:description", content: m.meta_home_description() },
    ],
  }),
});
