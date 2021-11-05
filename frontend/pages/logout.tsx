import { signOut } from "next-auth/react";
import { useEffect } from "react";

import { FocusedActionLayout } from "~frontend/layouts/FocusedActionLayout/FocusedActionLayout";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return <FocusedActionLayout>Logging out...</FocusedActionLayout>;
}
