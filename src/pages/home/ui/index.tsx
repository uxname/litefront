import { useGetCountryQuery } from "@generated/graphql";
import { Counter } from "@shared/counter";
import { toast } from "@shared/ui/Toaster";
import { Link } from "@tanstack/react-router";
import { Header } from "@widgets/Header";
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Code2,
  Database,
  Globe,
  Layers,
  LayoutTemplate,
  Zap,
} from "lucide-react";
import { FC, useState } from "react";

export const HomePage: FC = () => {
  // Data Fetching (Server State)
  const [{ data, fetching, error }] = useGetCountryQuery({
    variables: { code: "BR" },
  });

  // Local UI State for interactions
  const [isHovered, setIsHovered] = useState(false);

  // Quick helper for visuals
  const features = [
    {
      icon: LayoutTemplate,
      title: "Feature-Sliced Design",
      desc: "Scalable architecture for serious frontend teams.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Zap,
      title: "Vite + React 19",
      desc: "Blazing fast build times and latest React features.",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: Database,
      title: "GraphQL + URQL",
      desc: "Type-safe data fetching with auto-generated hooks.",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: Layers,
      title: "Strict Typing",
      desc: "TypeScript everywhere. No any, strict null checks.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const handleCopyCommand = () => {
    navigator.clipboard.writeText("npx degit uxname/litefront my-app");
    toast.success("Command copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Header />
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col gap-24">
        {/* HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v1.0.0 is now available
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1] animate-in fade-in zoom-in duration-700 delay-100">
            Build Modern Frontends <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
              Without the Hassle
            </span>
          </h1>

          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            A production-ready React 19 boilerplate powered by Feature-Sliced
            Design, GraphQL, and OIDC authentication.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <button
              type="button"
              onClick={handleCopyCommand}
              className="cursor-pointer group relative flex items-center gap-3 px-6 py-3.5 bg-slate-900 text-slate-300 rounded-xl font-mono text-sm shadow-xl shadow-slate-200 hover:shadow-2xl hover:scale-[1.01] active:scale-95 transition-all duration-300 border-none"
            >
              <span className="text-indigo-400">$</span>
              <span>npx degit uxname/litefront my-app</span>
              <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </button>

            <Link
              to="/protected"
              className="flex items-center gap-2 px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              Live Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* FEATURES BENTO GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg} ${feature.color}`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </section>

        {/* LIVE DEMO SECTION (INTERACTIVE) */}
        <section className="relative">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Interactive Playground
            </h2>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Client State (Zustand) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <div className="mb-6 flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  <Box className="w-3 h-3" /> Client State (Zustand)
                </div>
                <Counter />
                <p className="text-xs text-slate-400 mt-6 text-center max-w-[200px]">
                  State persists across navigation but resets on refresh.
                </p>
              </div>
            </div>

            {/* Right: Server State (GraphQL) */}
            <div className="lg:col-span-8">
              <section
                aria-label="Server Data Preview"
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    <Globe className="w-3 h-3" /> Server State (GraphQL)
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  </div>
                </div>

                <div className="p-8 flex-1 relative">
                  {fetching ? (
                    <div className="flex flex-col gap-4 animate-pulse">
                      <div className="h-8 bg-slate-100 rounded w-1/3"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                      <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="h-24 bg-slate-100 rounded-xl"></div>
                        <div className="h-24 bg-slate-100 rounded-xl"></div>
                        <div className="h-24 bg-slate-100 rounded-xl"></div>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full text-red-500 gap-2">
                      <Zap className="w-8 h-8" />
                      <p className="font-medium">Failed to load data</p>
                    </div>
                  ) : data?.country ? (
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                          <p className="text-slate-400 text-sm font-mono mb-1">
                            QUERY: {`{ country(code: "BR") }`}
                          </p>
                          <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            {data.country.name}
                          </h3>
                          <p className="text-lg text-slate-500 font-medium mt-2">
                            Native: {data.country.native}
                          </p>
                        </div>
                        <div className="text-[80px] leading-none select-none filter drop-shadow-2xl hover:scale-110 transition-transform duration-300 cursor-help">
                          {data.country.emoji}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Capital
                          </p>
                          <p className="text-xl font-bold text-slate-800">
                            {data.country.capital}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Currency
                          </p>
                          <p className="text-xl font-bold text-slate-800">
                            {data.country.currency}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Phone Code
                          </p>
                          <p className="text-xl font-bold text-slate-800">
                            +{data.country.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Dynamic background text */}
                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-black text-slate-900/5 select-none pointer-events-none transition-all duration-700 ease-out ${isHovered ? "scale-110 opacity-10" : "scale-100"}`}
                  >
                    BR
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 pt-10 pb-20 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">
              L
            </div>
            <span className="font-semibold text-slate-900">LiteFront</span>
            <span>© 2025</span>
          </div>
          <div className="flex gap-6">
            <a
              href="https://github.com/uxname/litefront"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-600 transition-colors flex items-center gap-2"
            >
              <Code2 className="w-4 h-4" /> GitHub
            </a>
            <a
              href="https://feature-sliced.design/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-600 transition-colors flex items-center gap-2"
            >
              <Layers className="w-4 h-4" /> Documentation
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};
