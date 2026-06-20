import { HomePage } from "@pages/home";
import { createFileRoute } from "@tanstack/react-router";

// Public, server-rendered route (inherits defaultSsr: true). With TanStack
// Start's autoCodeSplitting the component is split automatically, so the route
// lives in a single file — no separate .lazy module.
export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      {
        title: "Home | LiteFront",
      },
      {
        name: "description",
        content:
          "Explore the capabilities of LiteFront: GraphQL data fetching, Feature-Sliced Design, and strict TypeScript integration.",
      },
      {
        property: "og:title",
        content: "Home | LiteFront",
      },
      {
        property: "og:description",
        content:
          "Explore the capabilities of LiteFront: GraphQL data fetching, Feature-Sliced Design, and strict TypeScript integration.",
      },
    ],
  }),
});
