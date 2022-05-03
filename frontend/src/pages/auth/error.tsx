import { getLocation } from "@swan-io/chicane";
import { noop } from "lodash";
import React, { useState } from "react";
import styled from "styled-components";

import { ErrorView } from "@aca/frontend/src/views/ErrorView";
import { Button } from "@aca/ui/buttons/Button";
import { TextInput } from "@aca/ui/forms/TextInput";

function ResendInviteForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <UIFormRow
      onSubmit={(event) => {
        event.preventDefault();
        setIsSubmitting(true);
        fetch("/api/backend/v1/login/recover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }).then(() => {
          setIsSubmitting(false);
          setEmail("");
          // TODO: use toasts somehow so it doesn't conflict with electron approach.
          alert("Email sent");
        });
      }}
    >
      <TextInput
        type="email"
        placeholder="Your E-Mail address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <UISendMailButton kind="primary" isDisabled={isSubmitting} onClick={noop}>
        Resend Invitation
      </UISendMailButton>
    </UIFormRow>
  );
}

const errors: { [error: string]: React.ComponentProps<typeof ErrorView> } = {
  OAuthCreateAccount: {
    title: "Acapela is early-stage and invite-only.",
    description: (
      <>
        <p>Looks like you haven't been invited yet 🤷</p>
        <p>Please contact our onboarding support if you have technical problems</p>
      </>
    ),
  },
  OAuthAccountNotLinked: {
    title: "An account with your email address already exists.",
    description: (
      <p>
        If you were invited into Acapela, please use the link from the invitation message to signup, or enter your
        e-mail address to receive a new one.
      </p>
    ),
    extraContent: <ResendInviteForm />,
  },
};

export default function ErrorPage() {
  const { search } = getLocation();
  const errCode = `${search.error}`;
  const error = errors[errCode];

  return error ? (
    <ErrorView {...error} />
  ) : (
    <ErrorView
      title="Unknown authentication error."
      description={
        <>
          <p>An unknown error occurred during login: {errCode}</p>
          <p>Please contact our onboarding support.</p>
        </>
      }
    />
  );
}

const UIFormRow = styled.form`
  margin-bottom: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const UISendMailButton = styled(Button)`
  height: 100%;
`;
