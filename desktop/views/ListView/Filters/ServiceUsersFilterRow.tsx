import React from "react";
import styled from "styled-components";

import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { ServiceUser } from "@aca/gql";
import { FilterValue, FiltersData, getIsValueMatchingFilter } from "@aca/shared/filters";
import { updateValue } from "@aca/shared/updateValue";
import { MultipleOptionsDropdown } from "@aca/ui/forms/OptionsDropdown/multiple";
import { theme } from "@aca/ui/theme";

type FilterUser = Omit<ServiceUser, "__typename">;

export const ServiceUsersFilterRow = <F extends FiltersData<unknown>>({
  users,
  filter,
  field,
  onChange,
}: {
  users: FilterUser[];
  filter: F;
  field: keyof F;
  onChange: (filter: F) => void;
}) => (
  <SettingRow title="People">
    <MultipleOptionsDropdown<FilterUser>
      items={users}
      keyGetter={(user) => user.id}
      labelGetter={(user) => user.real_name ?? user.display_name}
      iconGetter={(user) => <UIAvatar style={{ backgroundImage: `url(${user.avatar_url})` }} />}
      selectedItems={users.filter((user) => {
        return getIsValueMatchingFilter(filter[field] as unknown as FilterValue<string>, user.id);
      })}
      onChange={(users) => {
        onChange(
          updateValue(filter, (filter) => {
            if (users.length === 0) {
              delete filter[field];
            } else {
              (filter[field] as unknown as FilterValue<string>) = { $in: users.map((u) => u.id) };
            }
          })
        );
      }}
      placeholder="Everyone"
    />
  </SettingRow>
);

const UIAvatar = styled.div`
  height: 1em;
  width: 1em;
  ${theme.radius.circle};
  background-size: cover;
  background-color: #8884;
`;
