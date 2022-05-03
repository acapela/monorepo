import { getLocation } from "@swan-io/chicane";
import React from "react";

import { GoogleLoginButton } from "@aca/frontend/src/authentication/GoogleLoginButton";
import { SlackLoginButton } from "@aca/frontend/src/authentication/SlackLoginButton";
import { Maybe } from "@aca/shared/types";

type LoginOptionsViewProps = {
  signupEmail?: Maybe<string>;
};

export function LoginOptionsView({ signupEmail }: LoginOptionsViewProps) {
  const { search } = getLocation();
  const callbackUrl = search.redirect as string | undefined;
  return (
    <>
      <GoogleLoginButton signupEmail={signupEmail} callbackUrl={callbackUrl} />
      &nbsp;
      <SlackLoginButton callbackUrl={callbackUrl} />
      &nbsp;
    </>
  );
}
