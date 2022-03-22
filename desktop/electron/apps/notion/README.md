# Notion Notification Capturing

Hello friends. And welcome to the magical world of notion capturing.

This is by far, the hackiest place in the codebase. Not because of bad engineering,
but because all of it is based on reverse-engineering. So we've basically had to
play a detective game to figure out the notion API!

## Notion's data structure

I think a very good intro to what you're going to see can already be seen in the browser.

So first task for you is to open notion in your favorite browser.
Open up your dev tools and your network.
And now... click on 'All Updates' in Notion's sidebar.

What you'll see is a call to `https://www.notion.so/api/v3/getNotificationLog`.
And what you'll get back is a `recordMap`.

This API call is the core of Notion's capturing process. If you play around with this
massive object. You'll see exposed a few of the design decisions that notion made
when designing this API. As you will see, notion decided not to make a all-encompasing
notification entity... but instead, returns all of the entities that make a notification.

You can explore the return of this method a bit more by looking into the `notion/types`.

I haven't completely deduced the scope or borders of responsibility of each of these
entities, but I will try to explain the main ones that I've found in the `recordMap`.

> notification

This one is the source entity for a notification. The list items in the `All updates` will
be primarily composed by the `notification` entity.

The notification will primarily be composed of 3 parts:

- notification type ("user-mentioned" | "commented" | "user-invited" | "reminder", etc)
- State of the notification (read/ unread, etc)
- What content element is the target of this notification? (`space`, `block`, `collection`, etc)
- The `activity` event that generated this notification (who done it? what changed?)

> activity

The activity is the second most important part of a notion notification. An activity
is similar to an event log. It basically defines a change that happened somewhere,
who has done it, and where.

The main difference between an activity and a notification, is that an activity's data shape
is different for each activity type.

In the majority of cases, most of the data that we need to build an `Acapela Notification` can be found in Notion's `activity` entity.

You can take a closer look at this in `notion/types`

> block

The block is usually the target content where the notification happened. In many cases
this is a notion page (see `navigable_block_id`).

### Last words about this recordMap object

The recordMap object may seem to include everything we need at all times, but you must really consider that the exception
is the rule here. One very hard lesson I learned is that it's almost impossible to cover all of the different
corner cases and niche ways that notion has on handling their complex data structures.

So:

- Always have null checks (even if it seems that they're not needed)
- Always catch errors and display them on Sentry (it'll be easier to fix this way)
- Don't trust what you've always seen. Repeat the previous 2 things.

## Managing spaces

A "Space" is an umbrella for of notion's collections and pages. It's like a slack "workspace".
Whole companies will work within one space.

The main reason we're bringing spaces up, is that we can only get notification for one space at
a time. But since we want to give our user's a universal inbox experience, we actually extract
notifications from many spaces.

Spaces also come with their own quirks (remember, this is notion we're talking about).

A user can be either a guest or a member of a space, and there are different APIs for each
of these cases 🤦.

The good news is that the rest endpoint that returns notifications works the same regardless if a user
is a guest for that space or not.

Now, that we know which spaces the user is a member of. How do we manage that?

So far, it's done through a combination of bridges and database tables.

Bridges:

- notionAvailableSpacesValue
- notionSelectedSpaceValue

Tables:

- notion_space (name of space is most important here)
- notion_space_user (tells us if user is part of space, and if space is_sync_enabled (user will get notifications for space)).

The way we update and interconnect all of these things is complex and has gotten us some big bugs before. So good to keep
and strick eye on this.

There's a few business rules here:

- When capturing starts or notion is connected, the `notion_space` entities are created for spaces that don't exist
- When capturing starts or notion is connected, all of the user's `notion_space_user` are enabled for sync for the ones that don't exist.
- When a `notion_space_user` is added, the `notionSelectedSpaceValue` is updated (clientdb entity event)
- When a `notion_space_user.is_sync_enabled` is updated, the notionSelectedSpaceValue is updated (clientdb entity event)
- When the app starts and both the `main` and `renderer` thread are ready to start "Consolidation" (more on this later) then:
  - `notionSelectedSpaceValue` and `notionAvailableSpacesValue` get updated with the values from `notion_space_user`

A lot of what's happening here happens within the following files:

- ServiceWorkerConsolidation
- notion/worker.ts
- auth/notion.ts
- clientdb/notification/notion/notionSpaceUser
- domains/integrations/NotionSettings.tsx

## Service Worker Consolidation

All of the notion (and figma) capturing happens in the `main` thread. However, we'd like to convert these things
into `notification` entities and stored them in our db. Our current approach is sending these notifications over to
the `render` thread and use the `clientdb` infrastructure to save and consolidate the data.

What do we mean by consolidation?
It means that we need to decide which notifications get saved, which doesn't, or which get updated. So a lot of the
business logic related to "Does this notification get created?" happens in this consolidation stage.

How it works:

- Capturing `worker` file in the `main` thread creates partials of `notification` and `notionNotification` (more on these entities later)
- The `worker` sends the partial of the the worker consolidation process using the `notionSyncPayload` bridge
- The consolidation process only saves notifications that are not yet existing and that are not \*old
- The consolidation process creates a `notification` and the remaining notion sub-entities.

## Acapela Notion Entities

```
                                        ---> `notification_notion_user_mentioned`
                                      /
`notification` -> `notification_notion` ---> `notification_notion_commented`
                                      \
                                        ---> `notification_notion_user_invited`
```

The `notification_notion` entity lives in the `notion/baseNotification` file.
It includes common attributes for child notifications.
