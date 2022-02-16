import { gql, useQuery } from "@apollo/client";
import React from "react";
import styled from "styled-components";

import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { LinearUsersQuery } from "@aca/gql";
import { getIsValueMatchingFilter } from "@aca/shared/filters";
import { updateValue } from "@aca/shared/updateValue";
import { MultipleOptionsDropdown } from "@aca/ui/forms/OptionsDropdown/multiple";

import { UIAvatar } from "./shared";
import { NotificationFilterKind } from "./types";

interface Props {
  filter: NotificationFilterKind<"notification_linear">;
  onChange: (filter: NotificationFilterKind<"notification_linear">) => void;
}

export function useLinearUsers() {
  const { data } = useQuery<LinearUsersQuery>(
    gql`
      query LinearUsers {
        linear_users {
          id
          display_name
          real_name
          avatar_url
        }
      }
    `
  );

  return data?.linear_users ?? [];
}

export function FilterEditorLinear({ filter, onChange }: Props) {
  const linearUsers = useLinearUsers();

  return (
    <UIHolder>
      <SettingRow title="People">
        <MultipleOptionsDropdown<LinearUsersQuery["linear_users"][0]>
          items={linearUsers}
          keyGetter={(user) => user.id}
          labelGetter={(user) => user.real_name ?? user.display_name}
          iconGetter={(user) => <UIAvatar style={{ backgroundImage: `url(${user.avatar_url})` }} />}
          selectedItems={linearUsers.filter((user) => {
            return getIsValueMatchingFilter(filter.creator_id, user.id);
          })}
          onChange={(users) => {
            onChange(
              updateValue(filter, (filter) => {
                if (users.length === 0) {
                  delete filter.creator_id;
                  return;
                }

                filter.creator_id = { $in: users.map((u) => u.id) };
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
