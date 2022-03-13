FROM node:16-alpine3.15 as dev

WORKDIR /usr/src/app,

COPY tsconfig*.json ./

COPY package*.json ./

RUN yarn

ENV NODE_ENV=development

EXPOSE 5000

COPY . .

CMD ["yarn", "start:dev"]