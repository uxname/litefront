import { AboutPage } from "@pages/about";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/about/")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AboutPage,
});
