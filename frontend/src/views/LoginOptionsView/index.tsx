import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";
import { EmailLoginButton } from "~frontend/authentication/EmailLoginButton";

type LoginOptionsViewProps = {
  enableEmailLogin?: boolean;
};

export function LoginOptionsView({ enableEmailLogin }: LoginOptionsViewProps) {
  return (
    <>
      <GoogleLoginButton />
      &nbsp;
      {enableEmailLogin && <EmailLoginButton />}
    </>
  );
}
