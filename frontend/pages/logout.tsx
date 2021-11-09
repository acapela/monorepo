import { useEffect } from "react";

import { logout } from "~frontend/auth/logout";
import { FocusedActionLayout } from "~frontend/layouts/FocusedActionLayout/FocusedActionLayout";

export default function LogoutPage() {
  useEffect(() => {
    logout();
  }, []);

  return <FocusedActionLayout>Logging out...</FocusedActionLayout>;
}
