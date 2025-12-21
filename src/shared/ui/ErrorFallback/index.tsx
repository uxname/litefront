import { m } from "@generated/paraglide/messages";
import { useRouter, useRouterState } from "@tanstack/react-router";
import {
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
  Terminal,
  Wifi,
} from "lucide-react";
import { FC, useCallback, useMemo, useState } from "react";

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
  style: { wrapper: string; icon: string; ring: string };
  getTitle: () => string;
  getDesc: () => string;
  animate?: boolean;
}

const ERROR_CONFIG: Record<ErrorCategory, ErrorConfig> = {
  [ErrorCategory.AUTH]: {
    icon: LockKeyhole,
    style: {
      wrapper: "bg-amber-50",
      icon: "text-amber-600",
      ring: "ring-amber-100",
    },
    getTitle: () => m.error_auth_required(),
    getDesc: () => m.error_auth_desc(),
  },
  [ErrorCategory.ACCESS]: {
    icon: ShieldBan,
    style: {
      wrapper: "bg-red-50",
      icon: "text-red-600",
      ring: "ring-red-100",
    },
    getTitle: () => m.error_access_denied(),
    getDesc: () => m.error_access_desc(),
  },
  [ErrorCategory.NETWORK]: {
    icon: Wifi,
    style: {
      wrapper: "bg-blue-50",
      icon: "text-blue-600",
      ring: "ring-blue-100",
    },
    getTitle: () => m.error_network(),
    getDesc: () => m.error_network_desc(),
    animate: true,
  },
  [ErrorCategory.SERVER]: {
    icon: ServerCrash,
    style: {
      wrapper: "bg-rose-50",
      icon: "text-rose-600",
      ring: "ring-rose-100",
    },
    getTitle: () => m.error_server(),
    getDesc: () => m.error_server_desc(),
  },
  [ErrorCategory.UNKNOWN]: {
    icon: CircleAlert,
    style: {
      wrapper: "bg-slate-100",
      icon: "text-slate-600",
      ring: "ring-slate-200",
    },
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
      console.error("Failed to copy", err);
    }
  }, [normalizedError]);

  const IconComponent = config.icon;

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Main Content Padding */}
        <div className="p-8 sm:p-10 text-center">
          {/* Dynamic Icon */}
          <div
            className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${config.style.wrapper} ring-1 ${config.style.ring}`}
          >
            <IconComponent
              className={`h-10 w-10 ${config.style.icon} ${config.animate ? "animate-pulse" : ""}`}
              strokeWidth={1.5}
            />
          </div>

          {/* Titles */}
          <p className="text-xs font-bold leading-7 text-slate-400 uppercase tracking-widest mb-1">
            {m.error_generic_title?.() ?? "System Issue"}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-3">
            {config.getTitle()}
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed mb-8">
            {config.getDesc()}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              <RotateCcw className="h-4 w-4" />
              {m.action_retry()}
            </button>
            <button
              onClick={handleReload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white text-slate-700 border border-slate-200 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200"
            >
              <RefreshCcw className="h-4 w-4" />
              {m.action_reload()}
            </button>
          </div>
        </div>

        {/* Developer Section */}
        <div className="border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex w-full items-center justify-between px-8 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
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
              <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 font-mono">
                <ArrowRight className="h-3 w-3" />
                Path:{" "}
                <span className="text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                  {routerState.location.pathname}
                </span>
              </div>

              <div className="relative rounded-lg border border-slate-200 bg-white p-4 font-mono text-[11px] leading-relaxed text-slate-600 shadow-sm overflow-hidden">
                <button
                  onClick={handleCopyStack}
                  className="absolute right-2 top-2 rounded-md bg-slate-100 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title={copied ? "Copied" : "Copy Stack Trace"}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>

                <div className="max-h-48 overflow-auto pr-8 custom-scrollbar">
                  <span className="block text-red-600 font-bold mb-2 break-words">
                    {normalizedError.name}: {normalizedError.message}
                  </span>
                  <div className="whitespace-pre-wrap break-words opacity-80">
                    {normalizedError.stack || "No stack trace available"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
