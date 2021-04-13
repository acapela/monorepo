import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

export const AuthenticatedRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [session, isLoading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      const currentRoute = router.asPath;
      const redirectUrl = encodeURIComponent(currentRoute);
      router.replace(`/login?redirectUrl=${redirectUrl}`);
    }
  }, [isLoading, session]);

  if (isLoading || !session) {
    return <>Loading...</>; // TODO: fullscreen loader component
  }
  return <>{children}</>;
};

export function withAuthenticatedRoute<T>(Component: React.ComponentType<T>): React.ComponentType<T> {
  const AuthenticatedComponent = (props: T) => {
    return (
      <AuthenticatedRoute>
        <Component {...props} />
      </AuthenticatedRoute>
    );
  };

  return AuthenticatedComponent;
}
