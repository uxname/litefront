import { Counter } from "@entities/counter";
import { m } from "@generated/paraglide/messages";
import { toast } from "@shared/ui/Toaster";
import { Link } from "@tanstack/react-router";
import { Header } from "@widgets/Header";
import {
  ArrowRight,
  Box,
  Bug,
  CheckCircle2,
  Code2,
  Database,
  Layers,
  LayoutTemplate,
  Zap,
} from "lucide-react";
import { type FC, useCallback } from "react";
import { useErrorBoundary } from "react-error-boundary";

const ErrorSimulator = () => {
  const { showBoundary } = useErrorBoundary();

  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-8 flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-error to-warning"></div>
      <div className="mb-6 flex items-center gap-2 text-error bg-error/10 px-3 py-1 rounded-full text-xs font-bold uppercase">
        <Bug className="w-3 h-3" /> {m.home_error_boundary_badge()}
      </div>

      <div className="text-center space-y-1 mb-6">
        <span className="text-[10px] font-bold text-base-content/70 uppercase tracking-widest">
          {m.home_debug_tool()}
        </span>
        <div className="text-xl font-bold text-base-content tracking-tight">
          {m.home_system_resilience()}
        </div>
      </div>

      <button
        onClick={() =>
          showBoundary(
            new Error(
              "Simulated Critical Failure: This is a test of the Error Boundary system.",
            ),
          )
        }
        className="group relative flex w-full max-w-[200px] items-center justify-center gap-2 rounded-xl bg-error px-4 py-3 text-sm font-semibold text-error-content shadow-lg transition-all hover:bg-error/90 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
      >
        <Zap className="h-4 w-4 fill-current" />
        {m.home_crash_app()}
      </button>

      <p className="text-xs text-base-content/70 mt-4 text-center max-w-[220px]">
        {m.home_error_sim_hint()}
      </p>
    </div>
  );
};

export const HomePage: FC = () => {
  const features = [
    {
      icon: LayoutTemplate,
      title: m.home_feature_fsd_title(),
      desc: m.home_feature_fsd_desc(),
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      icon: Zap,
      title: m.home_feature_vite_title(),
      desc: m.home_feature_vite_desc(),
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      icon: Database,
      title: m.home_feature_graphql_title(),
      desc: m.home_feature_graphql_desc(),
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      icon: Layers,
      title: m.home_feature_typing_title(),
      desc: m.home_feature_typing_desc(),
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  const handleCopyCommand = useCallback(() => {
    navigator.clipboard.writeText("npx degit uxname/litefront my-app");
    toast.success(m.home_copy_command_success());
  }, []);

  return (
    <div className="min-h-screen bg-base-200 font-sans selection:bg-primary/10 selection:text-primary">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-info/10 rounded-full blur-[120px]" />
      </div>

      <div className="sticky top-0 z-50 border-b border-base-300/60 bg-base-100/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Header />
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col gap-24">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary text-primary text-xs font-bold uppercase tracking-wide mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {m.home_badge_available()}
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-base-content mb-6 leading-[1.1] animate-in fade-in zoom-in duration-700 delay-100">
            {m.home_hero_title_lead()} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-info">
              {m.home_hero_title_accent()}
            </span>
          </h1>

          <p className="text-xl text-base-content/70 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            {m.home_hero_subtitle()}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <button
              type="button"
              onClick={handleCopyCommand}
              className="cursor-pointer group relative flex items-center gap-3 px-6 py-3.5 bg-primary text-primary-content rounded-xl font-mono text-sm shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-95 transition-all duration-300 border-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="text-primary-content">$</span>
              <span>npx degit uxname/litefront my-app</span>
              <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
            </button>

            <Link
              to="/account"
              className="flex items-center gap-2 px-8 py-3.5 bg-base-100 text-base-content border border-base-300 rounded-xl font-bold hover:bg-base-200 hover:border-base-300 transition-all shadow-sm hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {m.home_cta_live_demo()}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="group p-6 bg-base-100 rounded-2xl border border-base-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg} ${feature.color}`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-base-content mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-base-content/70 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </section>

        <section className="relative">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-base-content">
              {m.home_playground_title()}
            </h2>
            <div className="h-px flex-1 bg-base-300"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-info to-primary"></div>
              <div className="mb-6 flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 rounded-full text-xs font-bold uppercase">
                <Box className="w-3 h-3" /> {m.home_client_state_badge()}
              </div>
              <Counter />
              <p className="text-xs text-base-content/70 mt-6 text-center max-w-[200px]">
                {m.home_counter_hint()}
              </p>
            </div>

            <ErrorSimulator />
          </div>
        </section>

        <footer className="border-t border-base-300 pt-10 pb-20 flex flex-col md:flex-row justify-between items-center gap-6 text-base-content/70 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-content font-bold">
              L
            </div>
            <span className="font-semibold text-base-content">LiteFront</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <a
              href="https://github.com/uxname/litefront"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Code2 className="w-4 h-4" /> GitHub
            </a>
            <a
              href="https://feature-sliced.design/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Layers className="w-4 h-4" /> {m.home_footer_docs()}
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};
