import { m } from "@generated/paraglide/messages";
import { captureMessage } from "@shared/lib/sentry";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { Button } from "@shared/ui/button";
import { PageLoader } from "@shared/ui/page-loader";
import { AlertCircle, LogIn } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { useAuth } from "../api/oidc-client";

/** How long the code exchange may take before the user is offered a way out. */
export const CALLBACK_TIMEOUT_MS = 15_000;

/**
 * The screen the OIDC provider redirects back to. The library finishes the code
 * exchange on its own and the app navigates away when it succeeds; this only
 * records that the redirect landed and holds the user on a loader meanwhile.
 * If the exchange fails — or never finishes — the user gets the reason and a
 * way to start over instead of a spinner forever.
 */
export const CallbackHandler: FC = () => {
  const auth = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    captureMessage("Auth callback received", { level: "info" });
    const id = setTimeout(() => setTimedOut(true), CALLBACK_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, []);

  if (!auth.error && !timedOut) {
    return <PageLoader label={m.auth_verifying()} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">{m.auth_callback_error_title()}</h1>
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{m.auth_callback_error_desc()}</AlertTitle>
          {auth.error && (
            <AlertDescription>{auth.error.message}</AlertDescription>
          )}
        </Alert>
        <Button onClick={() => void auth.signinRedirect()}>
          <LogIn />
          {m.auth_sign_in()}
        </Button>
      </div>
    </main>
  );
};
