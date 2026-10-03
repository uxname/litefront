import { m } from "@generated/paraglide/messages";
import { env } from "@shared/config";
import { cn } from "@shared/lib/cn";
import {
  ArrowRight,
  ChevronDown,
  Copy,
  RefreshCcw,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { Button } from "../button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
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
  const [copied, setCopied] = useState(false);

  // One pending "Copied" reset at most; cancelled on unmount so no state update
  // fires after the component is gone.
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const normalizedError = normalizeError(error);
  // The backend stamps this id on every log line of the failed request, so it is
  // what turns a user's screenshot into something the server logs can answer.
  const requestId = extractRequestId(error);
  const config = ERROR_CONFIG[detectErrorCategory(normalizedError)];

  // Retries at once, every time. A person pressing the button IS the backoff;
  // transient network failures are already retried, with a real exponential
  // delay, by urql's retryExchange before an error ever reaches this screen.
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  const handleCopyStack = async () => {
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
    } catch (err) {
      if (env.DEV) {
        console.error("Failed to copy", err);
      }
    }
  };

  const IconComponent = config.icon;
  const copyLabel = copied ? m.action_copied() : m.action_copy_stack();

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-muted p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border bg-card shadow-xl animate-in fade-in zoom-in duration-300">
        <div className="p-8 text-center sm:p-10">
          <div
            aria-hidden="true"
            className={cn(
              "mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl ring-1",
              config.style.wrapper,
              config.style.ring,
            )}
          >
            <IconComponent
              className={cn(
                "size-10",
                config.style.icon,
                config.animate && "animate-pulse",
              )}
              strokeWidth={1.5}
            />
          </div>

          <p className="mb-1 text-xs leading-7 font-bold tracking-widest text-muted-foreground uppercase">
            {m.error_generic_title()}
          </p>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {config.getTitle()}
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            {config.getDesc()}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              onClick={handleRetry}
              className="w-full shadow-sm sm:w-auto"
            >
              <RotateCcw />
              {m.action_retry()}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto"
            >
              <RefreshCcw />
              {m.action_reload()}
            </Button>
          </div>
        </div>

        <Collapsible className="group/details border-t bg-muted/50">
          <CollapsibleTrigger className="flex w-full items-center justify-between px-8 py-4 text-xs font-medium tracking-wider text-muted-foreground uppercase outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset">
            <span className="flex items-center gap-2">
              <Terminal className="size-4" />
              {m.dev_details()}
            </span>
            <ChevronDown className="size-4 transition-transform group-data-[state=open]/details:rotate-180" />
          </CollapsibleTrigger>

          <CollapsibleContent className="px-8 pt-2 pb-8">
            <dl className="mb-3 space-y-3 font-mono text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ArrowRight className="size-3" aria-hidden="true" />
                <dt>{m.error_debug_path()}:</dt>
                <dd className="rounded bg-accent px-1.5 py-0.5 text-foreground">
                  {pathname}
                </dd>
              </div>
              {requestId && (
                <div className="flex items-center gap-2">
                  <ArrowRight className="size-3" aria-hidden="true" />
                  <dt>{m.error_debug_request()}:</dt>
                  <dd className="rounded bg-accent px-1.5 py-0.5 break-all text-foreground">
                    {requestId}
                  </dd>
                </div>
              )}
            </dl>

            <div className="relative overflow-hidden rounded-lg border bg-card p-4 font-mono text-xs leading-relaxed text-muted-foreground shadow-sm">
              {/* Own provider: this screen renders when something already
                  broke, possibly above the app's providers. */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon-sm"
                      className="absolute top-2 right-2"
                      aria-label={copyLabel}
                      onClick={handleCopyStack}
                    >
                      <Copy />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{copyLabel}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* Announces the copy to screen readers; the tooltip may be closed. */}
              <span aria-live="polite" className="sr-only">
                {copied ? m.action_copied() : ""}
              </span>

              <div className="max-h-48 overflow-auto pr-8">
                <span className="mb-2 block font-bold break-words text-destructive">
                  {normalizedError.name}: {normalizedError.message}
                </span>
                {env.DEV && (
                  <div className="break-words whitespace-pre-wrap opacity-80">
                    {normalizedError.stack || m.error_no_stack()}
                  </div>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </main>
  );
};
