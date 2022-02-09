import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { restartAndClearElectronData } from "@aca/desktop/actions/auth";
import { accountStore } from "@aca/desktop/store/account";
import { ActionButton } from "@aca/desktop/ui/ActionButton";

export const AccountSettings = observer(function ThemeSelector() {
  const user = accountStore.assertUser;

  return (
    <UIHolder>
      <UIInfo>Logged as {user.email}</UIInfo>
      <ActionButton kind="primary" action={restartAndClearElectronData} />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const UIInfo = styled.div``;
