import React from "react";
import styled from "styled-components";

import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
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

export function FilterEditorFigma({ filter, onChange }: Props) {
  return (
    <UIHolder>
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
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
