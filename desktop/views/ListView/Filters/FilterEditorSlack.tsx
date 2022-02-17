import React from "react";
import styled from "styled-components";

import { useSlackUsers } from "@aca/desktop/domains/slack/useSlackUsers";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { getIsValueMatchingFilter } from "@aca/shared/filters";
import { isPlainObjectEqual } from "@aca/shared/isPlainObjectEqual";
import { typedKeys } from "@aca/shared/object";
import { updateValue } from "@aca/shared/updateValue";
import { MultipleOptionsDropdown } from "@aca/ui/forms/OptionsDropdown/multiple";
import { SingleOptionDropdown } from "@aca/ui/forms/OptionsDropdown/single";

import { ServiceUsersFilterRow } from "./ServiceUsersFilterRow";
import { NotificationFilterKind, NotificationFilterOption } from "./types";

type SlackFilter = NotificationFilterKind<"notification_slack_message">;
interface Props {
  filter: SlackFilter;
  onChange: (filter: SlackFilter) => void;
}

export const slackConversationTypeLabels = {
  im: "Direct Message",
  mpim: "Group Message",
  group: "Private Channel",
  channel: "Channel",
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

export function FilterEditorSlack({ filter, onChange }: Props) {
  filter.conversation_name;

  const slackUsers = useSlackUsers();

  return (
    <UIHolder>
      <SettingRow title="Conversation type">
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
      </SettingRow>
      <SettingRow title="Message type">
        <SingleOptionDropdown<NotificationFilterOption<SlackFilter>>
          items={slackNotificationTypeOptions}
          keyGetter={(option) => option.label}
          labelGetter={(option) => option.label}
          selectedItem={slackNotificationTypeOptions.find((option) => option.isActive(filter))}
          onChange={(option) => {
            onChange(updateValue(filter, option.updater));
          }}
        />
      </SettingRow>
      <ServiceUsersFilterRow<SlackFilter>
        users={slackUsers}
        filter={filter}
        field="slack_user_id"
        onChange={onChange}
      />
      <SettingRow title="Threads">
        <SingleOptionDropdown<NotificationFilterOption<SlackFilter>>
          items={slackThreadedOptions}
          keyGetter={(option) => option.label}
          labelGetter={(option) => option.label}
          selectedItem={slackThreadedOptions.find((option) => option.isActive(filter))}
          onChange={(option) => {
            onChange(updateValue(filter, option.updater));
          }}
        />
      </SettingRow>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
