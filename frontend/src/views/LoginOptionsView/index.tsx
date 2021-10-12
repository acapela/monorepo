import { EmailLoginButton } from "~frontend/authentication/EmailLoginButton";
import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";
import { Maybe } from "~shared/types";

type LoginOptionsViewProps = {
  isEmailLoginEnabled?: boolean;
  signupEmail?: Maybe<string>;
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
