import { signIn } from "next-auth/react";
import React, { ReactNode } from "react";

import { Button } from "~ui/buttons/Button";

export const SlackLoginButton = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}): JSX.Element => {
  function handleLogin() {
    signIn("slack");
  }

  return (
    <Button kind="secondary" className={className} onClick={() => handleLogin()} isLoading={false}>
      {children || "Log in with Slack"}
    </Button>
  );
};
