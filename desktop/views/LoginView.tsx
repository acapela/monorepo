import React from "react";

import { Button } from "@aca/ui/buttons/Button";

import { loginBridge } from "../bridge/auth";

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
