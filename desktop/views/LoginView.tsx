import React from "react";
import styled from "styled-components";

import { loginToAcapela } from "@aca/desktop/actions/auth";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { theme } from "@aca/ui/theme";

export function LoginView() {
  return (
    <UIHolder>
      <UISignInCallToAction>Sign into Acapela</UISignInCallToAction>
      <ActionButton action={loginToAcapela} />
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 24px;
`;

const UISignInCallToAction = styled.h1`
  ${theme.typo.pageTitle.semibold}
`;
