FROM node:14-slim as base

WORKDIR /src
COPY package*.json ./
EXPOSE 7171

FROM base as production

RUN npm i
COPY . ./
RUN npm run build
CMD ["npm", "start"]
