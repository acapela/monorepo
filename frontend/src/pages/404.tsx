import React from "react";

import { Router } from "@aca/frontend/src/router";
import { ErrorView } from "@aca/frontend/src/views/ErrorView";
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
          Router.push("appDownload");
        }}
      >
        Go to the download page
      </Button>
    </ErrorView>
  );
}
