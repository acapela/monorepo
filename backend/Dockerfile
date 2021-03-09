FROM node:15-alpine

WORKDIR /app

COPY package*.json ./

COPY ./.env.production ./.env
COPY ./dist ./dist

EXPOSE 1337

ENV NODE_ENV=production
CMD ["npm", "start"]
