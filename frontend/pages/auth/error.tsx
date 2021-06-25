import Error from "next/error";

export default function ErrorPage() {
  return (
    <Error
      statusCode={403}
      title="Acapela is early-stage and invite-only. Looks like you haven't been invited yet 🤷&nbsp;&nbsp;Please contact our onboarding support if you have technical problems"
    />
  );
}
