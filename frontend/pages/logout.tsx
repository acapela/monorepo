import { signOut } from "next-auth/react";
import { useEffect } from "react";

import { trackEvent } from "~frontend/analytics/tracking";

export default function LogoutPage() {
  useEffect(() => {
    trackEvent("Signed Out");
    signOut({ callbackUrl: "/" });
  }, []);

  return <div>Logging out...</div>;
}
