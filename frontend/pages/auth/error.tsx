import { useRouter } from "next/router";

import { ErrorView } from "~frontend/views/ErrorView";

const errors: {
  [error: string]: {
    title: string;
    description: (errCode: string) => JSX.Element;
  };
} = {
  OAuthCreateAccount: {
    title: "Acapela is early-stage and invite-only.",
    description: () => (
      <>
        <p>Looks like you haven't been invited yet 🤷</p>
        <p>Please contact our onboarding support if you have technical problems</p>
      </>
    ),
  },
  OAuthAccountNotLinked: {
    title:
      "An account with your email address already exists. If you were invited into Acapela, please use the link from the invitation message to signup.",
    description: () => (
      <>
        <p>Please try again and use a different login provider.</p>
      </>
    ),
  },
  default: {
    title: "Unknown authentication error.",
    description: (errCode) => (
      <>
        <p>An unknown error occurred during login: {errCode}</p>
        <p>Please contact our onboarding support.</p>
      </>
    ),
  },
};

export default function ErrorPage() {
  const { query } = useRouter();
  const errCode = `${query.error}`;
  const error = errors[errCode] || errors.default;

  return <ErrorView title={error.title} description={error.description(errCode)} />;
}
