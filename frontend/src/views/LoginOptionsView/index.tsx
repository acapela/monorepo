import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";
import { EmailLoginButton } from "~frontend/authentication/EmailLoginButton";

type LoginOptionsViewProps = {
  isEmailLoginEnabled?: boolean;
};

export function LoginOptionsView({ isEmailLoginEnabled }: LoginOptionsViewProps) {
  return (
    <>
      <GoogleLoginButton />
      &nbsp;
      {isEmailLoginEnabled && <EmailLoginButton />}
    </>
  );
}
