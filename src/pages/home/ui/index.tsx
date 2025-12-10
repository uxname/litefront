import { useGetCountryQuery } from "@generated/graphql.tsx";
import { Counter } from "@shared/counter";
import { Header } from "@widgets/Header";
import {
  Activity,
  AlertTriangle,
  Box,
  Coins,
  Languages,
  MapPin,
  MousePointer2,
  Server,
} from "lucide-react";
import { FC, useState } from "react";

export const HomePage: FC = () => {
  const [{ data, fetching, error }] = useGetCountryQuery({
    variables: { code: "BR" },
  });

  const [hasError, setHasError] = useState(false);

  if (hasError) {
    throw new Error("Demo error");
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-40 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <Header />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Project Capabilities
          </h1>
          <p className="mt-2 text-slate-500 max-w-2xl">
            This dashboard demonstrates the integration of GraphQL data
            fetching, client-side state management, and error boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4 text-indigo-600">
                <MousePointer2 className="w-5 h-5" />
                <h2 className="font-semibold uppercase tracking-wide text-xs">
                  Client State
                </h2>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Interactive component example showing local state persistance.
              </p>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-100 flex justify-center">
                <Counter />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Dev Controls
              </h3>
              <div className="flex flex-col gap-3">
                <button
                  className="btn btn-sm h-10 w-full justify-start text-red-600 bg-red-50 hover:bg-red-100 border-none normal-case font-medium"
                  onClick={() => setHasError(true)}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Simulate Runtime Error
                </button>

                <a
                  href="/_stats.html"
                  className="btn h-auto py-2 w-full flex-row justify-start flex-nowrap text-slate-600 bg-slate-50 hover:bg-slate-100 border-none normal-case gap-3"
                >
                  <Box className="w-4 h-4 shrink-0" />
                  <div className="flex flex-col items-start text-left leading-tight">
                    <span className="font-medium text-sm">
                      View Build Stats
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Production build only
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600">
                <Server className="w-5 h-5" />
                <h2 className="font-semibold uppercase tracking-wide text-xs">
                  GraphQL Response
                </h2>
              </div>
              {fetching && (
                <span className="loading loading-spinner loading-sm text-slate-400"></span>
              )}
            </div>

            {fetching && !data && (
              <div className="space-y-4 animate-pulse">
                <div className="h-56 bg-slate-200 rounded-xl w-full"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-28 bg-slate-200 rounded-xl"></div>
                  <div className="h-28 bg-slate-200 rounded-xl"></div>
                  <div className="h-28 bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-error rounded-xl shadow-sm bg-red-50 border-red-200 text-red-800">
                <AlertTriangle className="stroke-current shrink-0 h-6 w-6" />
                <div className="flex flex-col">
                  <span className="font-bold">Error loading data</span>
                  <span className="text-xs">{error.message}</span>
                </div>
              </div>
            )}

            {data?.country && (
              <>
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md p-8 sm:p-10 transition-transform hover:scale-[1.01] duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center z-10 relative gap-6">
                    <div>
                      <div className="badge badge-outline text-blue-100 border-blue-200 mb-3">
                        Country Code: BR
                      </div>
                      <h1 className="text-5xl font-bold mb-1 tracking-tight">
                        {data.country.name}
                      </h1>
                      <p className="text-blue-100 text-xl italic font-light">
                        {data.country.native}
                      </p>
                    </div>
                    <div className="text-9xl drop-shadow-xl select-none filter hover:brightness-110 transition-all">
                      {data.country.emoji}
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-900 opacity-20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="card bg-white border border-slate-200 shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 text-slate-400 mb-3">
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Capital
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">
                      {data.country.capital}
                    </div>
                  </div>

                  <div className="card bg-white border border-slate-200 shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 text-slate-400 mb-3">
                      <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded">
                        <Coins className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Currency
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">
                      {data.country.currency}
                    </div>
                  </div>

                  <div className="card bg-white border border-slate-200 shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 text-slate-400 mb-3">
                      <div className="p-1.5 bg-purple-50 text-purple-600 rounded">
                        <Languages className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Languages
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {data.country.languages.map((l) => (
                        <span
                          key={l.name}
                          className="px-2 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-md"
                        >
                          {l.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
