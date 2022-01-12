import { GoogleLoginButton } from "@aca/frontend/authentication/GoogleLoginButton";
import { SlackLoginButton } from "@aca/frontend/authentication/SlackLoginButton";
import { Maybe } from "@aca/shared/types";

type LoginOptionsViewProps = {
  signupEmail?: Maybe<string>;
};

export function LoginOptionsView({ signupEmail }: LoginOptionsViewProps) {
  return (
    <>
      <GoogleLoginButton signupEmail={signupEmail} />
      &nbsp;
      <SlackLoginButton />
      &nbsp;
    </>
  );
}
