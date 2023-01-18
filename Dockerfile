FROM node:16-slim as base
RUN apt-get update && apt-get install ca-certificates -y

WORKDIR /app
COPY package*.json ./

FROM base as production

RUN npm i
COPY . ./
RUN npm run build
CMD ["npm", "start"]
