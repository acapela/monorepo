import { AnimatePresence } from "framer-motion";
import { sortBy } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { cachedComputed } from "@aca/clientdb";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { getNotificationMeta } from "@aca/desktop/domains/notification/meta";
import { NotificationTag } from "@aca/desktop/domains/notification/tag";
import { getArrayWithElementToggled } from "@aca/shared/array";
import { PopPresenceAnimator } from "@aca/ui/animations";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconCross } from "@aca/ui/icons";

import { NotificationTagDisplayer } from "./NotificationTag";

interface Props {
  allItems: NotificationOrGroup[];
  selectedTags: NotificationTag[];
  onChange: (tags: NotificationTag[]) => void;
}

function getItemTags(item: NotificationOrGroup): NotificationTag[] | undefined {
  if (item.kind === "group") {
    return getNotificationMeta(item.notifications[0]).tags;
  }

  return getNotificationMeta(item).tags;
}

const collectUniqueTags = cachedComputed((items: NotificationOrGroup[]): NotificationTag[] => {
  const allTags = new Set<NotificationTag>();
  // We will sort tags by how often they were used
  const tagUsedCount = new WeakMap<NotificationTag, number>();

  function markAsUsed(tag: NotificationTag) {
    tagUsedCount.set(tag, (tagUsedCount.get(tag) ?? 0) + 1);
  }

  for (const item of items) {
    const itemTags = getItemTags(item);

    if (itemTags) {
      for (const tag of itemTags) {
        markAsUsed(tag);
        allTags.add(tag);
      }
    }
  }

  const allUSedTags = Array.from(allTags);

  return sortBy(allUSedTags, (tag) => {
    return -1 * tagUsedCount.get(tag)!;
  });
});

export const TagFilters = observer(({ allItems, onChange, selectedTags }: Props) => {
  const allTags = collectUniqueTags(allItems).slice(0, 20);

  if (!allTags.length) return null;

  function toggleTag(tag: NotificationTag) {
    onChange(getArrayWithElementToggled(selectedTags, tag));
  }

  return (
    <UIHolder>
      {allTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <NotificationTagDisplayer key={tag.id} isSelected={isSelected} tag={tag} onClick={toggleTag} forceShowLabel />
        );
      })}
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <PopPresenceAnimator>
            <IconButton
              tooltip="Clear tag filters"
              icon={<IconCross />}
              size="compact"
              onClick={() => {
                onChange([]);
              }}
            />
          </PopPresenceAnimator>
        )}
      </AnimatePresence>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 24px;
`;
