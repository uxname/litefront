# Build stage
FROM node:20-alpine3.17 AS build
WORKDIR /app
COPY package*.json ./
RUN npm i --legacy-peer-deps
COPY . ./
RUN npm run build

# Production stage
FROM node:20-alpine3.17
WORKDIR /app
COPY --from=build /app ./
CMD ["npm", "run", "start:prod"]
