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
    <UIHolder>
      <ActionTrigger action={goToSettings}>
        <Avatar src={user.avatar_url} />
      </ActionTrigger>
    </UIHolder>
  );
});

export const SYSTEM_BAR_HEIGHT = 52;
export const TRAFFIC_LIGHTS_NEEDED_SPACE = 90;

const UIHolder = styled.div`
  ${Avatar} {
    font-size: 24px;
  }
`;
