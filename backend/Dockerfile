FROM node:15-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY ./config ./config
COPY ./dist ./dist

EXPOSE 1337

ENV NODE_ENV=production
CMD ["npm", "start"]
