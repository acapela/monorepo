import { assertDefined } from "~shared/assert";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useUserDetailedInfoQuery } from "~frontend/gql/user";

export const useCurrentTeamId = (): string | null => {
  const user = useCurrentUser();
  const [userDetailed] = useUserDetailedInfoQuery({ id: user?.id || "" });

  if (userDetailed) {
    return userDetailed.current_team?.id || null;
  }

  return user?.currentTeamId || null;
};

export function useAssertCurrentTeamId(): string {
  const currentTeamId = useCurrentTeamId();

  return assertDefined(currentTeamId, "No team id");
}
