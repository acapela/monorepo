import { gql, useQuery } from "@apollo/client";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { apolloClient } from "@aca/desktop/apolloClient";
import { slackIntegrationClient } from "@aca/desktop/domains/integrations/slack";
import { SlackConversationsQuery, SlackConversationsQueryVariables, SlackUsersQuery } from "@aca/gql";
import { getIsValueMatchingFilter } from "@aca/shared/filters";
import { isPlainObjectEqual } from "@aca/shared/isPlainObjectEqual";
import { typedKeys } from "@aca/shared/object";
import { updateValue } from "@aca/shared/updateValue";
import { MultipleOptionsDropdown } from "@aca/ui/forms/OptionsDropdown/multiple";
import { SingleOptionDropdown } from "@aca/ui/forms/OptionsDropdown/single";

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

    useEffect(() => {
      querySlackConversations().then(setSlackConversations);
    }, []);

    async function handleDropdownOpen() {
      setSlackConversations(await querySlackConversations());
    }

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
        onOpen={handleDropdownOpen}
        onChange={onChange}
      />
    );
  }
);

export const FilterEditorSlack = observer(({ filter, onChange }: Props) => {
  const slackUsers = useSlackUsers();

  return (
    <UIHolder>
      <FilterSettingRow title="Conversation type">
        <MultipleOptionsDropdown
          placeholder="All Conversations"
          items={slackConversationTypes}
          keyGetter={(type) => type}
          labelGetter={(type) => slackConversationTypeLabels[type]}
          selectedItems={slackConversationTypes.filter((type) =>
            getIsValueMatchingFilter(filter.conversation_type, type)
          )}
          onChange={(types) => {
            onChange(
              updateValue(filter, (filter) => {
                if (types.length === 0) {
                  delete filter.conversation_type;
                } else {
                  filter.conversation_type = { $in: types };
                }
              })
            );
          }}
        />
      </FilterSettingRow>
      <FilterSettingRow title="Conversations">
        <SlackConversationsDropdown
          checkSelected={(id) => getIsValueMatchingFilter(filter.slack_conversation_id, id)}
          onChange={(channels) => {
            onChange(
              updateValue(filter, (filter) => {
                if (channels.length === 0) {
                  delete filter.slack_conversation_id;
                } else {
                  filter.slack_conversation_id = { $in: channels.map((c) => c.id) };
                }
              })
            );
          }}
        />
      </FilterSettingRow>
      <FilterSettingRow title="Message type">
        <SingleOptionDropdown<NotificationFilterOption<SlackFilter>>
          items={slackNotificationTypeOptions}
          keyGetter={(option) => option.label}
          labelGetter={(option) => option.label}
          selectedItem={slackNotificationTypeOptions.find((option) => option.isActive(filter))}
          onChange={(option) => {
            onChange(updateValue(filter, option.updater));
          }}
        />
      </FilterSettingRow>
      <ServiceUsersFilterRow<SlackFilter>
        integrationClient={slackIntegrationClient}
        users={slackUsers}
        filter={filter}
        field="slack_user_id"
        onChange={onChange}
      />
      <FilterSettingRow title="Threads">
        <SingleOptionDropdown<NotificationFilterOption<SlackFilter>>
          items={slackThreadedOptions}
          keyGetter={(option) => option.label}
          labelGetter={(option) => option.label}
          selectedItem={slackThreadedOptions.find((option) => option.isActive(filter))}
          onChange={(option) => {
            onChange(updateValue(filter, option.updater));
          }}
        />
      </FilterSettingRow>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
