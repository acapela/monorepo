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

## Slack integration

Setting Slack up is optional in development, but if you want to work on it you have to set-up your own Slack app.

Fortunately you can use this manifest "generator":

1. copy the code below into your favorite browser's JS console
2. replace `<YOUR-PERSONAL.local.lt-DOMAIN>` with your loca.lt domain (it's the one you see when the server starts)
3. run it, you'll now have the manifest in your clipboard
4. go to https://api.slack.com/apps?new_app=1 and use the manifest to create a new app
   1. make sure to give it a unique name and command name
5. fill out `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, `SLACK_SIGNING_SECRET` and `SLACK_SLASH_COMMAND`. in your `.env`, based on your new app's info

```javascript
copy(
  `{
    "_metadata": {
        "major_version": 1,
        "minor_version": 1
    },
    "display_information": {
        "name": "Acapela",
        "description": "End your meetings before they start.",
        "background_color": "#000000",
        "long_description": "Less Zoom fatigue. More focus with async meetings. Acapela is the next generation collaboration platform for remote and hybrid teams. Contribute to meetings when it suits you using next level video, text or voice messaging."
    },
    "features": {
        "bot_user": {
            "display_name": "Acapela",
            "always_online": true
        },
        "shortcuts": [
            {
                "name": "Turn into request",
                "type": "global",
                "callback_id": "global_acapela",
                "description": "Creates an Acapela request from a message"
            },
            {
                "name": "Create a request",
                "type": "message",
                "callback_id": "message_acapela",
                "description": "Creates a request in Acapela"
            }
        ],
        "slash_commands": [
            {
                "command": "/acapela",
                "url": "https://app.acape.la/api/backend/slack/commands",
                "description": "Create a new request",
                "usage_hint": "[message] @people",
                "should_escape": true
            }
        ]
    },
    "oauth_config": {
        "redirect_urls": [
            "https://app.acape.la/api/backend/slack/oauth_redirect"
        ],
        "scopes": {
            "user": [
                "groups:read",
                "im:read",
                "mpim:read",
                "chat:write"
            ],
            "bot": [
                "channels:read",
                "commands",
                "im:write",
                "users.profile:read",
                "users:read",
                "users:read.email",
                "chat:write"
            ]
        }
    },
    "settings": {
        "interactivity": {
            "is_enabled": true,
            "request_url": "https://app.acape.la/api/backend/slack/events",
            "message_menu_options_url": "https://app.acape.la/api/backend/slack/options"
        },
        "org_deploy_enabled": false,
        "socket_mode_enabled": false,
        "token_rotation_enabled": false
    }
}`.replaceAll("https://acape.la", "<YOUR-PERSONAL.local.lt-DOMAIN>")
);
```

### Resources on Hasura

[Hasura](https://hasura.io/) is an opensource product that connects to your databases & services and gives you a realtime GraphQL API, instantly.

References:

- [Documentation](https://hasura.io/docs/1.0/graphql/core/index.html)

Tutorials:

- [Hasura Tutorial](https://hasura.io/learn/)
