import { useEffect } from "react";

import { logout } from "@aca/frontend/auth/logout";
import { FocusedActionLayout } from "@aca/frontend/layouts/FocusedActionLayout/FocusedActionLayout";

export default function LogoutPage() {
  useEffect(() => {
    logout();
  }, []);

  return <FocusedActionLayout>Logging out...</FocusedActionLayout>;
}
