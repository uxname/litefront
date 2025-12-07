import { useRouter, useRouterState } from "@tanstack/react-router";
import { FC, useMemo, useState } from "react";
import * as m from "../../../generated/paraglide/messages";

interface ErrorFallbackProps {
  error: unknown;
  reset?: () => void;
}

export const ErrorFallback: FC<ErrorFallbackProps> = ({ error, reset }) => {
  const router = useRouter();
  const routerState = useRouterState();
  const [showDetails, setShowDetails] = useState(false);
  const isDev = import.meta.env.DEV;

  const normalizedError = useMemo(() => {
    if (error instanceof Error) return error;
    return new Error(
      typeof error === "string"
        ? error
        : JSON.stringify(error) || "Unknown error",
    );
  }, [error]);

  const errorInfo = useMemo(
    () => getErrorContent(normalizedError),
    [normalizedError],
  );

  const handleRetry = () => {
    if (reset) {
      reset();
    } else {
      router.invalidate();
    }
  };

  const handleReload = () => window.location.reload();

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[60vh] w-full bg-base-100">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-200">
        <div className="card-body items-center text-center">
          {/* Icon */}
          <div
            className={`p-4 rounded-full bg-opacity-10 mb-2 ${errorInfo.color}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-12 w-12 ${errorInfo.textColor}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
              aria-labelledby="error-icon-title"
            >
              <title id="error-icon-title">{errorInfo.title}</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={errorInfo.icon}
              />
            </svg>
          </div>
          {/* Title & Description */}
          <h2 className="card-title text-2xl font-bold mb-1">
            {errorInfo.title}
          </h2>
          <p className="text-base-content/70">{errorInfo.description}</p>

          {/* Dev Route Info */}
          {isDev && (
            <div className="badge badge-ghost badge-sm mt-4 font-mono">
              Route: {routerState.location.pathname}
            </div>
          )}

          {/* Actions */}
          <div className="card-actions justify-center mt-8 w-full gap-3">
            <button onClick={handleRetry} className="btn btn-primary px-8">
              {m.action_retry()}
            </button>
            <button onClick={handleReload} className="btn btn-ghost">
              {m.action_reload()}
            </button>
          </div>
        </div>
      </div>

      {/* Developer Details (Stack Trace) */}
      {isDev && (
        <div className="w-full max-w-lg mt-6">
          <div className="collapse collapse-arrow border border-base-300 bg-base-200 rounded-box">
            <input
              type="checkbox"
              checked={showDetails}
              onChange={() => setShowDetails(!showDetails)}
            />
            <div className="collapse-title text-sm font-medium opacity-70">
              {m.dev_details()}
            </div>
            <div className="collapse-content">
              <div className="mockup-code bg-[#1a1a1a] text-[10px] sm:text-xs shadow-lg max-h-96 overflow-auto">
                <pre className="px-4 py-2">
                  <code className="text-error">
                    {normalizedError.stack || normalizedError.message}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Helpers ---

interface ErrorContent {
  title: string;
  description: string;
  icon: string;
  color: string;
  textColor: string;
}

function getErrorContent(error: Error): ErrorContent {
  const message = error.message.toLowerCase();

  // Simple heuristic for status codes
  const statusCodeMatch = message.match(/\b(401|403|404|500|502|503)\b/);
  const statusCode = statusCodeMatch ? Number(statusCodeMatch[1]) : null;

  const isNetworkError =
    message.includes("network") ||
    message.includes("failed to fetch") ||
    message.includes("load failed");

  const isAuthError =
    message.includes("unauthorized") ||
    message.includes("authenticated") ||
    message.includes("jwt");

  // Auth Error (401)
  if (isAuthError || statusCode === 401) {
    return {
      title: m.error_auth_required(),
      description: m.error_auth_desc(),
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      color: "bg-warning",
      textColor: "text-warning",
    };
  }

  // Access Denied (403)
  if (statusCode === 403) {
    return {
      title: m.error_access_denied(),
      description: m.error_access_desc(),
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      color: "bg-error",
      textColor: "text-error",
    };
  }

  // Network Error
  if (isNetworkError || statusCode === 503) {
    return {
      title: m.error_network(),
      description: m.error_network_desc(),
      icon: "M13 10V3L4 14h7v7l9-11h-7z", // Lightning bolt
      color: "bg-info",
      textColor: "text-info",
    };
  }

  // Server Error (500+)
  if (statusCode && statusCode >= 500) {
    return {
      title: m.error_server(),
      description: m.error_server_desc(),
      icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01",
      color: "bg-error",
      textColor: "text-error",
    };
  }

  // Default / Unexpected
  return {
    title: m.error_unexpected(),
    description: m.error_unexpected_desc(),
    icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "bg-base-300",
    textColor: "text-base-content",
  };
}
