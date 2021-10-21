import { ErrorView } from "~frontend/views/ErrorView";

export default function ErrorPage() {
  return (
    <ErrorView
      title="Page not found"
      description={
        <>
          <p>Looks like page you're trying to visit does not exist. 🤷</p>
        </>
      }
    />
  );
}
