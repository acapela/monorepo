import React from "react";

import { FocusedActionLayout } from "@aca/frontend/src/layouts/FocusedActionLayout/FocusedActionLayout";
import { LoginOptionsView } from "@aca/frontend/src/views/LoginOptionsView";

export default function LoginPage(): JSX.Element {
  return (
    <>
      <FocusedActionLayout title="Log in to start downloading Acapela">
        <LoginOptionsView />
      </FocusedActionLayout>
    </>
  );
}
