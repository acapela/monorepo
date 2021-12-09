import { toPairs } from "lodash";
import React from "react";

import { MENTION_TYPE_PICKER_LABELS, MentionType } from "~shared/types/mention";
import { ItemsDropdown } from "~ui/forms/OptionsDropdown/ItemsDropdown";

interface Props {
  selected?: MentionType;
  onSelect: (mention: MentionType) => void;
}

export function MentionTypePicker({ selected, onSelect }: Props) {
  const mentionLabelPairs = toPairs(MENTION_TYPE_PICKER_LABELS) as [MentionType, string][];
  const selectedPair = selected ? [selected, MENTION_TYPE_PICKER_LABELS[selected]] : [];

  return (
    <ItemsDropdown
      items={mentionLabelPairs}
      keyGetter={([mentionType]) => mentionType}
      onItemSelected={([mentionType]) => onSelect(mentionType)}
      labelGetter={([, mentionLabel]) => mentionLabel}
      selectedItems={[selectedPair as [MentionType, string]]}
      dividerIndexes={[mentionLabelPairs.length - 1]}
    />
  );
}
