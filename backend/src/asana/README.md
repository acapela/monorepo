# Asana Integration

## Setup

[Setup instruction in the main README.md](https://github.com/weareacapela/monorepo#asana)
[Asana API Docs](https://developers.asana.com/docs)

## Discoveries

1. Webhooks can only be created for projects and not workspaces. (not sure if it could work using filters, needs further investigation)
2. Every user has their own webhook endpoints (not shared between users like with GitHub).
3. A single change might cause multiple events. (e.g. a task is moved from Done to In Progress, this will add a log entry to the changelog (story) of the task)
4. Types of `@types/asana` are not complete. (hence the annoying any type)
5. Refreshing the access tokens is handled by the client library, but they are not updated in the database. (and we probably don't have to? not sure about the implications)
