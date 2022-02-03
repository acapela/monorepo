import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

import { FocusedActionLayout } from "@aca/frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { LoginOptionsView } from "@aca/frontend/views/LoginOptionsView";
import { useConst } from "@aca/shared/hooks/useConst";
import { AppThemeProvider } from "@aca/ui/theme";

import { BuiltInStyles } from "../../pages/_app";

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
      {/* SessionProvider seems to be eating up the Styled Components context. */}
      {/* AppThemeProvider should be set nested inside SessionProvider to avoid this. */}
      <AppThemeProvider>
        <BuiltInStyles />
        {!sessionFromServer && !dontRequireSession && (
          <FocusedActionLayout title="Log in to start using Acapela">
            <LoginOptionsView />
          </FocusedActionLayout>
        )}
        {(sessionFromServer || dontRequireSession) && children}
      </AppThemeProvider>
    </SessionProvider>
  );
}
