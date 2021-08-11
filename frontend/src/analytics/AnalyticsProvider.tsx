import { useState, useEffect } from "react";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { fetchTeamBasicInfoQuery } from "~frontend/gql/teams";
import { identifyUser, identifyUserGroup } from "./tracking";
import { SegmentScript } from "./SegmentScript";
import { ErrorBoundary } from "~ui/ErrorBoundary";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { useCurrentTeamId } from "~frontend/team/useCurrentTeamId";

export function AnalyticsManager() {
  const [isSegmentLoaded, setIsSegmentLoaded] = useState(false);
  const currentUser = useCurrentUser();
  const teamId = useCurrentTeamId();

  function tryToInitialize() {
    if (!window.analytics) {
      if (process.env.NEXT_PUBLIC_SEGMENT_API_KEY) {
        console.warn(`Segment API key is provided but analytics is not initialized in the window.`);
      }

      return;
    }

    window.analytics.ready(() => {
      setIsSegmentLoaded(true);
    });
  }

  useEffect(() => {
    if (!isSegmentLoaded) return;
    if (!currentUser) return;

    const { id, email, name, picture } = currentUser;

    identifyUser({
      id,
      email,
      name,
      avatarUrl: picture ?? undefined,
    });

    if (!teamId) return;
    const updateUserGroup = async () => {
      const result = await fetchTeamBasicInfoQuery({ teamId });
      if (!result.team) return;
      identifyUserGroup(teamId, { teamName: result.team.name, teamId });
    };
    updateUserGroup();
  }, [currentUser, isSegmentLoaded, teamId]);

  return (
    <ClientSideOnly onClientRendered={tryToInitialize}>
      <ErrorBoundary errorFallback={null}>
        <SegmentScript />
      </ErrorBoundary>
    </ClientSideOnly>
  );
}
