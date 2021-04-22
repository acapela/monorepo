FROM node:15-buster

RUN wget https://storage.googleapis.com/berglas/main/linux_amd64/berglas -O /bin/berglas && chmod +x /bin/berglas
RUN yarn install hasura-cli -g

WORKDIR /app

COPY ./ ./

RUN yarn install
RUN yarn run build

ENV BACKEND_PORT=1337
EXPOSE 1337

ENV FRONTEND_PORT=3000
EXPOSE 3000

ENV NODE_ENV=production
CMD ["yarn", "run", "start:backend"]
