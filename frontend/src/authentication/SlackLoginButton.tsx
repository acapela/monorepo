import { signIn } from "next-auth/react";
import React, { ReactNode } from "react";

import { Button } from "@aca/ui/buttons/Button";
import { SlackLogo } from "@aca/ui/icons/logos/SlackLogo";

export const SlackLoginButton = ({
  className,
  children,
  callbackUrl,
}: {
  className?: string;
  children?: ReactNode;
  callbackUrl?: string;
}): JSX.Element => {
  function handleLogin() {
    signIn("slack", { callbackUrl });
  }

  return (
    <Button
      kind="secondary"
      size="primary"
      isWide
      className={className}
      onClick={() => handleLogin()}
      isLoading={false}
      icon={<SlackLogo />}
    >
      {children || "Continue with Slack"}
    </Button>
  );
};
