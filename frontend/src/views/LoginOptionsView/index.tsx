import React from "react";

import { GoogleLoginButton } from "@aca/frontend/src/authentication/GoogleLoginButton";
import { SlackLoginButton } from "@aca/frontend/src/authentication/SlackLoginButton";
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
