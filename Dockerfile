# Build stage
FROM node:lts-alpine AS build

# Install git for dependencies that require it
RUN apk add --no-cache git

# Set the working directory
WORKDIR /app

# Copy source and install dependencies. We do NOT copy .git: in the meta-repo the
# frontend's .git is a submodule pointer file (gitdir: ...) that breaks any git
# command inside the image, and in a standalone repo it would bloat the build
# context with full history. The `prepare` script (lefthook install) is non-fatal
# without git, and vite-plugin-version-mark skips the commit stamp gracefully.
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . ./

ENV NODE_ENV=production

# Build the application
RUN npm run build:vite

# Production stage
FROM caddy:alpine

# Set the working directory for Caddy
WORKDIR /usr/share/caddy

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/caddy/html

# Copy the Caddyfile configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Expose port 80 for the web server
EXPOSE 80

# Start Caddy server
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
