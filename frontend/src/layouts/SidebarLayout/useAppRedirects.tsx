import { signOut } from "next-auth/react";
import router from "next/router";
import { useState } from "react";
import { useIsomorphicLayoutEffect } from "react-use";

import { useCurrentUserTokenData } from "@aca/frontend/authentication/useCurrentUser";
import { useNullableDb } from "@aca/frontend/clientdb";
import { useCurrentTeamContext } from "@aca/frontend/team/CurrentTeam";
import { routes } from "@aca/shared/routes";

/**
 * Will manage redirecting user to proper page depending on app state.
 *
 * eg. if there is no team - will force redirect to create new team flow.
 */
export function useAppRedirects() {
  const [willRedirect, setWillRedirect] = useState(false);
  const userTokenData = useCurrentUserTokenData();

  const db = useNullableDb();
  const user = userTokenData && db && db.user.findById(userTokenData.id);
  const isUserWithoutAccount = user && !user.has_account;
  const teamInfo = useCurrentTeamContext();

  useIsomorphicLayoutEffect(() => {
    if (isUserWithoutAccount) {
      setWillRedirect(false);
      signOut();
      return;
    }

    if (!userTokenData || !user) {
      router.push(routes.login);
      setWillRedirect(true);
      return;
    }

    if (teamInfo.isLoading) {
      return;
    }

    if (!teamInfo.teamId) {
      router.push(routes.teamSelect);
      setWillRedirect(true);
      return;
    }
  }, [isUserWithoutAccount, userTokenData, user, teamInfo]);

  return willRedirect;
}
