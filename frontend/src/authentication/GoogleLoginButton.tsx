import { signIn } from "next-auth/client";
import React, { ReactNode } from "react";
import { OutlinedButton } from "~ui/buttons/OutlinedButton";

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
    <OutlinedButton size="large" className={className} onClick={() => handleLogin()} isLoading={false}>
      {children || "Log in with Google"}
    </OutlinedButton>
  );
};
