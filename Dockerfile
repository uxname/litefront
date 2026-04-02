# Build stage
FROM node:lts-alpine AS build

# Install git for dependencies that require it
RUN apk add --no-cache git

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
# git required for lefthook
COPY .git .git
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . ./

# Build the application
RUN npm run build

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
