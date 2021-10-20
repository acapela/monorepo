import { toPairs } from "lodash";
import React from "react";

import { MENTION_TYPE_PICKER_LABELS, MentionType } from "~shared/types/mention";
import { ItemsDropdown } from "~ui/forms/OptionsDropdown/ItemsDropdown";

export function MentionTypePicker({
  selected,
  onSelect,
}: {
  selected: MentionType;
  onSelect: (mention: MentionType) => void;
}) {
  const mentionLabelPairs = toPairs(MENTION_TYPE_PICKER_LABELS) as [MentionType, string][];
  const selectedPair = [selected, MENTION_TYPE_PICKER_LABELS[selected]] as const;

  return (
    <ItemsDropdown
      items={mentionLabelPairs}
      keyGetter={([mentionType]) => mentionType}
      onItemSelected={([mentionType]) => onSelect(mentionType)}
      labelGetter={([, mentionLabel]) => mentionLabel}
      selectedItems={[selectedPair]}
      dividerIndexes={[mentionLabelPairs.length - 1]}
    />
  );
}
