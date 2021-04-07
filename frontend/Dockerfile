FROM node:15-buster

RUN wget https://storage.googleapis.com/berglas/main/linux_amd64/berglas -O /bin/berglas && chmod +x /bin/berglas

WORKDIR /app

COPY ./dependencies-to-install.txt ./
RUN cat dependencies-to-install.txt | xargs npm install --no-package-lock --no-save

COPY package.json ./
COPY ./.env.production ./.env
COPY ./.next ./.next
COPY ./dist ./dist

ENV FRONTEND_PORT=3000
EXPOSE 3000

ENV NODE_ENV=production
CMD ["npm", "start"]
