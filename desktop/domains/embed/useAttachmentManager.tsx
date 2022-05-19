import { autorun } from "mobx";
import { useLayoutEffect } from "react";

import { requestAttachPreview, startPreviewAnimation } from "@aca/desktop/bridge/preview";
import { getIsRouteActive, routeChangeAtom } from "@aca/desktop/routes";
import { createCleanupObject } from "@aca/shared/cleanup";

import { animationStore } from "./animationStore";
import { PreviewPosition } from ".";

interface Props {
  url: string;
  position: PreviewPosition | null;
}

let previousAttachedPreviewCleanup: ReturnType<typeof createCleanupObject>;

export function useAttachmentManager({ url, position }: Props) {
  const { animation, currentNotification, targetNotification } = animationStore;

  useLayoutEffect(() => {
    if (!position) return;

    const cleanup = createCleanupObject();

    const isSameNotifications = !!currentNotification && currentNotification == targetNotification;

    let animationPromise: Promise<void> | undefined;

    if (animation === "instant" || !targetNotification) {
      cleanup.next = requestAttachPreview({ url, position });
    }

    if (animation !== "instant" && targetNotification && currentNotification && !isSameNotifications) {
      animationPromise = startPreviewAnimation({
        start: { url: currentNotification, position },
        end: { url: targetNotification, position },
        animation,
      });

      cleanup.next = requestAttachPreview({ url: targetNotification, position, skipPositionUpdate: true });
    }

    // When the notifications
    if (!isSameNotifications) {
      (animationPromise ?? Promise.resolve()).then(() => previousAttachedPreviewCleanup?.clean());
    }

    return () => {
      if (!isSameNotifications) {
        previousAttachedPreviewCleanup = cleanup;
      }
    };
  }, [url, animation, currentNotification, targetNotification, !!position]);
}

autorun(() => {
  routeChangeAtom.reportObserved();

  if (!getIsRouteActive("focus")) {
    previousAttachedPreviewCleanup?.clean();
  }
});
