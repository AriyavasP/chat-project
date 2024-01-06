FROM node:18-alpine3.16

WORKDIR /app

COPY package*.json /app

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm","start" ]