import React from "react";
import styled from "styled-components";

import { IntegrationClient } from "@aca/desktop/domains/integrations/types";
import { ServiceUser } from "@aca/gql";
import { FilterValue, FiltersData, getIsValueMatchingFilter } from "@aca/shared/filters";
import { updateValue } from "@aca/shared/updateValue";
import { MultipleOptionsDropdown } from "@aca/ui/forms/OptionsDropdown/multiple";
import { Avatar, OverlayingAvatars } from "@aca/ui/users/Avatar";

import { FilterSettingRow, getWorkspaceLabel } from "./utils";

type FilterUser = Omit<ServiceUser, "__typename" | "workspace_id"> & { workspace_id?: string };

export const ServiceUsersFilterRow = <F extends FiltersData<unknown>>({
  integrationClient,
  users,
  filter,
  field,
  onChange,
}: {
  integrationClient: IntegrationClient;
  users: FilterUser[];
  filter: F;
  field: keyof F;
  onChange: (filter: F) => void;
}) => (
  <FilterSettingRow title="People">
    <MultipleOptionsDropdown<FilterUser>
      items={users}
      keyGetter={(user) => user.id}
      labelGetter={(user) =>
        (user.real_name ?? user.display_name) + getWorkspaceLabel(integrationClient, user.workspace_id)
      }
      iconGetter={(user) => <Avatar src={user.avatar_url} name={user.real_name ?? user.display_name} />}
      selectedItems={users.filter((user) => {
        return getIsValueMatchingFilter(filter[field] as unknown as FilterValue<string>, user.id);
      })}
      selectedItemsPreviewRenderer={(users) => {
        if (!users.length) return null;

        return (
          <UISelectedPreview>
            <OverlayingAvatars>
              {users.map((user) => {
                return <Avatar key={user.id} src={user.avatar_url} name={user.real_name ?? user.display_name} />;
              })}
            </OverlayingAvatars>
          </UISelectedPreview>
        );
      }}
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
  </FilterSettingRow>
);

const UISelectedPreview = styled.div`
  font-size: 22px;
  display: flex;
  align-items: center;
  flex-grow: 1;
  max-width: 200px;
`;
