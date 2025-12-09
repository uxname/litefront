import { useRouter, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Copy,
  LockKeyhole,
  LucideIcon,
  RefreshCcw,
  RotateCcw,
  ServerCrash,
  ShieldBan,
  Wifi,
} from "lucide-react";
import { FC, useCallback, useMemo, useState } from "react";
import * as m from "../../../generated/paraglide/messages";

// --- Configuration Strategy ---

enum ErrorCategory {
  AUTH = "AUTH",
  ACCESS = "ACCESS",
  NETWORK = "NETWORK",
  SERVER = "SERVER",
  UNKNOWN = "UNKNOWN",
}

interface ErrorConfig {
  icon: LucideIcon;
  style: { wrapper: string; icon: string };
  getTitle: () => string;
  getDesc: () => string;
  animate?: boolean;
}

const ERROR_CONFIG: Record<ErrorCategory, ErrorConfig> = {
  [ErrorCategory.AUTH]: {
    icon: LockKeyhole,
    style: { wrapper: "bg-warning/10", icon: "text-warning" },
    getTitle: () => m.error_auth_required(),
    getDesc: () => m.error_auth_desc(),
  },
  [ErrorCategory.ACCESS]: {
    icon: ShieldBan,
    style: { wrapper: "bg-error/10", icon: "text-error" },
    getTitle: () => m.error_access_denied(),
    getDesc: () => m.error_access_desc(),
  },
  [ErrorCategory.NETWORK]: {
    icon: Wifi,
    style: { wrapper: "bg-info/10", icon: "text-info" },
    getTitle: () => m.error_network(),
    getDesc: () => m.error_network_desc(),
    animate: true,
  },
  [ErrorCategory.SERVER]: {
    icon: ServerCrash,
    style: { wrapper: "bg-error/10", icon: "text-error" },
    getTitle: () => m.error_server(),
    getDesc: () => m.error_server_desc(),
  },
  [ErrorCategory.UNKNOWN]: {
    icon: CircleAlert,
    style: { wrapper: "bg-base-content/5", icon: "text-base-content/60" },
    getTitle: () => m.error_unexpected(),
    getDesc: () => m.error_unexpected_desc(),
  },
};

// --- Helpers ---

const ERROR_REGEX = /\b(401|403|404|500|502|503)\b/;

const detectErrorCategory = (error: Error): ErrorCategory => {
  const message = error.message.toLowerCase();
  const match = message.match(ERROR_REGEX);
  const statusCode = match ? Number(match[1]) : null;

  const rules = [
    {
      match: () =>
        message.includes("unauthorized") ||
        message.includes("jwt") ||
        statusCode === 401,
      category: ErrorCategory.AUTH,
    },
    {
      match: () => message.includes("forbidden") || statusCode === 403,
      category: ErrorCategory.ACCESS,
    },
    {
      match: () =>
        message.includes("network") ||
        message.includes("fetch") ||
        statusCode === 503,
      category: ErrorCategory.NETWORK,
    },
    {
      match: () => statusCode && statusCode >= 500,
      category: ErrorCategory.SERVER,
    },
  ];

  return rules.find((r) => r.match())?.category ?? ErrorCategory.UNKNOWN;
};

const normalizeError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  const message = typeof error === "string" ? error : JSON.stringify(error);
  return new Error(message || "Unknown error occurred");
};

// --- Component ---

interface ErrorFallbackProps {
  error: unknown;
  reset?: () => void;
}

export const ErrorFallback: FC<ErrorFallbackProps> = ({ error, reset }) => {
  const router = useRouter();
  const routerState = useRouterState();
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const isDev = import.meta.env.DEV;

  const normalizedError = useMemo(() => normalizeError(error), [error]);
  const category = useMemo(
    () => detectErrorCategory(normalizedError),
    [normalizedError],
  );
  const config = ERROR_CONFIG[category];

  const handleRetry = useCallback(() => {
    reset ? reset() : router.invalidate();
  }, [reset, router]);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  const handleCopyStack = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        `${normalizedError.message}\n\n${normalizedError.stack}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  }, [normalizedError]);

  const IconComponent = config.icon;

  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center bg-base-100 p-6 text-base-content">
      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-300">
        {/* Main Content - Unified Style with 404 */}
        <div className="text-center">
          {/* Visual Icon */}
          <div
            className={`mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl ${config.style.wrapper} shadow-sm ring-1 ring-base-content/5`}
          >
            <IconComponent
              className={`h-10 w-10 ${config.style.icon} ${config.animate ? "animate-pulse" : ""}`}
              strokeWidth={1.5}
            />
          </div>

          {/* Typography */}
          <p className="text-sm font-bold leading-7 text-base-content/40 uppercase tracking-widest">
            {m.error_generic_title?.() ?? "System Error"}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
            {config.getTitle()}
          </h2>
          <p className="mt-4 text-lg leading-7 text-base-content/60">
            {config.getDesc()}
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleRetry}
              className="btn btn-primary w-full sm:w-auto min-w-[140px] gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <RotateCcw className="h-4 w-4" />
              {m.action_retry()}
            </button>
            <button
              onClick={handleReload}
              className="btn btn-ghost w-full sm:w-auto min-w-[140px] gap-2 border border-transparent hover:border-base-content/10 hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-base-content/20"
            >
              <RefreshCcw className="h-4 w-4" />
              {m.action_reload()}
            </button>
          </div>
        </div>

        {/* Developer Section (Collapsible & Soft) */}
        {isDev && (
          <div className="mt-12 rounded-xl border border-base-200 bg-base-200/40 overflow-hidden">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex w-full items-center justify-between px-6 py-3 text-xs font-medium uppercase tracking-wider text-base-content/50 hover:bg-base-200 hover:text-base-content transition-colors focus:outline-none"
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3" />
                {m.dev_details()}
              </span>
              {showDetails ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>

            {showDetails && (
              <div className="bg-base-200/60 px-6 py-4 text-left border-t border-base-200 animate-in slide-in-from-top-2 duration-200">
                <div className="mb-3 flex items-center gap-2 text-xs text-base-content/60 font-mono">
                  <ArrowRight className="h-3 w-3" />
                  Route:{" "}
                  <span className="text-base-content/80">
                    {routerState.location.pathname}
                  </span>
                </div>

                <div className="relative rounded-lg border border-base-content/5 bg-base-100 p-4 font-mono text-[11px] leading-relaxed text-base-content/80 shadow-sm">
                  <button
                    onClick={handleCopyStack}
                    className="absolute right-2 top-2 rounded bg-base-200 p-1.5 text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors tooltip tooltip-left"
                    data-tip={copied ? m.copied?.() : m.copy_stack?.()}
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                  <div className="max-h-48 overflow-auto whitespace-pre-wrap break-words pr-8 custom-scrollbar">
                    <span className="block text-error font-bold mb-2">
                      {normalizedError.name}: {normalizedError.message}
                    </span>
                    {normalizedError.stack}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
