# Build stage
FROM node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS build

# Set the working directory
WORKDIR /app

# Copy source and install the exact dependencies pinned in package-lock.json
# (npm ci, not npm install). .git is not in the build context (see
# .dockerignore), so the `prepare` script (lefthook install) is made
# non-fatal without git in package.json.
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . ./

ENV NODE_ENV=production

# Build the SSR app. TanStack Start + the Nitro node-server preset emit a
# standalone server bundle under .output (server + public assets).
#
# Deliberately NO VITE_* build args or ENV here, and no .env in the context (see
# .dockerignore): the public config is read from the container's environment at
# BOOT (src/shared/config/env.ts), so the bundle holds no authority, client id
# or API URL. One built image runs in every environment — the tag says which
# code, never which server.
#
# The one optional exception is build TOOLING, not app config: uploading source
# maps to the error tracker (GlitchTip). Pass nothing and the build is exactly
# as above — no maps, no upload. To upload, see "Source maps" in the meta-repo's
# docs/DEPLOY.md. These are args of THIS stage only: the runtime stage below
# starts from a fresh FROM, so the pushed image carries none of them. The token
# does stay in the build machine's local cache — build on a machine you trust.
# (A BuildKit secret would avoid even that, but the classic builder — Docker
# without buildx — rejects `RUN --mount`, and this image must build there.)
ARG VITE_SENTRY_URL=""
ARG VITE_SENTRY_ORG=""
ARG VITE_SENTRY_PROJECT=""
ARG VITE_SENTRY_AUTH_TOKEN=""
RUN npm run build

# Production stage — Node runtime serving the SSR server (replaces the previous
# static Caddy host now that rendering happens on the server).
FROM node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS runtime

WORKDIR /app

ENV NODE_ENV=production
# The container ALWAYS listens on 3000; the compose files map or proxy to it.
ENV PORT=3000

# The runtime environment is the whole configuration of this image: the server
# refuses to boot (naming the variable) when a required one is unset. The list
# lives in src/shared/config/env.ts and is passed by docker-compose.prod.yml —
# not repeated here, so it cannot drift.

# The Nitro output is fully self-contained (bundled deps + public assets), so we
# copy only .output — no node_modules needed at runtime.
COPY --from=build /app/.output ./.output

# Run as the built-in non-root `node` user.
USER node

EXPOSE 3000

# Liveness probe baked into the image (also present in docker-compose) so the
# container reports health under any orchestrator. busybox wget ships with the
# alpine base. Probes the static /health.txt — same Node process, but no SSR
# page render per probe (a full render every interval is needless load).
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:3000/health.txt || exit 1

# Start the Node SSR server (same entry as `npm run start:prod`).
CMD ["node", ".output/server/index.mjs"]
