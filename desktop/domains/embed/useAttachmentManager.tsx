import { autorun } from "mobx";
import { useLayoutEffect } from "react";

import { requestAttachPreview, requestSetPreviewOnTopState, startPreviewAnimation } from "@aca/desktop/bridge/preview";
import { focusMainViewRequest } from "@aca/desktop/bridge/system";
import { getIsRouteActive, routeChangeAtom } from "@aca/desktop/routes";
import { createCleanupObject } from "@aca/shared/cleanup";
import { MaybeCleanup } from "@aca/shared/types";

import { animationStore } from "./animationStore";
import { PreviewPosition } from ".";

interface Props {
  url: string;
  position: PreviewPosition | null;
}

let previousAttachedPreview: { url: string; cleanup: MaybeCleanup } | null | undefined;

export function useAttachmentManager({ url, position }: Props) {
  const { upcomingEmbedAnimation: animation } = animationStore;

  useLayoutEffect(() => {
    if (!position) return;

    const toCleanUp = createCleanupObject();

    const isSameNotificationAsPrevious = url === previousAttachedPreview?.url;

    let animationPromise: Promise<void> | undefined;

    if (animation === "instant" || !previousAttachedPreview) {
      toCleanUp.next = requestAttachPreview({ url, position });
    }

    if (animation !== "instant" && !isSameNotificationAsPrevious && previousAttachedPreview) {
      // Prevents outgoing embed animation from appearing over to top bar
      focusMainViewRequest();
      requestSetPreviewOnTopState({ url: previousAttachedPreview.url, state: "app-on-top" });

      animationPromise = startPreviewAnimation({
        startUrl: previousAttachedPreview.url,
        endUrl: url,
        position,
        animation,
      });

      toCleanUp.next = requestAttachPreview({ url, position });
    }

    // We should only detach previous view when notifications
    if (!isSameNotificationAsPrevious) {
      // We only try to cleanup the previous attached preview when all the animations are done
      (animationPromise ?? Promise.resolve()).then(() => {
        previousAttachedPreview?.cleanup?.();

        previousAttachedPreview = {
          url,
          cleanup: () => toCleanUp.clean(),
        };
      });
    }
  }, [url, animation, !!position]);
}

autorun(() => {
  routeChangeAtom.reportObserved();

  if (!getIsRouteActive("focus") && !getIsRouteActive("compose")) {
    previousAttachedPreview?.cleanup?.();
    previousAttachedPreview = null;
    animationStore.upcomingEmbedAnimation = "instant";
  }
});
