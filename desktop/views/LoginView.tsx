import React from "react";

import { loginToAcapela } from "@aca/desktop/actions/auth";
import { ActionButton } from "@aca/desktop/ui/ActionButton";

export function LoginView() {
  return (
    <div>
      <ActionButton action={loginToAcapela} />
    </div>
  );
}
