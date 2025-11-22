import { createFileRoute } from "@tanstack/react-router";
import { FC } from "react";

const CallbackComponent: FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/callback")({
  component: CallbackComponent,
});
