import { signIn } from "next-auth/client";
import React from "react";
import { Button } from "~ui/button";

export const EmailLoginButton = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}): JSX.Element => {
  function handleLogin() {
    const email = window.prompt("Email...");
    signIn("email", { email, callbackUrl: "http://localhost:3000" });
  }

  return (
    <Button className={className} onClick={() => handleLogin()} isLoading={false}>
      {children || "Log in with Email"}
    </Button>
  );
};
