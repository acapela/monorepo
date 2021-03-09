FROM node:15-alpine

RUN wget https://storage.googleapis.com/berglas/main/linux_amd64/berglas -O /bin/berglas && chmod +x /bin/berglas
RUN npm install hasura-cli -g

WORKDIR /app

COPY package*.json ./
COPY ./.env.production ./.env
COPY ./dist ./dist
COPY ./scripts/migrate-hasura.sh ./scripts/
COPY ./hasura ./hasura

EXPOSE 1337

ENV NODE_ENV=production
CMD ["npm", "start"]
