import { Counter } from "@entities/counter";
import { m } from "@generated/paraglide/messages";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card, CardContent } from "@shared/ui/card";
import { Separator } from "@shared/ui/separator";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@widgets/AppShell";
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Database,
  Layers,
  LayoutTemplate,
  Zap,
} from "lucide-react";
import type { FC } from "react";
import { copyInstallCommand, INSTALL_COMMAND } from "../lib/copyInstallCommand";
import { ErrorSimulator } from "./ErrorSimulator";

export const HomePage: FC = () => {
  const features = [
    {
      icon: LayoutTemplate,
      title: m.home_feature_fsd_title(),
      desc: m.home_feature_fsd_desc(),
      tint: "bg-info/10 text-info",
    },
    {
      icon: Zap,
      title: m.home_feature_vite_title(),
      desc: m.home_feature_vite_desc(),
      tint: "bg-warning/10 text-warning",
    },
    {
      icon: Database,
      title: m.home_feature_graphql_title(),
      desc: m.home_feature_graphql_desc(),
      tint: "bg-primary/10 text-primary",
    },
    {
      icon: Layers,
      title: m.home_feature_typing_title(),
      desc: m.home_feature_typing_desc(),
      tint: "bg-success/10 text-success",
    },
  ];

  return (
    <AppShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-24 px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <section className="mx-auto max-w-4xl text-center">
          <Badge
            variant="outline"
            className="mb-8 gap-2 border-primary bg-background px-3 py-1 font-bold tracking-wide text-primary uppercase animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {m.home_badge_available()}
          </Badge>

          <h1 className="mb-6 text-5xl leading-[1.1] font-black tracking-tight animate-in fade-in zoom-in delay-100 duration-700 sm:text-7xl">
            {m.home_hero_title_lead()} <br />
            <span className="bg-gradient-to-r from-primary via-pink-500 to-info bg-clip-text text-transparent">
              {m.home_hero_title_accent()}
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700">
            {m.home_hero_subtitle()}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700 sm:flex-row">
            <Button
              size="lg"
              onClick={copyInstallCommand}
              // `h-auto` + padding + wrapping: the button holds a long monospace
              // command that wraps to two lines on a phone — it has to grow
              // with its text.
              className="group relative h-auto px-8 py-4 font-mono text-lg whitespace-normal shadow-xl duration-300 hover:scale-[1.01] hover:shadow-2xl"
            >
              <span aria-hidden="true">$</span>
              <span>{INSTALL_COMMAND}</span>
              <CheckCircle2 className="absolute right-3 text-success opacity-0 transition-opacity group-hover:opacity-100" />
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-5 text-lg shadow-sm hover:shadow-md"
            >
              <Link to="/account">
                {m.home_cta_live_demo()}
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <CardContent>
                <div
                  className={`mb-4 flex size-12 items-center justify-center rounded-xl ${feature.tint}`}
                >
                  <feature.icon className="size-6" aria-hidden="true" />
                </div>
                <h2 className="mb-2 text-lg font-bold">{feature.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-3xl font-bold">{m.home_playground_title()}</h2>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="relative min-h-[300px] items-center justify-center overflow-hidden px-8 py-8">
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-info to-primary"
              />
              <Badge className="bg-primary/10 font-bold text-primary uppercase">
                <Box /> {m.home_client_state_badge()}
              </Badge>
              <Counter />
              <p className="max-w-[200px] text-center text-xs text-muted-foreground">
                {m.home_counter_hint()}
              </p>
            </Card>

            <ErrorSimulator />
          </div>
        </section>
      </div>
    </AppShell>
  );
};
