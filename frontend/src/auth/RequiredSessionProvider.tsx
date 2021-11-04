import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

import { FocusedActionLayout } from "~frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { LoginOptionsView } from "~frontend/views/LoginOptionsView";
import { useConst } from "~shared/hooks/useConst";

interface Props {
  session: Session | null;
  children: ReactNode;
  dontRequireSession?: Boolean;
}

/**
 * Will render the app, setting up auth provider, but will also render login view on any page
 * if user is not logged in.
 */
export function RequiredSessionProvider({ session, children, dontRequireSession }: Props) {
  const sessionFromServer = useConst(() => session);

  return (
    <SessionProvider session={sessionFromServer}>
      {!sessionFromServer && !dontRequireSession && (
        <FocusedActionLayout title="Log in to start using Acapela">{<LoginOptionsView />}</FocusedActionLayout>
      )}
      {(sessionFromServer || dontRequireSession) && children}
    </SessionProvider>
  );
}
