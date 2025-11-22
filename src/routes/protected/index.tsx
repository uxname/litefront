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
  component: ProtectedPage,
});
