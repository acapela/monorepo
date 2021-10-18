import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";
import { SlackLoginButton } from "~frontend/authentication/SlackLoginButton";
import { Maybe } from "~shared/types";

type LoginOptionsViewProps = {
  signupEmail?: Maybe<string>;
};

export function LoginOptionsView({ signupEmail }: LoginOptionsViewProps) {
  return (
    <>
      <GoogleLoginButton signupEmail={signupEmail} />
      <SlackLoginButton />
      &nbsp;
    </>
  );
}
