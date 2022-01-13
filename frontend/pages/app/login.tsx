import router from "next/router";
import React from "react";

import { useCurrentUserTokenData } from "@aca/frontend/authentication/useCurrentUser";
import { FocusedActionLayout } from "@aca/frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { PageMeta } from "@aca/frontend/utils/PageMeta";
import { LoginOptionsView } from "@aca/frontend/views/LoginOptionsView";
import { routes } from "@aca/shared/routes";
import { Button } from "@aca/ui/buttons/Button";

export default function LoginPage(): JSX.Element {
  const user = useCurrentUserTokenData();

  function handleReturnToApp() {
    router.push(routes.finishLogInInApp);
  }

  return (
    <>
      <PageMeta title="Login" />
      <FocusedActionLayout
        title={user ? `Almost done` : "Log into Acapela app"}
        description={user ? `Open Acapela app to finish logging in.` : undefined}
      >
        {!user && <LoginOptionsView />}
        {!!user && (
          <Button kind="primary" onClick={handleReturnToApp}>
            Open Acapela App
          </Button>
        )}
      </FocusedActionLayout>
    </>
  );
}