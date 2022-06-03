import React from "react";
import styled from "styled-components";

import { IntegrationClient } from "@aca/desktop/domains/integrations/types";
import { ServiceUser } from "@aca/gql";
import { MultipleOptionsDropdown } from "@aca/ui/forms/OptionsDropdown/multiple";
import { Avatar, OverlayingAvatars } from "@aca/ui/users/Avatar";

import { FilterSettingRow, getWorkspaceLabel } from "./utils";

type FilterUser = Omit<ServiceUser, "__typename" | "workspace_id"> & { workspace_id?: string };

interface Props {
  label?: string;
  integrationClient: IntegrationClient;
  users: FilterUser[];
  selectedUsers: FilterUser[];
  onChange: (users: FilterUser[]) => void;
}

export const ServiceUsersFilterRow = ({
  label = "People",
  integrationClient,
  users,
  selectedUsers,
  onChange,
}: Props) => (
  <FilterSettingRow title={label}>
    <MultipleOptionsDropdown<FilterUser>
      items={users}
      keyGetter={(user) => user.id}
      labelGetter={(user) =>
        (user.real_name ?? user.display_name) + getWorkspaceLabel(integrationClient, user.workspace_id)
      }
      iconGetter={(user) => <Avatar src={user.avatar_url} name={user.real_name ?? user.display_name} />}
      selectedItems={selectedUsers}
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
      onChange={onChange}
      placeholder="None"
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
