import { signIn } from "next-auth/react";
import React, { ReactNode } from "react";

import { Button } from "@aca/ui/buttons/Button";
import { SlackLogo } from "@aca/ui/icons/logos/SlackLogo";

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
    <Button kind="secondary" className={className} onClick={() => handleLogin()} isLoading={false} icon={<SlackLogo />}>
      {children || "Log in with Slack"}
    </Button>
  );
};
