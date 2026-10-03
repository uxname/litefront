import { m } from "@generated/paraglide/messages";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@widgets/AppShell";
import { Ghost, Home, MoveLeft, Search } from "lucide-react";
import type { FC } from "react";

export const NotFoundPage: FC = () => (
  <AppShell>
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-20 text-center">
      <div aria-hidden="true" className="relative mb-12 flex justify-center">
        <div className="absolute inset-0 scale-75 animate-pulse rounded-full bg-primary/10 blur-3xl" />
        <div className="relative rounded-3xl border bg-card p-8 shadow-2xl animate-in zoom-in duration-500">
          <Ghost
            className="size-24 animate-bounce text-primary"
            strokeWidth={1.2}
          />
        </div>
        <div className="absolute -top-4 -right-4 size-8 animate-pulse rounded-full bg-info opacity-60 blur-xl" />
        <div className="absolute -bottom-2 -left-6 size-12 animate-pulse rounded-full bg-primary opacity-40 blur-2xl" />
      </div>

      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Badge className="mb-4 px-4 py-1.5 font-black tracking-[0.2em] uppercase">
          <Search />
          {m.not_found_code()}
        </Badge>

        <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
          {m.not_found_title()}
        </h1>

        <p className="mx-auto max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {m.not_found_message()}
        </p>
      </div>

      <div className="mt-12 flex w-full flex-col items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 delay-200 duration-700 sm:flex-row">
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.history.back()}
          className="group w-full shadow-sm sm:w-auto"
        >
          <MoveLeft className="transition-transform group-hover:-translate-x-1" />
          {m.go_back()}
        </Button>

        <Button
          asChild
          size="lg"
          className="w-full shadow-xl hover:-translate-y-0.5 hover:shadow-2xl sm:w-auto"
        >
          <Link to="/" preload="viewport">
            <Home />
            {m.back_to_home()}
          </Link>
        </Button>
      </div>
    </div>
  </AppShell>
);
