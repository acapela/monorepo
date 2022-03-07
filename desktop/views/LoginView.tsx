import React from "react";

import { loginToAcapelaWithGoogle, loginToAcapelaWithSlack } from "@aca/desktop/actions/auth";
import { ActionButton } from "@aca/desktop/ui/ActionButton";

import { FocusedActionView } from "./FocusedActionView";

export function LoginView() {
  return (
    <FocusedActionView title="Sign into Acapela">
      <ActionButton action={loginToAcapelaWithGoogle} isWide />
      &nbsp;
      <ActionButton action={loginToAcapelaWithSlack} isWide />
    </FocusedActionView>
  );
}
