import { signOut } from "next-auth/client";
import React, { useState } from "react";

import { Button } from "~ui/buttons/Button";

interface Logout {
  loading: boolean;
  logout: () => Promise<void>;
}

const useLogout = (): Logout => {
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await signOut();
  }

  return { loading, logout };
};

export const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <Button onClick={logout} isLoading={loading}>
      Log out
    </Button>
  );
};
