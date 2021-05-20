# Acapela web frontend

This repo contains the application that powers acapela's web frontend.

## Usage

To run the frontend, you need a working backend server and hasura instance.
By default, in development, if you run [the backend server locally as described here](https://github.com/weareacapela/backend), it will connect and work with your local backend and hasura instances. You can override this by overriding the `BACKEND_HOST` and `HASURA_HOST` environment variables.

Use `yarn dev` to start the development frontend instance.

Use `yarn next:build:analyze` to run a bundle analysis environment to investigate your bundle size.

Use `yarn test:watch` to start an interactive test environment.

Use `yarn server:start` to start the custom next.js server.

## Deployment

When you create a pr, it will run tests and linting automatically. When you get a review and merge, ci will automatically deploy to production.

## Stack

We use:

- next.js, but we may revisit and move to create react app instead, as our application is a full-blown SPA not focused on static content.
- typescript
- styled-components for css
- jest + react testing library for tests
- next-auth for authentication
- apollo for graphql
- prettier + eslint

## Resources

### React

[React](https://reactjs.org/)

Tutorials:

- [React Tutorial](https://reactjs.org/tutorial/tutorial.html)

Reference:

- [Advanced Guides](https://reactjs.org/docs/accessibility.html)
- [React Typescript Cheatsheet](https://github.com/typescript-cheatsheets/react/blob/main/README.md)

### Next.js

[Next.js](https://nextjs.org/) gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more.

Tutorials:

- [Quick Start](https://nextjs.org/docs/getting-started)

Reference:

- [Documentation](https://nextjs.org/docs/basic-features/pages)
