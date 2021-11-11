import { signOut } from "next-auth/react";

export function logout() {
  signOut({ callbackUrl: "/" });
}
