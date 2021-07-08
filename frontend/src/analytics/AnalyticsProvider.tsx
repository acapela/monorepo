import { useState } from "react";
import { useEffect } from "react";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { identifyUser, identifyUserGroup } from "./tracking";
import { SegmentScript } from "./SegmentScript";
import { ErrorBoundary } from "~ui/ErrorBoundary";

export function AnalyticsManager() {
  const [isSegmentLoaded, setIsSegmentLoaded] = useState(false);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!window.analytics) {
      if (process.env.NEXT_PUBLIC_SEGMENT_API_KEY) {
        console.warn(`Segment API key is provided but analytics is not initialized in the window.`);
      }

      return;
    }

    window.analytics.ready(() => {
      setIsSegmentLoaded(true);
    });
  });

  useEffect(() => {
    if (!isSegmentLoaded) return;
    if (!currentUser) return;

    identifyUser({
      id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
      avatarUrl: currentUser.picture ?? undefined,
    });

    if (currentUser.currentTeamId) {
      identifyUserGroup("Team", { teamId: currentUser.currentTeamId });
    }
  }, [currentUser, isSegmentLoaded]);

  return (
    <ErrorBoundary errorFallback={null}>
      <SegmentScript />
    </ErrorBoundary>
  );
}
