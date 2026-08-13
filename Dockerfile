# Build stage
FROM node:22-alpine AS build

# Install git for dependencies that require it
RUN apk add --no-cache git

# Set the working directory
WORKDIR /app

# Copy source and install the exact dependencies pinned in package-lock.json
# (npm ci, not npm install). .git is not in the build context (see
# .dockerignore), so the `prepare` script (lefthook install) is made
# non-fatal without git in package.json.
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code
COPY . ./

ENV NODE_ENV=production

# Build the SSR app. TanStack Start + the Nitro node-server preset emit a
# standalone server bundle under .output (server + public assets).
RUN npm run build:vite

# Production stage — Node runtime serving the SSR server (replaces the previous
# static Caddy host now that rendering happens on the server).
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# The Nitro output is fully self-contained (bundled deps + public assets), so we
# copy only .output — no node_modules needed at runtime.
COPY --from=build /app/.output ./.output

# Run as the built-in non-root `node` user.
USER node

EXPOSE 3000

# Liveness probe baked into the image (also present in docker-compose) so the
# container reports health under any orchestrator. busybox wget ships with the
# alpine base.
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:3000/ || exit 1

# Start the Node SSR server (same entry as `npm run start:prod`).
CMD ["node", ".output/server/index.mjs"]
