import { signOut } from "next-auth/react";
import React, { useEffect } from "react";

import { FocusedActionLayout } from "@aca/frontend/src/layouts/FocusedActionLayout/FocusedActionLayout";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return <FocusedActionLayout>Logging out...</FocusedActionLayout>;
}
