# Backend

This is our main backend repository, it contains our hasura setup and API server.

## Usage

After cloning, run `npm install` to install the dependencies. After that, use `docker-compose up` to spin up your local hasura and postgres instance to work with.

Use `npm run test:watch` to start running tests.

To successfully use firebase auth locally, you need to have credentials to the service account of the firebase instance. Head [here](https://console.cloud.google.com/iam-admin/serviceaccounts/details/105485369863137256806?authuser=0&project=meetnomoreapp) to get a new key. Store this in a json file, and then add the path of it to an environment variable called `GOOGLE_APPLICATION_CREDENTIALS`. For example, `GOOGLE_APPLICATION_CREDENTIALS=/Users/uku.tammet/Projects/acapela/auth-credentials.json`, if I saved the key file in that location with that name. Obviously, these are secret, you should safeguard them and never commit them.

# Architecture

## Overview

We use a [google cloud managed postgres instance](https://cloud.google.com/sql/docs/postgres) as our main database.

We are using [Hasura](https://hasura.io) as a quick and dirty backend. Hasura integrates deeply with our postgres instance, adding an automatic graphql api on top of it, with custom authorization built-in.

We are using [firebase auth](https://firebase.google.com/docs/auth) as our quick and dirty authentication provider.

Finally, we also have a small API server (or cloud functions) that is used for small specific tasks as glue between services, for example to integrate firebase auth and hasura.

This setup means super fast iteration speed, excellent API performance, built-in real-time subscriptions, but its drawbacks are vendor lock-in (to firebase auth), and potential data model degradation, as we will always have a temptation to change our data model to change our API, while this is a bad idea (the presentational layer aka the APIs should be independent from the biz logic and underlying infrastructure/persistence). In addition, as we rely on firebase auth we cannot get maximum performance using server rendering, as we have to have lots of client-side logic to interact with firebase.

Thus I recommend, at some point, completely moving away from this setup into a normal node.js server serving a graphql endpoint, custom authentication and postgres setup.

## Hasura setup

Hasura is a standalone server we have to deploy that uses postgres and its own configured access rules to automatically generage a graphql API. All schema changes to the database currently go through hasura's built in developer console. The workflow for this is the following:

1. You spin up a local hasura and postgres from a docker compose file in the backend repo
2. You work on the schema or access rules or any other conf
3. Automatically migrations are created while you do this
4. [You squash the migrations, using the hasura cli, into a single logical migration](https://hasura.io/docs/1.0/graphql/core/migrations/migrations-setup.html#step-6-squash-migrations-and-add-checkpoints-to-version-control)
5. You commit, push, get a PR review, have CI run your tests and merge the migration into prod
6. From production, our CI will deploy the latest migration onto our production server

### Hasura authentication through firebase

Hasura's authentication can work in [two ways](https://hasura.io/docs/1.0/graphql/core/auth/authentication/index.html):

1. [With webhooks](https://hasura.io/docs/1.0/graphql/core/auth/authentication/webhook.html) - here, upon every request to hasura, hasura does a separate request to an authentication server, to validate the token, get role information etc
2. [With a JWT](https://hasura.io/docs/1.0/graphql/core/auth/authentication/jwt.html) - here, requests to hasura must be done with a JWT that already has hasura-specific information (user id, role information) in the JWT's claims. All hasura needs is the ability to validate the signed JWT, which is [pretty easily configured](https://hasura.io/docs/1.0/graphql/core/auth/authentication/jwt.html#configuring-jwt-mode).

We have decided to use JWT method, as Firebase authentication mints JWT tokens that we can make hasura validate. The only piece of complexity here is that we have to add **[custom claims to the firebase tokens](https://firebase.google.com/docs/auth/admin/create-custom-tokens#node.js_2)**, to indicate the ID of the user and their role.

Thus, the sign in / sign up flow is the following 3-step process:

#### 1. The client authenticates or registers through firebase

[Using normal firebase client auth,](https://firebase.google.com/docs/auth) meaning we can very easily and quickly integrate new providers, etc. The client gets a **firebase token**, which is a jwt, from this.

#### 2. We enhance the firebase token

Any time the client authenticates, they should parse it themselves, and check if the **hasura claims are set up correctly**, if not (which is always the case when they first log in, checking every time is a robustness mechanism to not end up in a broken state), they need to call our **API server (or cloud functions)**, passing the firebase auth token.

In this endpoint, we first [validate their firebase token](https://firebase.google.com/docs/auth/admin/verify-id-tokens), then find (or create) the corresponding user in our postgres database. We also fetch the user's roles. Using this info, we **set custom claims** on the firebase auth token, [using the `setCustomClaims` firebase method.](https://firebase.google.com/docs/auth/admin/custom-claims) We need to set _at least_ the following claims, but can set whatever claims we need in order to do authz in hasura:

`x-hasura-user-id`, which is our own id of the user. This will be used in hasura to run authorization checks (can user X access data Y)

`x-hasura-default-role`: every graphql request to hasura can include a "role" header. This claim is used when a role is not provided in the header. Essentially this is used so that one user with multiple roles can decide which role they want to make a request as. We will probably use the default role ("user" probably) for most requests.

`x-hasura-allowed-roles`: a list of roles this user can act as, so that when they provide a role as a header, hasura will validate against this list. In our case, it will in most cases probably be a singular "user", with us also having the "admin" role available if we want.

#### 3. We refresh the token on the client

When the request the client did on point number 2 is done, the client has to [force refresh their authentication](https://firebase.google.com/docs/auth/admin/custom-claims#propagate_custom_claims_to_the_client) with firebase, to retreive the new token from firebase that has our custom claims. Once this is done, the process is done and the client can start calling our hasura graphql endpoint, with their firebase token in the `Authorization` header as normal `Bearer` authentication.

Helpful graph of Dave, a customer building the next big thing, using Acapela to collaborate:

![image](https://user-images.githubusercontent.com/9271565/93019908-aea9d080-f5e2-11ea-950e-8c25ab7f3a3c.png)

### Anonymous users

We will for sure need functionality for which you don't need to log in. The way hasura authentication works, we still need to issue a valid JWT for these customers, with hasura claims. For this, we will do something similar as we did for authenticated users:

1. [Sign in anonymously using firebase auth (customer doesn't need to do anything)](https://firebase.google.com/docs/auth/web/anonymous-auth), we get a JWT again
2. Call a new custom endpoint of ours on our api server (for example, /visitors), we validate the token again and set custom claims. This time we might not create a user in our db, and we will set a custom role for these users ("visitor", for example), on the hasura claims
3. Client refreshes authentication, starts calling hasura as before. We have custom authorization rules for the visitor role configured in hasura that give them very limited access.

We can also turn these anonymous users into full users later, using a [specific firebase mechanism](https://firebase.google.com/docs/auth/web/anonymous-auth#convert-an-anonymous-account-to-a-permanent-account) plus probably another endpoint on our side.
