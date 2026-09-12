import { captureMessage } from "@shared/lib/sentry";
import { type FC, useEffect } from "react";

/**
 * The screen the OIDC provider redirects back to. The library finishes the code
 * exchange on its own; this only records that the redirect landed and holds the
 * user on a spinner until the auth context flips.
 */
export const CallbackHandler: FC = () => {
  useEffect(() => {
    captureMessage("Auth callback received", { level: "info" });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    </div>
  );
};
