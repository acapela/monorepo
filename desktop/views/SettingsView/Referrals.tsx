import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { trackEvent } from "@aca/desktop/analytics";
import { accountStore } from "@aca/desktop/store/account";
import { Button } from "@aca/ui/buttons/Button";

export const ReferralsView = observer(function ThemeSelector() {
  function handleCopy() {
    window.electronBridge.copyToClipboard(referralUrl);
    trackEvent("Referral Code Copied");
  }
  const user = accountStore.assertUser;
  const referralUrl = `${process.env.FRONTEND_URL}/app/download?referral=${user.referral_code}`;
  return (
    <UIHolder>
      <UIInfo>
        Logged in as <strong>{user.email}</strong>
      </UIInfo>
      <UIInfo>
        <p>
          Every referral <strong>increases your chance to win</strong>. For every friend who signs up for an account you
          get an <strong>additional ticket</strong> to win.
        </p>
        <p>
          So far, you have referred <strong>{user.referral_code}</strong> friends. Refer more friends now!
        </p>
        <p>Share the following link with your friends, colleges or family to earn more tickets:</p>
        <p>
          <Button kind="primarySubtle" tooltip="Copy to clipboard" onClick={handleCopy}>
            {referralUrl}
          </Button>
        </p>
      </UIInfo>
      <UILegal>
        <p>All raffles are subject to the following:</p>
        <ul>
          <li>
            employees of Acapela GmbH and the companies connected with it and there dependents are excluded from
            participation in the raffles
          </li>
          <li>no cash disbursement and/or an replacement of the prizes is possible</li>
          <li>recourse to the courts is not permitted</li>
          <li>no correspondence concerning the lottery will be held</li>
        </ul>
      </UILegal>
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
    line-height: 1.6;
  }
`;

const UILegal = styled.div`
  font-size: 0.8em;
  p {
    margin-bottom: 16px;
  }
  li {
    margin-bottom: 8px;
  }
`;
