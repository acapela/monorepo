import { ErrorBoundary } from "@sentry/nextjs";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { useCurrentTeam } from "~frontend/team/useCurrentTeamId";
import { ClientSideOnly } from "~ui/ClientSideOnly";

import { SegmentScript } from "./SegmentScript";
import { identifyUser, identifyUserGroup } from "./tracking";

export const AnalyticsManager = observer(() => {
  const [isSegmentLoaded, setIsSegmentLoaded] = useState(false);
  const currentUser = useCurrentUserTokenData();
  const team = useCurrentTeam();

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

  // Team is observable so unwrap it inside the observer instead of inside of useEffect
  const teamName = team?.name;
  const teamId = team?.id;

  useEffect(() => {
    if (!teamName || !teamId) return;
    if (!isSegmentLoaded) return;
    if (!currentUser) return;

    const { id, email, name, picture } = currentUser;

    identifyUser({
      id,
      email,
      name,
      avatarUrl: picture ?? undefined,
    });

    identifyUserGroup(teamId, { teamName, teamId });
  }, [currentUser, isSegmentLoaded, teamName, teamId]);

  return (
    <ClientSideOnly onClientRendered={tryToInitialize}>
      <ErrorBoundary fallback={<></>}>
        <SegmentScript />
      </ErrorBoundary>
    </ClientSideOnly>
  );
});
