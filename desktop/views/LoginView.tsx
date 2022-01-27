import React from "react";

import { loginBridge } from "@aca/desktop/bridge/auth";
import { Button } from "@aca/ui/buttons/Button";

export function LoginView() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Button
        onClick={() => {
          loginBridge();
        }}
      >
        Log in
      </Button>
    </div>
  );
}
