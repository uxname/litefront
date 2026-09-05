import { env } from "./env";

// Nitro server plugin, registered in vite.config.ts. Nitro imports and runs its
// plugins while the server starts up and rethrows whatever they throw, so
// importing ./env here validates the container environment at BOOT: an unset
// required variable kills the process — with the variable's name in the
// message — before the port is bound, the way the backend fails.
//
// src/server.ts cannot do this job even though it is the SSR entry: Nitro
// imports it lazily, on the first request, by which point the server is already
// up, listening and reporting healthy.
export default (): void => {
  // Two jobs in one line. It answers the first question a promoted image
  // raises — "which backend is THIS container talking to?" — the failure mode
  // that used to boot green and point users at the wrong environment. And it
  // reads `env`, which is what keeps the import above alive: Nitro bundles
  // application code with `moduleSideEffects: false`, so a bare
  // `import "./env"` is tree-shaken out and the check silently disappears.
  console.log("frontend_config_loaded", {
    graphql_api_url: env.VITE_GRAPHQL_API_URL,
    base_url: env.VITE_BASE_URL,
    version: env.VITE_APP_VERSION,
  });
};
