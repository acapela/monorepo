import { signOut } from "next-auth/react";
import router from "next/router";
import { useIsomorphicLayoutEffect } from "react-use";

import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { useNullableDb } from "~frontend/clientdb";
import { useCurrentTeamContext } from "~frontend/team/CurrentTeam";
import { routes } from "~shared/routes";

/**
 * Will manage redirecting user to proper page depending on app state.
 *
 * eg. if there is no team - will force redirect to create new team flow.
 */
export function useAppRedirects() {
  const userTokenData = useCurrentUserTokenData();

  const db = useNullableDb();
  const user = userTokenData && db && db.user.findById(userTokenData.id);
  const isUserWithoutAccount = user && !user.has_account;
  const teamInfo = useCurrentTeamContext();

  useIsomorphicLayoutEffect(() => {
    if (isUserWithoutAccount) {
      signOut();
      return;
    }

    if (!userTokenData || !user) {
      router.push(routes.login);
      return;
    }

    if (teamInfo.isLoading) {
      return;
    }

    if (!teamInfo.teamId) {
      router.push(routes.teamSelect);
      return;
    }
  }, [isUserWithoutAccount, userTokenData, user, teamInfo]);
}
