FROM node:14-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
RUN npm install
COPY . .

EXPOSE 1621
CMD [ "npm", "start" ]