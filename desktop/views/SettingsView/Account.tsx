import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { logOut, restartAndClearElectronData } from "@aca/desktop/actions/auth";
import { accountStore } from "@aca/desktop/store/account";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { theme } from "@aca/ui/theme";

export const AccountSettings = observer(function ThemeSelector() {
  const user = accountStore.assertUser;
  return (
    <UIHolder>
      <UIInfo>
        Logged in as <strong>{user.email}</strong>
      </UIInfo>
      <UIActions>
        <ActionButton kind="primarySubtle" action={logOut} />
        <ActionButton kind="primary" action={restartAndClearElectronData} />
      </UIActions>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  ${theme.colors.layout.backgroundAccent.withBorder.asBgWithReadableText};
  ${theme.box.panel.pageCart.padding.radius};
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
`;

const UIActions = styled.div`
  display: flex;
  gap: 8px;
`;

const UIInfo = styled.div`
  strong {
    font-weight: 600;
  }
  p {
    margin-bottom: 16px;
  }
`;
