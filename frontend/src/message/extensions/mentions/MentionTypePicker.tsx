import { toPairs } from "lodash";
import { observer } from "mobx-react";
import React from "react";

import { MENTION_TYPE_PICKER_LABELS, MentionType } from "@aca/shared/requests";
import { ItemsDropdown } from "@aca/ui/forms/OptionsDropdown/ItemsDropdown";

interface Props {
  selected?: MentionType;
  onSelect: (mention: MentionType) => void;
}

export const MentionTypePicker = observer(function MentionTypePicker({ selected, onSelect }: Props) {
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
});
