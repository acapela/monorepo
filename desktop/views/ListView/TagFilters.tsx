import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import styled from "styled-components";

import { groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { NotificationTagDisplayer } from "@aca/desktop/domains/tag/NotificationTag";
import { NotificationTag } from "@aca/desktop/domains/tag/tag";
import { getArrayWithElementToggled, getArraysCommonPart } from "@aca/shared/array";
import { PopPresenceAnimator } from "@aca/ui/animations";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconCross } from "@aca/ui/icons";

interface Props {
  list: NotificationsList;
  selectedTags: NotificationTag[];
  onChange: (tags: NotificationTag[]) => void;
}

export const TagFilters = observer(({ list, onChange, selectedTags }: Props) => {
  const allTags = list.collectTags();

  function toggleTag(tag: NotificationTag) {
    onChange(getArrayWithElementToggled(selectedTags, tag));
  }

  useEffect(() => {
    const existingSelectedTags = getArraysCommonPart(
      selectedTags,
      allTags.map((info) => info.tag)
    );

    if (existingSelectedTags.length === selectedTags.length) return;

    onChange(existingSelectedTags);
  }, [allTags]);

  if (!allTags.length) return null;

  return (
    <UIHolder>
      {allTags.slice(0, 20).map(({ tag, usedBy }) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <NotificationTagDisplayer
            key={tag.id}
            isSelected={isSelected}
            tag={tag}
            onClick={toggleTag}
            forceShowLabel
            count={groupNotifications(usedBy).length}
          />
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
