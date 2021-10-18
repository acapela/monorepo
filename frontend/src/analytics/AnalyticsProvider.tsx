import { ErrorBoundary } from "@sentry/nextjs";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { useNullableDb } from "~frontend/clientdb";
import { useCurrentTeam } from "~frontend/team/CurrentTeam";
import { ClientSideOnly } from "~ui/ClientSideOnly";

import { SegmentScript } from "./SegmentScript";
import { identifyUser, identifyUserGroup } from "./tracking";

export const AnalyticsManager = observer(() => {
  const db = useNullableDb();
  const userToken = useCurrentUserTokenData();
  const team = useCurrentTeam();
  const user = userToken && db ? db.user.findById(userToken.id) : null;

  const [isSegmentLoaded, setIsSegmentLoaded] = useState(false);

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
    if (!teamName || !teamId || !isSegmentLoaded || !user) {
      return;
    }

    const { id, name, email, avatar_url } = user;
    identifyUser({ id, name, email, avatarUrl: avatar_url });

    identifyUserGroup(teamId, { teamName, teamId });
  }, [user, isSegmentLoaded, teamName, teamId]);

  return (
    <ClientSideOnly onClientRendered={tryToInitialize}>
      <ErrorBoundary fallback={<></>}>
        <SegmentScript />
      </ErrorBoundary>
    </ClientSideOnly>
  );
});
