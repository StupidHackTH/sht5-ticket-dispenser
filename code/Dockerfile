FROM node:14-alpine as builder

WORKDIR /usr/app

COPY package.json yarn.lock .

RUN yarn

COPY . .

RUN yarn build

FROM node:14-alpine as runner

WORKDIR /usr/app

COPY package.json yarn.lock .
RUN yarn install --production

COPY public .env .
COPY --from=builder /usr/app/build build

ENV NODE_ENV production

CMD ["node", "./build/index.js"]
EXPOSE 8080