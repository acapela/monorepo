# Backend

This is backend package of our monorepo, it contains our hasura setup and API server.

## Usage

For main setup instructions check the [root readme file](../README.md).

# Architecture

## Overview

We use a [google cloud managed postgres instance](https://cloud.google.com/sql/docs/postgres) as our main database.

We are using [Hasura](https://hasura.io) as a backend. Hasura integrates deeply with our postgres instance, adding an automatic GraphQL API on top of it, with custom authorization built-in.

Finally, we also have a small API server (or cloud functions) that is used for small specific tasks as glue between services.

## Hasura setup

Hasura is a standalone server we have to deploy that uses postgres and its own configured access rules to automatically generate a GraphQL API. All schema changes to the database currently go through hasura's built in developer console. The workflow for this is the following:

1. You spin up a local hasura and postgres from a docker compose file in the backend repo by running `yarn docker:up`
2. You work on the schema or access rules or any other configuration using the hasura console (run `yarn hasura:console` to open it)
3. Automatically migrations are created while you do this
4. [You can squash the migrations, using the hasura cli, into a single logical migration](https://hasura.io/docs/latest/graphql/core/hasura-cli/hasura_migrate_squash.html)
5. You commit, push, get a PR review, have CI run your tests and merge the migration into prod
6. From production, our CI will deploy the latest migration onto our production server

### Resources on Hasura

[Hasura](https://hasura.io/) is an opensource product that connects to your databases & services and gives you a realtime GraphQL API, instantly.

References:

- [Documentation](https://hasura.io/docs/1.0/graphql/core/index.html)

Tutorials:

- [Hasura Tutorial](https://hasura.io/learn/)
