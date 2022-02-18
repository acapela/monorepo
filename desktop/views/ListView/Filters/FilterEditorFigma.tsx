import { uniqBy } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { getDb } from "@aca/desktop/clientdb";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { ServiceUsersFilterRow } from "@aca/desktop/views/ListView/Filters/ServiceUsersFilterRow";
import { isNotNullish } from "@aca/shared/nullish";
import { updateValue } from "@aca/shared/updateValue";
import { SingleOptionDropdown } from "@aca/ui/forms/OptionsDropdown/single";

import { NotificationFilterKind, NotificationFilterOption } from "./types";

type FigmaFilter = NotificationFilterKind<"notification_figma_comment">;
interface Props {
  filter: FigmaFilter;
  onChange: (filter: FigmaFilter) => void;
}

export const figmaNotificationOptions: NotificationFilterOption<FigmaFilter>[] = [
  {
    label: "Comments and Mentions",
    updater: (filter) => {
      delete filter.is_mention;
    },
    isActive: (filter) => filter.is_mention === undefined,
  },
  {
    label: "Only Mentions",
    updater: (filter) => (filter.is_mention = true),
    isActive: (filter) => filter.is_mention === true,
  },
];

export const FilterEditorFigma = observer(({ filter, onChange }: Props) => {
  const figmaUsers = uniqBy(getDb().notificationFigmaComment.all, (n) => n.author_id)
    .map((n) => {
      const from = n.notification?.from;
      return n.author_id && from
        ? {
            id: n.author_id,
            display_name: from,
            real_name: from,
          }
        : null;
    })
    .filter(isNotNullish);
  return (
    <UIHolder>
      <ServiceUsersFilterRow<FigmaFilter> users={figmaUsers} filter={filter} field="author_id" onChange={onChange} />
      <SettingRow title="Notification type">
        <SingleOptionDropdown<NotificationFilterOption<FigmaFilter>>
          items={figmaNotificationOptions}
          keyGetter={(option) => option.label}
          labelGetter={(option) => option.label}
          selectedItem={figmaNotificationOptions.find((option) => option.isActive(filter))}
          onChange={(option) => {
            onChange(updateValue(filter, option.updater));
          }}
        />
      </SettingRow>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
