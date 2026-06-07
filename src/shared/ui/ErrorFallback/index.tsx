import { m } from "@generated/paraglide/messages";
import { env } from "@shared/config";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Copy,
  LockKeyhole,
  type LucideIcon,
  RefreshCcw,
  RotateCcw,
  ServerCrash,
  ShieldBan,
  Terminal,
  Wifi,
} from "lucide-react";
import { type FC, useCallback, useMemo, useRef, useState } from "react";

enum ErrorCategory {
  AUTH = "AUTH",
  ACCESS = "ACCESS",
  NETWORK = "NETWORK",
  SERVER = "SERVER",
  AUTH_CONFIG = "AUTH_CONFIG",
  UNKNOWN = "UNKNOWN",
}

interface ErrorConfig {
  icon: LucideIcon;
  style: { wrapper: string; icon: string; ring: string };
  getTitle: () => string;
  getDesc: () => string;
  animate?: boolean;
}

const ERROR_CONFIG: Record<ErrorCategory, ErrorConfig> = {
  [ErrorCategory.AUTH]: {
    icon: LockKeyhole,
    style: {
      wrapper: "bg-warning/10",
      icon: "text-warning",
      ring: "ring-warning",
    },
    getTitle: () => m.error_auth_required(),
    getDesc: () => m.error_auth_desc(),
  },
  [ErrorCategory.AUTH_CONFIG]: {
    icon: ShieldBan,
    style: {
      wrapper: "bg-error/10",
      icon: "text-error",
      ring: "ring-error",
    },
    getTitle: () => m.error_auth_config(),
    getDesc: () => m.error_auth_config_desc(),
  },
  [ErrorCategory.ACCESS]: {
    icon: ShieldBan,
    style: {
      wrapper: "bg-error/10",
      icon: "text-error",
      ring: "ring-error",
    },
    getTitle: () => m.error_access_denied(),
    getDesc: () => m.error_access_desc(),
  },
  [ErrorCategory.NETWORK]: {
    icon: Wifi,
    style: {
      wrapper: "bg-info/10",
      icon: "text-info",
      ring: "ring-info",
    },
    getTitle: () => m.error_network(),
    getDesc: () => m.error_network_desc(),
    animate: true,
  },
  [ErrorCategory.SERVER]: {
    icon: ServerCrash,
    style: {
      wrapper: "bg-error/10",
      icon: "text-error",
      ring: "ring-error",
    },
    getTitle: () => m.error_server(),
    getDesc: () => m.error_server_desc(),
  },
  [ErrorCategory.UNKNOWN]: {
    icon: CircleAlert,
    style: {
      wrapper: "bg-base-200",
      icon: "text-base-content/70",
      ring: "ring-base-300",
    },
    getTitle: () => m.error_unexpected(),
    getDesc: () => m.error_unexpected_desc(),
  },
};

const ERROR_REGEX = /\b(401|403|404|500|502|503)\b/;

const AUTH_CONFIG_KEYWORDS = [
  "oidc-config",
  "oidc configuration",
  "discovery",
  ".well-known/openid-configuration",
  "signin_response error",
  "silent renew",
  "authority",
  "client_id",
];

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
      match: () => AUTH_CONFIG_KEYWORDS.some((kw) => message.includes(kw)),
      category: ErrorCategory.AUTH_CONFIG,
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
  try {
    const message = typeof error === "string" ? error : JSON.stringify(error);
    return new Error(message || "Unknown error occurred");
  } catch {
    return new Error("Non-serializable error (circular or BigInt)");
  }
};

interface ErrorFallbackProps {
  error: unknown;
  reset?: () => void;
  pathname?: string;
  onRetry?: () => void;
}

