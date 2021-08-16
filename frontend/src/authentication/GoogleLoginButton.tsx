import { signIn } from "next-auth/client";
import React, { ReactNode } from "react";

import { Button } from "~ui/buttons/Button";

interface AuthorizationUrlParams {
  response_type: "code";
  prompt: "select_account";
  access_type: "offline";
  hd?: string;
}

export const GoogleLoginButton = ({
  className,
  children,
  signupDomain,
}: {
  className?: string;
  children?: ReactNode;
  signupDomain?: string;
}): JSX.Element => {
  function handleLogin() {
    const authorizationUrlParams: AuthorizationUrlParams = {
      response_type: "code",
      prompt: "select_account",
      /**
       * !!!
       *
       * This will make sure we get refresh token each time user gives content for our access scopes
       */
      access_type: "offline",
    };
    if (signupDomain) {
      authorizationUrlParams.hd = signupDomain;
    }
    signIn("google", undefined, {
      authorizationUrl: `https://accounts.google.com/o/oauth2/auth?${new URLSearchParams(
        authorizationUrlParams as unknown as Record<string, string>
      ).toString()}`,
    });
  }

  return (
    <Button kind="secondary" size="large" className={className} onClick={() => handleLogin()} isLoading={false}>
      {children || "Log in with Google"}
    </Button>
  );
};
