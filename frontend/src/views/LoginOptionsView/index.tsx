import { EmailLoginButton } from "~frontend/authentication/EmailLoginButton";
import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";

type LoginOptionsViewProps = {
  isEmailLoginEnabled?: boolean;
  signupDomain?: string;
};

export function LoginOptionsView({ isEmailLoginEnabled, signupDomain }: LoginOptionsViewProps) {
  return (
    <>
      <GoogleLoginButton signupDomain={signupDomain} />
      &nbsp;
      {isEmailLoginEnabled && <EmailLoginButton />}
    </>
  );
}
