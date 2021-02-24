import { signIn, useSession } from "next-auth/client";
import React from "react";
import { Button } from "../design/Button";

export const GoogleLoginButton = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}): JSX.Element => {
  function handleLogin() {
    signIn("google");
  }

  return (
    <Button className={className} onClick={() => handleLogin()} loading={false}>
      {children || "Log in with Google"}
    </Button>
  );
};

export function useCurrentUser() {
  const [session, isLoading] = useSession();

  const user = {
    ...session,
    id: session?.sub,
  };

  return { loading: isLoading, user: user };
}
