import router from "next/router";
import React from "react";

import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { FocusedActionLayout } from "~frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { PageMeta } from "~frontend/utils/PageMeta";
import { LoginOptionsView } from "~frontend/views/LoginOptionsView";
import { routes } from "~shared/routes";
import { Button } from "~ui/buttons/Button";

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
