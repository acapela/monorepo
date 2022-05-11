import { signIn } from "next-auth/react";
import React, { ReactNode } from "react";

import { Maybe } from "@aca/shared/types";
import { Button } from "@aca/ui/buttons/Button";
import { GoogleGLogoIcon } from "@aca/ui/icons/logos/GoogleGLogo";

export const GoogleLoginButton = ({
  className,
  children,
  signupEmail,
  callbackUrl,
}: {
  className?: string;
  children?: ReactNode;
  signupEmail: Maybe<string>;
  callbackUrl?: string;
}): JSX.Element => {
  function handleLogin() {
    signIn(
      "google",
      { callbackUrl },
      {
        login_hint: signupEmail ?? "",
      }
    );
  }

  return (
    <Button
      kind="secondary"
      size="primary"
      className={className}
      onClick={() => handleLogin()}
      isLoading={false}
      icon={<GoogleGLogoIcon />}
      isWide
    >
      {children || "Continue with Google"}
    </Button>
  );
};
