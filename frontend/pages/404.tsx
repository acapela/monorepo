import router from "next/router";

import { ErrorView } from "@aca/frontend/views/ErrorView";
import { routes } from "@aca/shared/routes";
import { Button } from "@aca/ui/buttons/Button";

export default function ErrorPage() {
  return (
    <ErrorView
      title="Page not found"
      description={
        <>
          <p>Looks like page you're trying to visit does not exist. 🤷</p>
        </>
      }
    >
      <Button
        kind="primary"
        onClick={() => {
          router.push(routes.appDownload);
        }}
      >
        Go to the download page
      </Button>
    </ErrorView>
  );
}
