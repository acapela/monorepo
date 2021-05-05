import { signOut } from "next-auth/client";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return <div>Logging out...</div>;
}
