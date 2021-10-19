import { signIn } from "next-auth/react";
import React, { ReactNode } from "react";

import { Maybe } from "~shared/types";
import { Button } from "~ui/buttons/Button";
import { GoogleGLogoIcon } from "~ui/icons/logos/GoogleGLogo";

export const GoogleLoginButton = ({
  className,
  children,
  signupEmail,
}: {
  className?: string;
  children?: ReactNode;
  signupEmail: Maybe<string>;
}): JSX.Element => {
  function handleLogin() {
    signIn("google", undefined, {
      login_hint: signupEmail ?? "",
    });
  }

  return (
    <Button
      kind="secondary"
      className={className}
      onClick={() => handleLogin()}
      isLoading={false}
      icon={<GoogleGLogoIcon />}
    >
      {children || "Log in with Google"}
    </Button>
  );
};
