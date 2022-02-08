import React from "react";

import { loginToAcapelaWithGoogle, loginToAcapelaWithSlack } from "@aca/desktop/actions/auth";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { FocusedActionLayout } from "@aca/frontend/src/layouts/FocusedActionLayout/FocusedActionLayout";

export function LoginView() {
  return (
    <FocusedActionLayout title="Sign into Acapela">
      <ActionButton action={loginToAcapelaWithGoogle} />
      &nbsp;
      <ActionButton action={loginToAcapelaWithSlack} />
    </FocusedActionLayout>
  );
}
