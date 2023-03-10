FROM node:18-alpine3.17
RUN apk add ca-certificates
WORKDIR /app
COPY package*.json ./
RUN npm i --legacy-peer-deps
COPY . ./
RUN npm run build
CMD ["npm", "run", "start:prod"]
