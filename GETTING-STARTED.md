Hello there!

I hope getting started process will be as smooth and easy for you as possible!

Let's get it started.

## Monorepo

This monorepo includes everything needed to run our product on your laptop.

## Requirements

### Docker

You need to have docker and docker-compose installed on your machine. https://docs.docker.com/get-docker/

Make sure that docker is properly installed by calling `docker-compose --version` in your console.

### Node & NPM

npm version 7.0+ is required (latest version is recommended) because this repo is based on npm workspaces.

Node version 15+ is recommended.

### `.env` file

Before running the project, you need to have proper config.

In root of this repo, copy `.env.sample` to `.env`.

After copying, your env is mostly ready for dev work. Ask other team members for missing values such as google oauth secrets etc.

### Firebase credentials (will not be needed soon)

Right now, backend needs access to firebase-admin. This is legacy and we will try to remove this dependency.

firebase-admin works out of the box when deployed on GCP, but in order to make it work locally, you need to put `credentials.json` file in root of this repo.

To get this file ask team members on Slack for it or for google firebase console access so you can download it from there yourself.

### Finally!

After those steps, we should be good to go!

First - install all dependencies by running

`npm install`

After installed, the only command you have to remember should be `npm start`

It will show you all other avaliable commands as a console interactive select:

![NPM START](./docs/npm-start.gif)

In order to start working, run those commands

`docker:up`, and then `frontend:dev` and `backend:dev`.

After that, go to http://localhost:3000 and you should see acapela app home.

## IDE

VS Code is recommended IDE.

### Extensions

There are bunch of extensions that will make it easier to work with this repo

#### ENV

Will add syntax highlighting for .env files.

VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=IronGeek.vscode-env

#### ESLint

We're using eslint, it'll make it possible to see eslint warning and errors in real-time

VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

#### Prettier - Code formatter

We're using prettier for code-formatting. It'll format code after every file save.

VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

#### vscode-styled-components

We're using styled-components for styling our UI. This will add syntax-highlighting and autocomplete for css-in-js

VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=diegolincoln.vscode-styled-components

![NPM START](./docs/styled-components.png)

#### GraphQL

This will provide validation and autocomplete when writing gql queries to make sure they match current schema.

VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql

![NPM START](./docs/gql1.png)
![NPM START](./docs/gql2.png)
