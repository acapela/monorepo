import assert from "assert";

import { gql, useQuery } from "@apollo/client";
import produce, { Draft } from "immer";
import { observer } from "mobx-react";
import React from "react";

import { getDb } from "@aca/desktop/clientdb";
import { NotificationFilterEntity, SlackMessageFilter } from "@aca/desktop/clientdb/notification/filter";
import { accountStore } from "@aca/desktop/store/account";
import { SlackUsersQuery } from "@aca/gql";
import { Button } from "@aca/ui/buttons/Button";
import { SingleOptionDropdown } from "@aca/ui/forms/OptionsDropdown/single";
import { HStack } from "@aca/ui/Stack";

const MENTION_OPTIONS = { all: {}, onlyMentions: { is_mention: true }, noMentions: { is_mention: false } };

type MentionOptionKey = keyof typeof MENTION_OPTIONS;
export const NotificationFilterForm = observer(({ listId }: { listId: string }) => {
  const hasSlackInstallation = Boolean(accountStore.user?.slackInstallation);
  const { data } = useQuery<SlackUsersQuery>(
    gql`
      query SlackUsers {
        slack_users {
          id
          display_name
          real_name
          avatar_url
        }
      }
    `,
    { skip: !hasSlackInstallation }
  );

  const slackUsers = data?.slack_users ?? [];
  const notificationFilter = getDb().notificationFilter.assertFindById(listId);

  const produceFiltersUpdate = (fn: (filter: Draft<NotificationFilterEntity["filters"]>) => void) =>
    notificationFilter.update({
      data: produce(notificationFilter.filters, fn),
    });
  const produceFilterUpdate = (i: number, fn: (filter: Draft<SlackMessageFilter>) => void) =>
    produceFiltersUpdate((filters) => {
      const filter = filters[i];
      assert(
        filter.kind == "notification_slack_message",
        `invalid filter kind ${filter.kind} at ${i} in notification_filter ${notificationFilter.id}`
      );
      fn(filter);
    });

  if (!hasSlackInstallation) {
    return null;
  }

  return (
    <div>
      From Slack include...
      {notificationFilter.filters.map((filter, i) => {
        if (filter.kind !== "notification_slack_message") {
          return null;
        }
        return (
          <HStack key={i} alignItems="center" gap={10}>
            ...
            <select
              onChange={(event) => {
                produceFilterUpdate(i, (filter) => {
                  const mentionOption = MENTION_OPTIONS[event.target.value as MentionOptionKey];
                  if ("is_mention" in mentionOption) {
                    filter.is_mention = mentionOption.is_mention;
                  } else {
                    delete filter.is_mention;
                  }
                });
              }}
            >
              {(
                [
                  ["all messages", "all"],
                  ["only mentions", "onlyMentions"],
                  ["all messages except mentions", "noMentions"],
                ] as [string, MentionOptionKey][]
              ).map(([label, value]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {" from "}
            <SingleOptionDropdown
              items={slackUsers}
              keyGetter={(user) => user.id}
              labelGetter={(user) => user.real_name ?? user.display_name}
              selectedItem={slackUsers.find((user) => user.id === filter.slack_user_id)}
              onChange={(selected) =>
                produceFilterUpdate(i, (filter) => {
                  filter.slack_user_id = selected.id;
                })
              }
              placeholder="Everyone"
            />
            <Button
              onClick={() => {
                produceFiltersUpdate((filters) => {
                  delete filters[i];
                });
              }}
            >
              Delete Filter
            </Button>
          </HStack>
        );
      })}
      <br />
      <Button
        onClick={() =>
          produceFiltersUpdate((filters) => {
            filters.push({ kind: "notification_slack_message" });
          })
        }
      >
        Add Filter
      </Button>
    </div>
  );
});
