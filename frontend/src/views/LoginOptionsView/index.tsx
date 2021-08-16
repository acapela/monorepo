import { EmailLoginButton } from "~frontend/authentication/EmailLoginButton";
import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";

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
