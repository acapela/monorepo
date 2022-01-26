import React from "react";

import { loginBridge } from "@aca/desktop/bridge/auth";
import { Button } from "@aca/ui/buttons/Button";

export function LoginView() {
  return (
    <div>
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
