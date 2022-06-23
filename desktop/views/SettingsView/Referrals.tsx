import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { trackEvent } from "@aca/desktop/analytics";
import { addToast } from "@aca/desktop/domains/toasts/store";
import { accountStore } from "@aca/desktop/store/account";
import { pluralize } from "@aca/shared/text/pluralize";
import { Button } from "@aca/ui/buttons/Button";
import { theme } from "@aca/ui/theme";

export const ReferralsView = observer(function ThemeSelector() {
  function handleCopy() {
    window.electronBridge.copyToClipboard(referralUrl);
    trackEvent("Referral Code Copied");

    addToast({ title: "Referral link copied to clipboard", message: referralUrl });
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
          So far, you have referred <strong>{pluralize`${user.count_referrals ?? 0} ${["friend"]}`}</strong>. Refer more
          friends now!
        </p>
        <p>Share the following link with your friends, colleges or family:</p>
        <p>
          <Button kind="primarySubtle" tooltip="Copy to clipboard" onClick={handleCopy}>
            {referralUrl}
          </Button>
        </p>
      </UIInfo>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  display: flex;
  ${theme.colors.layout.backgroundAccent.withBorder.asBgWithReadableText};
  ${theme.box.panel.pageCart.padding.radius};
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
`;

const UIInfo = styled.div`
  strong {
    font-weight: 600;
  }
  p {
    ${theme.typo.body};
  }

  p + p {
    margin-top: 1em;
  }
`;
