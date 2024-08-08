import { createLazyFileRoute } from "@tanstack/react-router";

import { RegisterPage } from "../../pages/register";

export const Route = createLazyFileRoute("/register/")({
  component: () => <RegisterPage />,
});
