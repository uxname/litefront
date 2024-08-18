# Build stage
FROM node:22-alpine3.19 AS build
RUN apk add git
WORKDIR /app
COPY package*.json ./
RUN npm i --legacy-peer-deps
COPY . ./
RUN npm run build

# Production stage
FROM caddy:alpine
WORKDIR /usr/share/caddy
COPY --from=build /app/dist /usr/share/caddy/html

COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
