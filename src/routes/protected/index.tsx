import { ProtectedPage } from "@pages/protected";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/protected/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
  head: () => ({
    meta: [
      {
        title: "Dashboard | LiteFront",
      },
      {
        name: "description",
        content:
          "Secure user dashboard area. View your session claims and manage identity.",
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: ProtectedPage,
});
