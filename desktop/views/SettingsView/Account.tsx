import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { logOut, restartAndClearElectronData } from "@aca/desktop/actions/auth";
import { accountStore } from "@aca/desktop/store/account";
import { ActionButton } from "@aca/desktop/ui/ActionButton";

export const AccountSettings = observer(function ThemeSelector() {
  const user = accountStore.assertUser;
  return (
    <UIHolder>
      <UIInfo>
        Logged in as <strong>{user.email}</strong>
      </UIInfo>
      <ActionButton kind="secondary" action={logOut} />
      <ActionButton kind="secondary" action={restartAndClearElectronData} />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
`;

const UIInfo = styled.div`
  strong {
    font-weight: 600;
  }
  p {
    margin-bottom: 16px;
  }
`;
