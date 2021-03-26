FROM node:15-buster

WORKDIR /app

RUN npm install --no-package-lock --no-save next

COPY package.json ./
COPY ./.next ./.next
COPY ./dist ./dist

ENV FRONTEND_PORT=3000
EXPOSE 3000

ENV NODE_ENV=production
CMD ["npm", "start"]
