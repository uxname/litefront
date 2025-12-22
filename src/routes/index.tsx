import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
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
