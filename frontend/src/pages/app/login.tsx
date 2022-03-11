import { Session } from "next-auth/core/types";
import { getSession, signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { FocusedActionLayout } from "@aca/frontend/src/layouts/FocusedActionLayout/FocusedActionLayout";
import { Router } from "@aca/frontend/src/router";
import { LoginOptionsView } from "@aca/frontend/src/views/LoginOptionsView";
import { Button } from "@aca/ui/buttons/Button";

export default function LoginPage(): JSX.Element {
  const [user, setUser] = useState<Session | null>(null);

  useEffect(() => {
    getSession().then((s) => setUser(s));
  }, []);

  const { search } = Router.getLocation();
  // Runs `singIn` in client side
  useEffect(() => {
    if (search.provider === "google") {
      signIn("google");
    } else if (search.provider === "slack") {
      signIn("slack");
    }
  }, [search]);

  function handleReturnToApp() {
    window.location.href = "/app/return-to-app";
  }

  return (
    <>
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
