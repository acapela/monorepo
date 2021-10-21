import { ErrorView } from "~frontend/views/ErrorView";

export default function ErrorPage() {
  return (
    <ErrorView
      title="Acapela is early-stage and invite-only."
      description={
        <>
          <p>Looks like you haven't been invited yet 🤷</p>
          <p>Please contact our onboarding support if you have technical problems</p>
        </>
      }
    />
  );
}
