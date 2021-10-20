import { toPairs } from "lodash";
import React from "react";

import { MENTION_OBSERVER, MentionType, REQUEST_ACTION, REQUEST_READ, REQUEST_RESPONSE } from "~shared/types/mention";
import { ItemsDropdown } from "~ui/forms/OptionsDropdown/ItemsDropdown";

const MENTION_TYPE_PICKER_LABELS: Record<MentionType, string> = {
  [REQUEST_RESPONSE]: "Request response",
  [REQUEST_READ]: "Request read confirmation",
  [REQUEST_ACTION]: "Request action",
  [MENTION_OBSERVER]: "Add as observer",
};

// TODO: Add functionality that displays previously selected mention when editing
export function MentionTypePicker({ onSelect }: { onSelect: (mention: MentionType) => void }) {
  const mentionLabelPairs = toPairs(MENTION_TYPE_PICKER_LABELS) as [MentionType, string][];

  return (
    <ItemsDropdown
      items={mentionLabelPairs}
      keyGetter={([mentionType]) => mentionType}
      onItemSelected={([mentionType]) => onSelect(mentionType)}
      labelGetter={([, mentionLabel]) => mentionLabel}
      selectedItems={[]}
      dividerIndexes={[mentionLabelPairs.length - 1]}
    />
  );
}