export const ErrorFallback: FC<ErrorFallbackProps> = ({
  error,
  reset,
  pathname = window.location.pathname,
  onRetry,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const retryCountRef = useRef(0);

  const normalizedError = useMemo(() => normalizeError(error), [error]);
  const category = useMemo(
    () => detectErrorCategory(normalizedError),
    [normalizedError],
  );
  const config = ERROR_CONFIG[category];

  const handleRetry = useCallback(() => {
    const attempt = retryCountRef.current++;
    const delay = Math.min(1000 * 2 ** attempt, 30000);
    const doRetry = () => {
      if (onRetry) {
        onRetry();
      } else if (reset) {
        reset();
      } else {
        window.location.reload();
      }
    };
    if (delay <= 1000) {
      doRetry();
    } else {
      setTimeout(doRetry, delay);
    }
  }, [reset, onRetry]);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  const handleCopyStack = useCallback(async () => {
    try {
      const debugInfo = [
        `Error: ${normalizedError.name}: ${normalizedError.message}`,
        `Location: ${window.location.href}`,
        `Time: ${new Date().toISOString()}`,
        `Stack:`,
        normalizedError.stack,
      ].join("\n");

      await navigator.clipboard.writeText(debugInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (env.DEV) {
        console.error("Failed to copy", err);
      }
    }
  }, [normalizedError]);

  const IconComponent = config.icon;

  return (
    <div className="min-h-screen w-full bg-base-200 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-base-100 rounded-2xl border border-base-300 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 sm:p-10 text-center">
          <div
            className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${config.style.wrapper} ring-1 ${config.style.ring}`}
          >
            <IconComponent
              className={`h-10 w-10 ${config.style.icon} ${config.animate ? "animate-pulse" : ""}`}
              strokeWidth={1.5}
            />
          </div>

          <p className="text-xs font-bold leading-7 text-base-content/70 uppercase tracking-widest mb-1">
            {m.error_generic_title?.() ?? "System Issue"}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl mb-3">
            {config.getTitle()}
          </h2>
          <p className="text-base-content/70 text-lg leading-relaxed mb-8">
            {config.getDesc()}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-content font-medium hover:bg-primary/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <RotateCcw className="h-4 w-4" />
              {m.action_retry()}
            </button>
            <button
              onClick={handleReload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-base-100 text-base-content border border-base-300 font-medium hover:bg-base-200 hover:text-base-content transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-base-300"
            >
              <RefreshCcw className="h-4 w-4" />
              {m.action_reload()}
            </button>
          </div>
        </div>

        <div className="border-t border-base-300 bg-base-200/50">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex w-full items-center justify-between px-8 py-4 text-xs font-medium uppercase tracking-wider text-base-content/70 hover:text-base-content hover:bg-base-200 transition-colors focus:outline-none"
          >
            <span className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              {m.dev_details()}
            </span>
            {showDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showDetails && (
            <div className="px-8 pb-8 pt-2 animate-in slide-in-from-top-2 duration-200">
              <div className="mb-3 flex items-center gap-2 text-xs text-base-content/70 font-mono">
                <ArrowRight className="h-3 w-3" />
                Path:{" "}
                <span className="text-base-content bg-base-300 px-1.5 py-0.5 rounded">
                  {pathname}
                </span>
              </div>

              <div className="relative rounded-lg border border-base-300 bg-base-100 p-4 font-mono text-[11px] leading-relaxed text-base-content/70 shadow-sm overflow-hidden">
                <button
                  onClick={handleCopyStack}
                  className="absolute right-2 top-2 rounded-md bg-base-200 p-1.5 text-base-content/70 hover:text-primary hover:bg-primary/10 transition-colors"
                  title={copied ? "Copied" : "Copy Stack Trace"}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>

                <div className="max-h-48 overflow-auto pr-8 custom-scrollbar">
                  <span className="block text-error font-bold mb-2 break-words">
                    {normalizedError.name}: {normalizedError.message}
                  </span>
                  {env.DEV && (
                    <div className="whitespace-pre-wrap break-words opacity-80">
                      {normalizedError.stack || "No stack trace available"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
