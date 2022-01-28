import React from "react";

import { loginToAcapela } from "@aca/desktop/actions/auth";
import { ActionButton } from "@aca/desktop/ui/ActionButton";

export function LoginView() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <ActionButton action={loginToAcapela} />
    </div>
  );
}
