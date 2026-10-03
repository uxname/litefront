import { m } from "@generated/paraglide/messages";
import { Code2, Layers } from "lucide-react";
import type { FC, ReactNode } from "react";
import { Header } from "./Header";

/**
 * The frame every page sits in: skip link, the sticky header, the decorative
 * background, `<main>` and the footer. Pages render only their own content —
 * width and padding included, since a marketing page and a form want different
 * ones.
 */
export const AppShell: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="relative flex min-h-screen flex-col bg-muted selection:bg-primary/10 selection:text-primary">
    <a
      href="#content"
      className="sr-only z-[60] rounded-md bg-background px-4 py-2 text-sm font-medium shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {m.skip_to_content()}
    </a>

    {/* Decorative blurred orbs — the one place DESIGN.md allows raw size values. */}
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute top-[-10%] right-[-5%] size-[500px] rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-[10%] left-[-10%] size-[600px] rounded-full bg-info/10 blur-[120px]" />
    </div>

    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Header />
      </div>
    </header>

    <main
      id="content"
      tabIndex={-1}
      className="relative z-10 flex-1 outline-none"
    >
      {children}
    </main>

    <footer className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 border-t px-4 pt-10 pb-20 text-sm text-muted-foreground sm:px-6 md:flex-row lg:px-8">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground"
        >
          L
        </span>
        <span className="font-semibold text-foreground">{m.app_name()}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
      <nav className="flex gap-6">
        <a
          href="https://github.com/uxname/litefront"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-md outline-none transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Code2 className="size-4" /> GitHub
        </a>
        <a
          href="https://feature-sliced.design/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-md outline-none transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Layers className="size-4" /> {m.home_footer_docs()}
        </a>
      </nav>
    </footer>
  </div>
);
