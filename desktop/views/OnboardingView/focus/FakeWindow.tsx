import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { accountStore } from "@aca/desktop/store/account";
import { TopBarDivider } from "@aca/desktop/ui/systemTopBar/ui";
import { theme } from "@aca/ui/theme";
import { Avatar } from "@aca/ui/users/Avatar";

import { trafficLights } from "./TrafficLights";

interface Props {
  topBar: ReactNode;
  children: ReactNode;
}

export const FakeWindow = observer(function FakeWindow({ topBar, children }: Props) {
  return (
    <UIHolder>
      <UITopBar>
        {trafficLights}
        <UITopbarBody>{topBar}</UITopbarBody>
        <TopBarDivider />
        <UIUser>
          <Avatar src={accountStore.user?.avatar_url} />
        </UIUser>
      </UITopBar>
      <UIBody>{children}</UIBody>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  border: 1px solid #888888;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 22px 70px 4px rgba(0, 0, 0, 0.56);
  width: 840px;
  max-width: 100%;
`;

const UITopBar = styled.div`
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 19px;
  gap: 20px;
  border-bottom: 1px solid ${theme.colors.layout.divider.value};
`;

const UITopbarBody = styled.div`
  flex-grow: 1;
`;

const UIBody = styled.div``;

const UIUser = styled.div`
  ${theme.iconSize.avatar};
`;
