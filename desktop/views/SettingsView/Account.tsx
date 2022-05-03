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
        Logged as <strong>{user.email}</strong>
      </UIInfo>
      <UIInfo>
        Referral Code <strong>{user.referral_code}</strong> (used: <strong>{user.count_referrals}</strong> times)
        <ReferralCode type="text" value={`${process.env.FRONTEND_URL}/app/download?referral=${user.referral_code}`} />
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
`;

const ReferralCode = styled.input`
  font-size: 15px;
  font-weight: 600;
  width: 100%;
  height: 30px;
}
`;
