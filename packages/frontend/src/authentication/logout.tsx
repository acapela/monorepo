import React, { useState } from "react";
import { Button } from "../design/Button";
import firebase from "../firebase";

interface Logout {
  loading: boolean;
  logout: () => Promise<void>;
}

const useLogout = (): Logout => {
  const [loading, setLoading] = useState(false);
  async function logout() {
    setLoading(true);
    await firebase.auth().signOut();
  }

  return { loading, logout };
};

export const LogoutButton = ({ className }: { className?: string }) => {
  const { loading, logout } = useLogout();

  return (
    <Button className={className} onClick={logout} loading={loading}>
      Log out
    </Button>
  );
};
