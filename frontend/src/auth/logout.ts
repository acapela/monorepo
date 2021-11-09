import { signOut } from "next-auth/react";

import { trackEvent } from "~frontend/analytics/tracking";

export function logout() {
  trackEvent("Signed Out");
  signOut({ callbackUrl: "/" });
}
