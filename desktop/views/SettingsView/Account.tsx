import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { logOut, restartAndClearElectronData } from "@aca/desktop/actions/auth";
import { accountStore } from "@aca/desktop/store/account";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { Button } from "@aca/ui/buttons/Button";

export const AccountSettings = observer(function ThemeSelector() {
  const user = accountStore.assertUser;
  const referralUrl = `${process.env.FRONTEND_URL}/app/download?referral=${user.referral_code}`;
  return (
    <UIHolder>
      <UIInfo>
        Logged-in as <strong>{user.email}</strong>
      </UIInfo>
      <UIInfo>
        <p>
          Your personal referral code is <strong>{user.referral_code}</strong> and was used{" "}
          <strong>{user.count_referrals}</strong> times.
        </p>
        <p>Share the following link with your friends, colleges or family to earn more referrals:</p>
        <p>
          <Button tooltip="Copy to clipboard" onClick={() => window.electronBridge.copyToClipboard(referralUrl)}>
            {referralUrl}
          </Button>
        </p>
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
