import { useRouter, useRouterState } from "@tanstack/react-router";
import {
  CircleAlert,
  LockKeyhole,
  LucideIcon,
  ServerCrash,
  ShieldBan,
  WifiOff,
} from "lucide-react";
import { FC, useMemo, useState } from "react";
import * as m from "../../../generated/paraglide/messages";

enum ErrorCategory {
  AUTH = "AUTH",
  ACCESS = "ACCESS",
  NETWORK = "NETWORK",
  SERVER = "SERVER",
  UNKNOWN = "UNKNOWN",
}

const ICON_MAP: Record<ErrorCategory, LucideIcon> = {
  [ErrorCategory.AUTH]: LockKeyhole,
  [ErrorCategory.ACCESS]: ShieldBan,
  [ErrorCategory.NETWORK]: WifiOff,
  [ErrorCategory.SERVER]: ServerCrash,
  [ErrorCategory.UNKNOWN]: CircleAlert,
};

const STYLES: Record<ErrorCategory, { bg: string; text: string }> = {
  [ErrorCategory.AUTH]: { bg: "bg-warning", text: "text-warning" },
  [ErrorCategory.ACCESS]: { bg: "bg-error", text: "text-error" },
  [ErrorCategory.NETWORK]: { bg: "bg-info", text: "text-info" },
  [ErrorCategory.SERVER]: { bg: "bg-error", text: "text-error" },
  [ErrorCategory.UNKNOWN]: { bg: "bg-base-300", text: "text-base-content" },
};

const ERROR_REGEX = /\b(401|403|404|500|502|503)\b/;

const getStatusCode = (message: string): number | null => {
  const match = message.match(ERROR_REGEX);
  return match ? Number(match[1]) : null;
};

const detectErrorCategory = (error: Error): ErrorCategory => {
  const message = error.message.toLowerCase();
  const statusCode = getStatusCode(message);

  const isAuthError =
    message.includes("unauthorized") ||
    message.includes("authenticated") ||
    message.includes("jwt");

  if (isAuthError || statusCode === 401) return ErrorCategory.AUTH;
  if (statusCode === 403) return ErrorCategory.ACCESS;

  const isNetworkError =
    message.includes("network") ||
    message.includes("failed to fetch") ||
    message.includes("load failed");

  if (isNetworkError || statusCode === 503) return ErrorCategory.NETWORK;
  if (statusCode && statusCode >= 500) return ErrorCategory.SERVER;

  return ErrorCategory.UNKNOWN;
};

const normalizeError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  const message =
    typeof error === "string"
      ? error
      : JSON.stringify(error) || "Unknown error";
  return new Error(message);
};

interface ErrorFallbackProps {
  error: unknown;
  reset?: () => void;
}

export const ErrorFallback: FC<ErrorFallbackProps> = ({ error, reset }) => {
  const router = useRouter();
  const routerState = useRouterState();
  const [showDetails, setShowDetails] = useState(false);
  const isDev = import.meta.env.DEV;

  const normalizedError = useMemo(() => normalizeError(error), [error]);
  const category = useMemo(
    () => detectErrorCategory(normalizedError),
    [normalizedError],
  );

  const { title, description } = useMemo(() => {
    switch (category) {
      case ErrorCategory.AUTH:
        return {
          title: m.error_auth_required(),
          description: m.error_auth_desc(),
        };
      case ErrorCategory.ACCESS:
        return {
          title: m.error_access_denied(),
          description: m.error_access_desc(),
        };
      case ErrorCategory.NETWORK:
        return {
          title: m.error_network(),
          description: m.error_network_desc(),
        };
      case ErrorCategory.SERVER:
        return { title: m.error_server(), description: m.error_server_desc() };
      default:
        return {
          title: m.error_unexpected(),
          description: m.error_unexpected_desc(),
        };
    }
  }, [category]);

  const styles = STYLES[category];
  const IconComponent = ICON_MAP[category];

  const handleRetry = () => (reset ? reset() : router.invalidate());
  const handleReload = () => window.location.reload();

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[60vh] w-full bg-base-100">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-200">
        <div className="card-body items-center text-center">
          {/* Icon Container */}
          <div
            className={`p-4 rounded-full bg-opacity-10 mb-2 ${styles.bg} ${styles.text}`}
          >
            <IconComponent className="h-12 w-12" aria-hidden="true" />
          </div>

          {/* Title & Description */}
          <h2 className="card-title text-2xl font-bold mb-1">{title}</h2>
          <p className="text-base-content/70">{description}</p>

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
