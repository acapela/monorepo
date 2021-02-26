import { signIn, useSession } from "next-auth/client";
import React from "react";
import { Button } from "@acapela/ui/button";

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
    <Button className={className} onClick={() => handleLogin()} isLoading={false}>
      {children || "Log in with Google"}
    </Button>
  );
};

export function useCurrentUser() {
  const [session, isLoading] = useSession();

  function getUser() {
    if (session) {
      return {
        ...session,
        id: session?.sub,
      };
    }

    return null;
  }

  return { loading: isLoading, user: getUser() };
}
