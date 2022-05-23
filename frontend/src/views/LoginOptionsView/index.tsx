import { getLocation } from "@swan-io/chicane";
import React from "react";
import styled from "styled-components";

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
    <UIHolder>
      <GoogleLoginButton signupEmail={signupEmail} callbackUrl={callbackUrl} />
      <SlackLoginButton callbackUrl={callbackUrl} />
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-self: stretch;
`;
