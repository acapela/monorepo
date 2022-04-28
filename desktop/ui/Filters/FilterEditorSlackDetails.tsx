import { gql, useQuery } from "@apollo/client";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { apolloClient } from "@aca/desktop/apolloClient";
import { slackIntegrationClient } from "@aca/desktop/domains/integrations/slack";
import { SlackConversationsQuery, SlackConversationsQueryVariables, SlackUsersQuery } from "@aca/gql";
import { getFilterValueAllowedValues } from "@aca/shared/filters";
import { isPlainObjectEqual } from "@aca/shared/isPlainObjectEqual";
import { isNotNullish } from "@aca/shared/nullish";
import { typedKeys } from "@aca/shared/object";
import { updateValue } from "@aca/shared/updateValue";
import { MultipleOptionsDropdown } from "@aca/ui/forms/OptionsDropdown/multiple";

import { ServiceUsersFilterRow } from "./ServiceUsersFilterRow";
import { NotificationFilterKind, NotificationFilterOption } from "./types";
import { FilterSettingRow, getWorkspaceLabel } from "./utils";

type SlackFilter = NotificationFilterKind<"notification_slack_message">;
interface Props {
  filter: SlackFilter;
  onChange: (filter: SlackFilter) => void;
}

export const slackConversationTypeLabels = {
  im: "DMs",
  mpim: "Groups",
  group: "Private Channels",
  channel: "Channels",
};
export const slackConversationTypes = typedKeys(slackConversationTypeLabels);

export const slackNotificationTypeOptions: NotificationFilterOption<SlackFilter>[] = [
  {
    label: "All messages",
    updater: (filter) => {
      delete filter.is_mention;
    },
    isActive: (filter) => filter.is_mention === undefined,
  },
  {
    label: "Only mentions",
    updater: (filter) => (filter.is_mention = true),
    isActive: (filter) => filter.is_mention === true,
  },
];

export const slackThreadedOptions: NotificationFilterOption<SlackFilter>[] = [
  {
    label: "With threads",
    updater: (filter) => {
      delete filter.slack_thread_ts;
    },
    isActive: (filter) => filter.slack_thread_ts === undefined,
  },
  {
    label: "Without threads",
    updater: (filter) => {
      filter.slack_thread_ts = null;
    },
    isActive: (filter) => filter.slack_thread_ts === null,
  },
  {
    label: "Only threads",
    updater: (filter) => {
      filter.slack_thread_ts = { $not: null };
    },
    isActive: (filter) => isPlainObjectEqual(filter.slack_thread_ts, { $not: null }),
  },
];

function useSlackUsers() {
  const { data } = useQuery<SlackUsersQuery>(
    gql`
      query SlackUsers {
        slack_users {
          workspace_id
          id
          display_name
          real_name
          avatar_url
        }
      }
    `
  );

  return data?.slack_users ?? [];
}

export async function querySlackConversations() {
  const { data } = await apolloClient.query<SlackConversationsQuery, SlackConversationsQueryVariables>({
    query: gql`
      query SlackConversations {
        slack_conversations {
          workspace_id
          id
          name
          is_private
        }
      }
    `,
    fetchPolicy: "no-cache",
  });
  return data?.slack_conversations ?? [];
}

export const SlackConversationsDropdown = observer(
  ({
    checkSelected,
    onChange,

    className,
    placeholder,
  }: {
    checkSelected: (id: string) => boolean;
    onChange: (conversations: SlackConversationsQuery["slack_conversations"]) => void;

    className?: string;
    placeholder?: string;
  }) => {
    const [slackConversations, setSlackConversations] = useState<SlackConversationsQuery["slack_conversations"]>([]);

    async function updateConversations() {
      querySlackConversations().then(setSlackConversations);
    }

    useEffect(() => {
      updateConversations();
    }, []);

    return (
      <MultipleOptionsDropdown<typeof slackConversations[number]>
        className={className}
        placeholder={placeholder ?? "All"}
        items={slackConversations}
        keyGetter={(channel) => channel.id}
        labelGetter={(channel) =>
          (channel.is_private ? "🔒" : "#") +
          channel.name +
          getWorkspaceLabel(slackIntegrationClient, channel.workspace_id)
        }
        selectedItems={slackConversations.filter(({ id }) => checkSelected(id))}
        onOpen={updateConversations}
        onChange={onChange}
      />
    );
  }
);

function pickConversationIds(filter: SlackFilter) {
  if (!filter.$or) return [];

  for (const orPart of filter.$or) {
    if (!orPart.slack_conversation_id) {
      continue;
    }

    return getFilterValueAllowedValues(orPart.slack_conversation_id);
  }

  return [];
}

function pickPeopleIds(filter: SlackFilter) {
  if (!filter.$or) return [];

  for (const orPart of filter.$or) {
    if (!orPart.slack_user_id) {
      continue;
    }

    return getFilterValueAllowedValues(orPart.slack_user_id).filter(isNotNullish);
  }

  return [];
}

function updateConversationIds(filter: SlackFilter, ids: string[]): SlackFilter {
  return updateValue(filter, (filter) => {
    if (!filter.$or) {
      filter.$or = [{ slack_conversation_id: { $in: ids } }];
      return filter;
    }

    for (const orPart of filter.$or) {
      if (orPart.slack_conversation_id) {
        orPart.slack_conversation_id = { $in: ids };
        return filter;
      }
    }

    filter.$or.push({ slack_conversation_id: { $in: ids } });
  });
}

function updatePeopleIds(filter: SlackFilter, ids: string[]): SlackFilter {
  return updateValue(filter, (filter) => {
    if (!filter.$or) {
      filter.$or = [{ slack_user_id: { $in: ids } }];
      return filter;
    }

    for (const orPart of filter.$or) {
      if (orPart.slack_user_id) {
        orPart.slack_user_id = { $in: ids };
        return filter;
      }
    }

    filter.$or.push({ slack_user_id: { $in: ids } });
  });
}

export const FilterEditorSlackDetails = observer(({ filter, onChange }: Props) => {
  const slackUsers = useSlackUsers();

  const selectedUserIds = pickPeopleIds(filter);
  const selectedConversations = pickConversationIds(filter);

  return (
    <UIHolder>
      <FilterSettingRow title="Channels">
        <SlackConversationsDropdown
          checkSelected={(id) => selectedConversations.includes(id)}
          onChange={(channels) => {
            onChange(
              updateConversationIds(
                filter,
                channels.map((c) => c.id)
              )
            );
          }}
        />
      </FilterSettingRow>

      <ServiceUsersFilterRow
        integrationClient={slackIntegrationClient}
        users={slackUsers}
        selectedUsers={slackUsers.filter((user) => selectedUserIds.includes(user.id))}
        onChange={(users) => {
          onChange(
            updatePeopleIds(
              filter,
              users.map((u) => u.id)
            )
          );
        }}
      />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
