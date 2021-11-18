import { noop } from "lodash";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled from "styled-components";

import { PlainErrorView } from "~frontend/views/ErrorView";
import { Button } from "~ui/buttons/Button";
import { TextInput } from "~ui/forms/TextInput";
import { addToast } from "~ui/toasts/data";

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
          addToast({ type: "success", title: "Email sent!" });
        });
      }}
    >
      <TextInput
        type="email"
        placeholder="Your E-Mail address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <UISendMailButton kind="primary" disabled={isSubmitting} onClick={noop}>
        Resend Invitation
      </UISendMailButton>
    </UIFormRow>
  );
}

const errors: { [error: string]: React.ComponentProps<typeof PlainErrorView> } = {
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
  const { query } = useRouter();
  const errCode = `${query.error}`;
  const error = errors[errCode];

  return error ? (
    <PlainErrorView {...error} />
  ) : (
    <PlainErrorView
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
