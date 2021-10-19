import { signOut } from "next-auth/react";
import { useEffect } from "react";

import { trackEvent } from "~frontend/analytics/tracking";
import { FocusedActionLayout } from "~frontend/layouts/FocusedActionLayout/FocusedActionLayout";

export default function LogoutPage() {
  useEffect(() => {
    trackEvent("Signed Out");
    signOut({ callbackUrl: "/" });
  }, []);

  return <FocusedActionLayout>Logging out...</FocusedActionLayout>;
}
