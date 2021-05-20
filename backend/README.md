# Backend

This is backend package of our monorepo, it contains our hasura setup and API server.

## Usage

For main setup instructions check root readme file.

# Architecture

## Overview

We use a [google cloud managed postgres instance](https://cloud.google.com/sql/docs/postgres) as our main database.

We are using [Hasura](https://hasura.io) as a quick and dirty backend. Hasura integrates deeply with our postgres instance, adding an automatic graphql api on top of it, with custom authorization built-in.

Finally, we also have a small API server (or cloud functions) that is used for small specific tasks as glue between services.

This setup means super fast iteration speed, excellent API performance, built-in real-time subscriptions, but its drawbacks are potential data model degradation, as we will always have a temptation to change our data model to change our API, while this is a bad idea (the presentational layer aka the APIs should be independent from the biz logic and underlying infrastructure/persistence).

Thus I recommend, at some point, completely moving away from this setup into a normal node.js server serving a graphql endpoint, custom authentication and postgres setup.

## Hasura setup

Hasura is a standalone server we have to deploy that uses postgres and its own configured access rules to automatically generage a graphql API. All schema changes to the database currently go through hasura's built in developer console. The workflow for this is the following:

1. You spin up a local hasura and postgres from a docker compose file in the backend repo
2. You work on the schema or access rules or any other conf
3. Automatically migrations are created while you do this
4. [You squash the migrations, using the hasura cli, into a single logical migration](https://hasura.io/docs/1.0/graphql/core/migrations/migrations-setup.html#step-6-squash-migrations-and-add-checkpoints-to-version-control)
5. You commit, push, get a PR review, have CI run your tests and merge the migration into prod
6. From production, our CI will deploy the latest migration onto our production server

### Working on hasura

To make changes to the hasura schema, follow these steps:

1. Run `docker-compose up` to run postgres and hasura.
2. Run `npm run dev-hasura` to start a developer console pointing at your local hasura.
3. Through the console, make changes to the hasura schema. This automatically creates migrations and metadata.
4. Write tests against your new graphql schema, in the hasura/tests directory.
5. [Squash the new migrations, using the hasura cli, into a single logical migration](https://hasura.io/docs/1.0/graphql/core/migrations/migrations-setup.html#step-6-squash-migrations-and-add-checkpoints-to-version-control)
6. Make a PR, get reviews.
7. When your PR is merged, the hasura migrations are automatically applied to production using github actions.

If hasura is not updating metadata automatically through this workflow, try wiping your local hasura setup, by running `rm -rf ~/.hasura`.

### Resources on Hasura

[Hasura](https://hasura.io/) is an opensource product that connects to your databases & services and gives you a realtime GraphQL API, instantly.

References:

- [Documentation](https://hasura.io/docs/1.0/graphql/core/index.html)

Tutorials:

- [Hasura Tutorial](https://hasura.io/learn/)
