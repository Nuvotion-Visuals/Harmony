FROM node:lts-alpine

RUN apk add --no-cache git

WORKDIR LexiOS
COPY . .

RUN yarn
RUN yarn build

CMD yarn start
