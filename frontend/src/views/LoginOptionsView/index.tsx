import { EmailLoginButton } from "~frontend/authentication/EmailLoginButton";
import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";

type LoginOptionsViewProps = {
  isEmailLoginEnabled?: boolean;
  signupEmail?: string;
};

export function LoginOptionsView({ isEmailLoginEnabled, signupEmail }: LoginOptionsViewProps) {
  return (
    <>
      <GoogleLoginButton signupEmail={signupEmail} />
      &nbsp;
      {isEmailLoginEnabled && <EmailLoginButton />}
    </>
  );
}
