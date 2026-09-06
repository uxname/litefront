import { m } from "@generated/paraglide/messages";
import { env } from "@shared/config";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Copy,
  RefreshCcw,
  RotateCcw,
  Terminal,
} from "lucide-react";
import {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { detectErrorCategory } from "./detectErrorCategory";
import { ERROR_CONFIG } from "./errorConfig";
import { extractRequestId } from "./extractRequestId";
import { normalizeError } from "./normalizeError";

interface ErrorFallbackProps {
  error: unknown;
  reset?: () => void;
  pathname?: string;
  onRetry?: () => void;
}

export const ErrorFallback: FC<ErrorFallbackProps> = ({
  error,
  reset,
  // Read lazily and SSR-safely: this component is the *fallback*, so it renders
  // exactly when something already failed — including inside the server render,
  // where touching `window` would make the error boundary throw from its own
  // fallback and turn a handled error into a bare 500.
  pathname = typeof window === "undefined" ? "" : window.location.pathname,
  onRetry,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const retryCountRef = useRef(0);
  // Track pending timers so they are cancelled on unmount (no state updates or
  // retries fire after the component is gone).
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(
    () => () => {
      for (const id of timeoutsRef.current) clearTimeout(id);
    },
    [],
  );

  const normalizedError = useMemo(() => normalizeError(error), [error]);
  // The backend stamps this id on every log line of the failed request, so it is
  // what turns a user's screenshot into something the server logs can answer.
  const requestId = useMemo(() => extractRequestId(error), [error]);
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
      timeoutsRef.current.push(setTimeout(doRetry, delay));
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
        ...(requestId ? [`Request ID: ${requestId}`] : []),
        `Time: ${new Date().toISOString()}`,
        `Stack:`,
        normalizedError.stack,
      ].join("\n");

      await navigator.clipboard.writeText(debugInfo);
      setCopied(true);
      timeoutsRef.current.push(setTimeout(() => setCopied(false), 2000));
    } catch (err) {
      if (env.DEV) {
        console.error("Failed to copy", err);
      }
    }
  }, [normalizedError, requestId]);

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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-content font-medium hover:bg-primary/90 transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <RotateCcw className="h-4 w-4" />
              {m.action_retry()}
            </button>
            <button
              onClick={handleReload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-base-100 text-base-content border border-base-300 font-medium hover:bg-base-200 hover:text-base-content transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <RefreshCcw className="h-4 w-4" />
              {m.action_reload()}
            </button>
          </div>
        </div>

        <div className="border-t border-base-300 bg-base-200/50">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex w-full items-center justify-between px-8 py-4 text-xs font-medium uppercase tracking-wider text-base-content/70 hover:text-base-content hover:bg-base-200 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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

              {requestId && (
                <div className="mb-3 flex items-center gap-2 text-xs text-base-content/70 font-mono">
                  <ArrowRight className="h-3 w-3" />
                  Request:{" "}
                  <span className="text-base-content bg-base-300 px-1.5 py-0.5 rounded break-all">
                    {requestId}
                  </span>
                </div>
              )}

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
