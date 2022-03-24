import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { goToSettings } from "@aca/desktop/actions/navigation";
import { accountStore } from "@aca/desktop/store/account";
import { Avatar } from "@aca/ui/users/Avatar";

import { ActionTrigger } from "../ActionTrigger";

export const SystemBarUserMenu = observer(function SystemBarUserMenu() {
  const { assertUser: user } = accountStore;
  return (
    <UIHolder data-tooltip="Open settings">
      <ActionTrigger action={goToSettings}>
        <Avatar src={user.avatar_url} />
      </ActionTrigger>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  ${Avatar} {
    font-size: 24px;
  }
`;
