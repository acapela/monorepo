import { signIn } from "next-auth/client";
import React, { ReactNode } from "react";

import { Button } from "~ui/buttons/Button";

export const GoogleLoginButton = ({
  className,
  children,
  signupEmail,
}: {
  className?: string;
  children?: ReactNode;
  signupEmail?: string;
}): JSX.Element => {
  function handleLogin() {
    signIn("google", undefined, {
      login_hint: signupEmail ?? "",
    });
  }

  return (
    <Button kind="secondary" size="large" className={className} onClick={() => handleLogin()} isLoading={false}>
      {children || "Log in with Google"}
    </Button>
  );
};
