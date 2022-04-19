# Atlassian Integration Docs

The Jira integration includes a lot of moving parts and a lot of Atlassian internal to make it work.

The integration consists in these major parts:

- Creating an `Atlassian 3LO (oAuth2) App` with Acapela
- Allowing users to Authorize into this app through Acapela
- Using the user`s oauth credentials to create and maintain atlassian webhooks
- Capture webhooks and create Acapela notifications

This all sounds easy so far! Let's start from the beginning then.

## Creating an `Atlassian oAuth2 App` with Acapela

You can create a new Atlassian app in `https://developer.atlassian.com/`. You should specify that its a 3LO app
(which is basically the same thing as an oAuth2 app).

You can get additional information about configuring this app in the monorepo's README file, under `### Atlassian Jira`.

The app as it is only allows your own atlassian account to be authorized. This is because the `Distribution` of this app
is set to `Not sharing` at this moment. If you need to test something that requires multiple accounts
(as it's needed for webhook management), you'll need to set the distribution status as `Sharing` and provide a
`privacy policy`.

## Allowing users to Authorize into this app through Acapela

We're currently using [NextAuth.js](https://next-auth.js.org/providers/atlassian) to provide all of the authorization
nit-picks with Atlassian. The flow is pretty straightforward:

1. Users are directed to the frontend path: `/auth/sign-in?provider=atlassian`
2. This page will trigger nextAuth's atlassian authentication flow
3. User's will need to select the `AtlassianSite` they like to link (e.g acapela-team.atlassian.net)
4. User's are then redirected to `/auth/success` where the whole flow ends

When this process finishes, `NextAuth.js` will create a new entry in the `account` table. This will include _atlassian_
as `account.provider_id` and the Atlassian's `user_id`/`account_id` will be in `account.provider_account_id`.

! Quirks:
The `account.access_token` given by atlassian has a very limited lifespan. It only lasts 1 hour. Because of this, api
calls to atlassian must check if the `account.access_token_expires` has been reached, and use the provided `account.refresh_token`
to get a new access_token.

!Quirks:
Refresh tokens have a longer, but also limited shelf life. How long they stay alive is dynamic, and the conditions
for this are found [here](https://developer.atlassian.com/cloud/jira/service-desk/oauth-2-authorization-code-grants-3lo-for-apps/#use-a-refresh-token-to-get-another-access-token-and-refresh-token-pair).
We have some cron job that attempts to get a new `refresh_token` every 90 days, so that users's don't need to go
through the auth flow again.

## Using the user`s oauth credentials to create and maintain atlassian webhooks

This is by far the most complicated part of this integration. So please, update this doc if you learn something new
and the an explanation provided is wrong or insufficient <3.

The whole flow begins with a `hasura event` when a new `account` is created. You can look for `handleAccountUpdates`,
but please look at this file for reference of what's coming up next.

### Atlassian Sites and Cloud Id's

An `AtlassianSite` is very similar to what we know as a "Slack Workspace" or a "Notion Space". It basically contains
a bunch of Atlassian products that a group has access to, this group is usually a company. An atlassian site has a `name`
(Acapela Team), a `url` (https://acapela-team.atlassian.net), and an `id`. We'll be referring to `AtlassianSite` id's as
`cloud_id`, `jira_cloud_id`, etc interchangeably.

Atlassian Site `cloud_id`s are needed to make any API call to jira. API endpoints will look like this:

- `https://api.atlassian.com/ex/jira/${cloud_id}`

The first thing to consider is that one atlassian user can belong to many different sites. Within the auth flow
they'll need to select which site they want to authorize. They can only do "one site at a time".

!Quirks:
"one site at a time"... wait a second! There are some cases in which Atlassian can provide access to 2 or more sites using
the same `account.access_token`. Basically, if a user attempts to re-auth and selected a new site, they'll have access
to the sites they previously authed in. They'll only have 1 access_token at most. The way this works is explained [here](https://developer.atlassian.com/cloud/jira/service-desk/oauth-2-authorization-code-grants-3lo-for-apps/#site-scoped-grants-limitations)

The auth flow doesn't show us which atlassian sites the user's `account.access_token` has access to. We need
to get this information directly through: https://developer.atlassian.com/cloud/jira/service-desk/oauth-2-authorization-code-grants-3lo-for-apps/#3-1-get-the-cloudid-for-your-site.
The whole way of determining the site ids is a quirky hodge-podge.

### Introducing Atlassian Webhooks

Webhook API Reference: https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-webhooks/

Now here comes the fun part! There's quite a few limitations to webhooks that you should know about:

- Only 1 webhook callback url can be created per app (trust me with this one and avoid future headaches)
- Webhooks can only target 1 Atlassian Site at a time
- Webhooks registered by one user can't be access by another user, or the app itself. This means, that if you create a
  webhook with an `account.access_token`, this webhook will firing until the that same `account.access_token` removes the webhook.
- There's no way to see how many webhooks were created for the whole atlassian app, no way to see how many webhooks
  were created for an Atlassian site, no way to see webhooks created by other users.
  We only have access to webhooks that are created by the same `account.access_token`.
- Webhooks _need_ to have a jql query field. We currently had to hack our way around this
- Webhooks expire after 30 days

Alright, we got that out of the way. Now let's talk about the webhooks that we created:

```
  webhooks: [
    {
      events: ["comment_created", "comment_updated"],
      // This is a fake filter that allows us to get most things
      jqlFilter: "issueKey != NULL-5",
    },
    {
      events: ["jira:issue_created", "jira:issue_updated"],
      // This is a fake filter that allows us to get most things
      jqlFilter: "issueKey != NULL-5",
    },
  ],
```

!Quirks
You'll notice that we have `jqlFilter: "issueKey != NULL-5",`. This is a hack and a workaround. It's basically telling
Jira to get events from every Issue that doesn't have the key `NULL-5`. This code will break only when a team creates
a Project with prefix `NULL` and issue id `5`. I think there's very very low chance that this will happen, and we can
give a special Acapela award to whoever makes a bug report <3.

!Quirks
Why did we create 2 entries in the webhooks field instead of only one with all 4 events? Well, the simple answer is that
stuff didn't work with only having 1 webhook with 4 events. No error. No reason given. Just...simply...no...webhooks...received.
With trial and error, we figured out that we need to have a set of 2 individual webhooks.

There's also other elements here like "events", etc. You can see which supported events are there [here](https://developer.atlassian.com/cloud/jira/platform/webhooks/#registering-a-webhook-using-the-rest-api--for-connect-and-oauth-2-0-apps-).

When you register webhooks, the API will return something like this:

```
{
  "webhookRegistrationResult": [
    {
      "createdWebhookId": 1000
    },
    {
      "errors": [
        "The clause watchCount is unsupported"
      ]
    },
    {
      "createdWebhookId": 1001
    }
  ]
}
```

!Quirks:
There's a few pitfalls here! That "createdWebhookId" is only `unique for that user in that atlassian site`. These are not
global identifier! And remember, they can't be accessed by anyone other than the user that created them.

!!Pitfalls:
If you're here because some webhooks are not being received. It could be the case of a very very old webhook that was not
properly deleted and eventually just expired. If that's the case, you may need to have the user re-auth into jira.

### Receiving a webhook

When we receive a callback to our webhook, we can get a payload that is related to the event that was triggered, i.e an
`jira:issue_created` event will bring a payload that's related to an `Issue` type.

```
type JiraWebhookResult<AtlassianEventType> =  WebhookPayload<AtlassianEventType> & {
  webhookEvent: AtlassianEventType;

  issue_event_type_name: IssueEventTypeName;
  changelog: Changelog;

  matchedWebhookIds: number[];

  timestamp: number; // 1646076066182
}
```

`matchedWebhookIds` seemed to be a way to identify the user that created this webhook.
BUT NOT REALLY! This is a massive pitfall. `webhookIds` are not globally unique. We also have no information about which
atlassian account id does this webhook callback belongs to. There's no clear field saying the Atlassian Site `cloud_id`
that this event generated from.

The only indication is within nested fields that give us a self reference to some of the Jira Entities, like:
`payload.issue.self => "https://alepaca.atlassian.net/rest/api/2/10035"`

In this case `https://alepaca.atlassian.net` is the Atlassian Site's `url`. Perhaps we can use it as an identifier!?
Well yes, we ended using that as an identifier.

This all starts becoming a bit of a 💩 show. So we had to make a very specific way of managing webhooks.
More about it in _Managing webhooks_.

### Capturing and Creating Acapela Notifications

Creating new acapela notifications is based on the `issue.watchers`. This appears in the UI as the "eye" icon right above
the issue.

This basically means that if a jira event happens and an acapela user is watching that issue,then a new acapela notification
is created.

The only quirk with this that the `watchers` array is not provided by the issue payload, and we need to make an api call
to get the watchers of that issue.

### Managing webhooks

Phew. Here comes the (ethical) meaty part. Now that we know how to create a webhook, what do we do with it?

Let's start with introducing 3 new entities:

**atlassian_site**
This one includes information about the `atlassian_site`. We include 2 very important things here. The atlassian site's
`cloud_id`, and the site's `url`.

- Remember how a received webhook payload that included "https://alepaca.atlassian.net" in some of it fields?
  That url will be used to refer to this specific `atlassian_site`
- Remember how you need the Atlassian Site's `cloud_id` to make API requests?
  Well, now this entity allows us to get a `cloud_id` given a `url`. This becomes very useful for getting issue watchers.

**jira_account**
How do we know if a user has access to a specific Atlassian site? With this join table of course.
This table is populated every time the user goes through the Atlassian Auth flow, and an `account` with an
`atlassian` as its `account.provider_id` is created.

**jira_webhook**
We should ONLY CREATE ONE SET OF WEBHOOKS PER ATLASSIAN SITE. If we create multiple set of webhooks, we'll receive duplicate notifications.
And since Atlassian, is atlassian... we need to manage this whole process ourselves.

Now it's a good time to scroll back to _Introducing Atlassian Webhooks_ and look at the limitations once more. You'll
quickly realize that we need a single user that acts as the _owner_ for the webhooks in the atlassian site that she
belongs to.

This owner should be able to:

- Refresh their webhooks when needed (after 30 days)
- Delete their webhooks when they disconnect from Jira (and we have a system in place to replace this user when that happens)

--

I think it's best to explain what happens with the auth flow by simulating how a few users interact with the app

1. An Acapela user is the first person to connect their company's Jira account

Hurray! We got the first use for Atlassian's "Cool Company" Site. It has a url of `https://cool-company.atlassian.net`.

Since this is the first person to link "Cool Company"'s jira site, a new `atlassian_site` entity is created.

As with everyone else, a new `jira_account` is created. This way we know that the `user`'s `account` is related
to "Cool Company"'s `atlassian_site`

We also realize that there are no webhooks created for this site. This can't be! This whole thing won't work without webhooks.
For this case, the user will become the owner of 2 `jira_webhook`s (1 for issue events, 1 for comment events). Both
of these `jira_webhook`s are pointing to their `jira_account` which in turn point to an `atlassian_site`. That way we know
if an `atlassian_site` has webhooks or not.

Good so far?

2. The second person in "Cool company" links Jira in Acapela

🚀🚀🚀 Hell yeah! We've gone viral. We already got multiple users in the same company!!

For this case:

We won't create a new `atlassian_site`, as the first user already created one for us.

As with everyone else, a new `jira_account` is created.

We also realize that there are already are webhooks created for this site. So that's it. The user sits back and expects
notifications to come. No need to own any of those webhooks.

3. The first person from "Cool company" disconnects Jira in Acapela

Well, this person just had it with Jira. He decided that his team is going to use Linear, and if someone wants him
to look at a Jira Issue, they can just ping him in Slack. They proceed to click on "Disconnect" for Jira.

This whole process starts by DELETEing that user's `account` where `atlassian` is `account.provider_id`.

Oh wait. But don't we have to delete some webhooks? Oh Yes, we do.

`account`, `jira_account` and `jira_webhook` have a delete cascade strategy. So, by deleting an `account`, the rest of
the entities will also be deleted.

We also added a hasura event for `account` DELETE actions. When we get that event:

We'll delete the user's webhooks in atlassian.

- !Remember: No one else but the user can delete their own webhooks. We'll
  still be using the `account.access_token` that was provided from the hasura event.

We'll check if there are more users that have "Cool Company" as their atlassian site. And yes, the second user is still there.

The second user will now register fresh webhooks in Jira for the "Cool Company". And she will then store those registered
webhooks in `jira_webhook`.

The whole process ends, and **no one** lives happily ever after because they still need to be using Jira.

The End... ?
