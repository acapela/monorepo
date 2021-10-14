import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";
import { Maybe } from "~shared/types";

type LoginOptionsViewProps = {
  signupEmail?: Maybe<string>;
};

export function LoginOptionsView({ signupEmail }: LoginOptionsViewProps) {
  return (
    <>
      <GoogleLoginButton signupEmail={signupEmail} />
      &nbsp;
    </>
  );
}
