import React from "react";
import styled from "styled-components";

import { getIsNotificationPassingFilters } from "@aca/desktop/clientdb/list";
import { SlackQueryUser, useSlackUsers } from "@aca/desktop/domains/slack/useSlackUsers";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { getIsValueMatchingFilter } from "@aca/shared/filters";
import { updateValue } from "@aca/shared/updateValue";
import { MultipleOptionsDropdown } from "@aca/ui/forms/OptionsDropdown/multiple";
import { SingleOptionDropdown } from "@aca/ui/forms/OptionsDropdown/single";
import { theme } from "@aca/ui/theme";

import { NotificationFilterKind, NotificationFilterOption } from "./types";

type SlackFilter = NotificationFilterKind<"notification_slack_message">;
interface Props {
  filter: SlackFilter;
  onChange: (filter: SlackFilter) => void;
}

const notificationOptions: NotificationFilterOption<SlackFilter>[] = [
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
  {
    label: "All messages except mentions",
    updater: (filter) => (filter.is_mention = false),
    isActive: (filter) => filter.is_mention === false,
  },
];

export function FilterEditorSlack({ filter, onChange }: Props) {
  filter.conversation_name;

  const slackUsers = useSlackUsers();

  console.log({ slackUsers, filter });

  return (
    <UIHolder>
      <SettingRow title="Message type">
        <SingleOptionDropdown<NotificationFilterOption<SlackFilter>>
          items={notificationOptions}
          keyGetter={(option) => option.label}
          labelGetter={(option) => option.label}
          selectedItem={notificationOptions.find((option) => option.isActive(filter))}
          onChange={(option) => {
            onChange(updateValue(filter, option.updater));
          }}
        />
      </SettingRow>
      <SettingRow title="People">
        <MultipleOptionsDropdown<SlackQueryUser>
          items={slackUsers}
          keyGetter={(user) => user.id}
          labelGetter={(user) => user.real_name ?? user.display_name}
          iconGetter={(user) => <UIAvatar style={{ backgroundImage: `url(${user.avatar_url})` }} />}
          selectedItems={slackUsers.filter((user) => {
            return getIsValueMatchingFilter(filter.slack_user_id, user.id);
          })}
          onChange={(users) => {
            onChange(
              updateValue(filter, (filter) => {
                filter.slack_user_id = { $in: users.map((u) => u.id) };
              })
            );
          }}
          placeholder="Everyone"
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

const UIAvatar = styled.div`
  height: 1em;
  width: 1em;
  ${theme.radius.circle};
  background-size: cover;
  background-color: #8884;
`;
