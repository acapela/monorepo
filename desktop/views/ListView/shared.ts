import { debounce } from "lodash";
import { action } from "mobx";
import { RefObject, useEffect } from "react";
import styled from "styled-components";

import { uiStore } from "@aca/desktop/store/ui";
import { theme } from "@aca/ui/theme";

const SENDERS_WIDTH = 150;

// DOM-element <> notification/group id map
const elementIdMap = new WeakMap<HTMLElement, string>();

// We keep simple, non-mobx version of visible ids that is real-time and then periodically flush it to sync it with mobx store
const liveVisibleIds = new Set<string>();

const scheduleVisibleIdsUpdate = debounce(
  action(() => {
    uiStore.visibleRowIds = new Set(Array.from(liveVisibleIds));
  }),
  50
);

/**
 * Very often multiple rows at once will change their visibility status. Let's use shared observer
 * to batch those changes
 */
const observer = new IntersectionObserver(
  (visibilityChangeRecords) => {
    for (const entry of visibilityChangeRecords) {
      const id = elementIdMap.get(entry.target as HTMLElement);

      if (!id) continue;

      if (entry.isIntersecting) {
        liveVisibleIds.add(id);
      } else {
        liveVisibleIds.delete(id);
      }
    }

    scheduleVisibleIdsUpdate();
  },
  { threshold: [0, 1] }
);

export function useStoreRowVisibility(ref: RefObject<HTMLElement>, id: string) {
  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    // Connect dom element with notification / group id
    elementIdMap.set(element, id);

    observer.observe(element);

    return action(() => {
      elementIdMap.delete(element);
      observer.unobserve(element);

      liveVisibleIds.delete(id);

      scheduleVisibleIdsUpdate();
    });
  }, [ref, id]);
}

export const UISendersLabel = styled.div`
  ${theme.typo.content.medium};
  ${theme.common.ellipsisText};
  width: ${SENDERS_WIDTH}px;
  max-width: ${SENDERS_WIDTH}px;
  display: flex;
  align-items: center;
`;

export const UINotificationRowTitle = styled.div`
  ${theme.typo.content.medium};
  ${theme.common.ellipsisText};
`;

export const UINotificationGroupTitle = styled(UINotificationRowTitle)`
  min-width: 0;
  flex-grow: 1;
  flex-basis: 0;
`;

export const UINotificationPreviewText = styled.div`
  ${theme.typo.content.opacity(0.6)};
  ${theme.common.ellipsisText};
  flex-grow: 1;
  flex-basis: 0;
`;

export const UIDate = styled.div`
  opacity: 0.6;
  min-width: 4ch;
  text-align: right;
`;
