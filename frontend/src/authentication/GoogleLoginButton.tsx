import { signIn } from "next-auth/client";
import React, { ReactNode } from "react";
import { Button } from "~ui/buttons/Button";

export const GoogleLoginButton = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}): JSX.Element => {
  function handleLogin() {
    signIn("google");
  }

  return (
    <Button kind="transparent" size="large" className={className} onClick={() => handleLogin()} isLoading={false}>
      {children || "Log in with Google"}
    </Button>
  );
};
