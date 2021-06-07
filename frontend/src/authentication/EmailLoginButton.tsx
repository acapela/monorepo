import { signIn } from "next-auth/client";
import React, { ReactNode } from "react";
import { emailInputValidator } from "~shared/validation/inputValidation";
import { openUIPrompt } from "~frontend/utils/prompt";
import { Button } from "~ui/buttons/Button";

export const EmailLoginButton = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}): JSX.Element => {
  async function handleLogin() {
    const email = await openUIPrompt({
      title: "What is your email address",
      placeholder: "Email...",
      submitLabel: "Continue...",
      validateInput: emailInputValidator,
    });

    if (!email?.trim()) return;

    signIn("email", { email, callbackUrl: "http://localhost:3000" });
  }

  return (
    <Button className={className} onClick={() => handleLogin()} isLoading={false}>
      {children || "Log in with Email"}
    </Button>
  );
};
