import { EmailLoginButton } from "~frontend/authentication/EmailLoginButton";
import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";

export function LoginOptionsView() {
  return (
    <>
      <GoogleLoginButton />
      &nbsp;
      <EmailLoginButton />
    </>
  );
}
