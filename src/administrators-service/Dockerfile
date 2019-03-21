FROM node:10.15-alpine AS dev-image
ENV NODE_ENV=development
WORKDIR /usr/src/app

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

COPY package.json .
RUN npm i --verbose

ARG cache=1
COPY . .
CMD ["npm", "start"]

FROM dev-image AS test-image
WORKDIR /usr/src/app

ARG cache=1
RUN npm run test

FROM dev-image AS build-image
ENV NODE_ENV=production
WORKDIR /usr/src/app

RUN npm prune --production

FROM node:10.15-alpine as prod-image

RUN addgroup -S stark && adduser -S -G stark tony

WORKDIR /usr/src/app
USER tony:stark

COPY --from=build-image /usr/src/app .

CMD ["npm", "start"]
