import React from "react";
import styled from "styled-components";

import { useSlackUsers } from "@aca/desktop/domains/slack/useSlackUsers";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { updateValue } from "@aca/shared/updateValue";
import { SingleOptionDropdown } from "@aca/ui/forms/OptionsDropdown/single";

import { ServiceUsersFilterRow } from "./ServiceUsersFilterRow";
import { NotificationFilterKind, NotificationFilterOption } from "./types";

type SlackFilter = NotificationFilterKind<"notification_slack_message">;
interface Props {
  filter: SlackFilter;
  onChange: (filter: SlackFilter) => void;
}

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

export function FilterEditorSlack({ filter, onChange }: Props) {
  filter.conversation_name;

  const slackUsers = useSlackUsers();

  return (
    <UIHolder>
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
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
