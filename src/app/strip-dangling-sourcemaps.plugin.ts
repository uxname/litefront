import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { Plugin } from "vite";

/**
 * Several dependencies in the TanStack Start dependency tree (e.g.
 * `@tanstack/*-start*`, `seroval`, `seroval-plugins`) ship JS files that end
 * with a `//# sourceMappingURL=<name>.map` comment but DO NOT publish the
 * referenced `.map` file. Because the TanStack Start plugin pulls these packages
 * into Vite's transform pipeline (instead of pre-bundling them), Vite's dev
 * server tries to read each missing map on load and floods the console with
 * `Failed to load source map … ENOENT: … .map` errors.
 *
 * The app is unaffected (these are warnings), but the noise is misleading. This
 * dev-only plugin intercepts the load of `node_modules` JS files whose
 * referenced source map does NOT exist on disk, and strips just that dangling
 * comment so Vite has nothing to chase. Files with a real `.map` (or an inline
 * `data:` map) are left untouched.
 */
// `\s*$` (not `[ \t]*$`) so it matches whether or not the comment has a
// trailing newline — packages differ (e.g. @tanstack omits it, seroval keeps it).
const SOURCE_MAPPING_URL_RE = /\n?\/\/# sourceMappingURL=(\S+)\s*$/;

export const stripDanglingSourcemaps = (): Plugin => ({
  name: "strip-dangling-sourcemaps",
  // Dev server only — the production build uses a different pipeline and is not
  // affected by this.
  apply: "serve",
  enforce: "pre",
  load(id): string | null {
    const file = id.split("?")[0];
    if (
      !file.includes("/node_modules/") ||
      !/\.(c|m)?js$/.test(file) ||
      file.endsWith(".map")
    ) {
      return null;
    }

    let code: string;
    try {
      code = readFileSync(file, "utf-8");
    } catch {
      return null;
    }

    const match = code.match(SOURCE_MAPPING_URL_RE);
    if (!match) {
      return null;
    }
    const mapUrl = match[1];
    // Inline maps are self-contained — never strip them.
    if (mapUrl.startsWith("data:")) {
      return null;
    }
    // A real map exists at the referenced location — let Vite handle it.
    const mapPath = path.resolve(path.dirname(file), mapUrl);
    if (existsSync(mapPath)) {
      return null;
    }
    // Dangling reference: drop the comment so Vite doesn't try (and fail) to read it.
    return code.replace(SOURCE_MAPPING_URL_RE, "");
  },
});
