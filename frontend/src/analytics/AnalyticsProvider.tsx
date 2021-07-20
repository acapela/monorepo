import { useState, useEffect } from "react";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { fetchTeamBasicInfoQuery } from "~frontend/gql/teams";
import { identifyUser, identifyUserGroup } from "./tracking";
import { SegmentScript } from "./SegmentScript";
import { ErrorBoundary } from "~ui/ErrorBoundary";
import { ClientSideOnly } from "~ui/ClientSideOnly";

export function AnalyticsManager() {
  const [isSegmentLoaded, setIsSegmentLoaded] = useState(false);
  const currentUser = useCurrentUser();

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

    const { id, email, name, picture, currentTeamId } = currentUser;

    identifyUser({
      id,
      email,
      name,
      avatarUrl: picture ?? undefined,
    });

    if (!currentTeamId) return;
    const updateUserGroup = async () => {
      const result = await fetchTeamBasicInfoQuery({ teamId: currentTeamId });
      if (!result.team) return;
      identifyUserGroup(currentTeamId, { teamName: result.team.name, teamId: currentTeamId });
    };
    updateUserGroup();
  }, [currentUser, isSegmentLoaded]);

  return (
    <ClientSideOnly onClientRendered={tryToInitialize}>
      <ErrorBoundary errorFallback={null}>
        <SegmentScript />
      </ErrorBoundary>
    </ClientSideOnly>
  );
}
