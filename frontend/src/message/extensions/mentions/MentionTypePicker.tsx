import { omit, toPairs } from "lodash";
import { observer } from "mobx-react";
import React from "react";

import { usePersistedState } from "~frontend/hooks/usePersistedState";
import { MENTION_TYPE_PICKER_LABELS, MentionType, REQUEST_DECISION } from "~shared/requests";
import { ItemsDropdown } from "~ui/forms/OptionsDropdown/ItemsDropdown";

interface Props {
  selected?: MentionType;
  onSelect: (mention: MentionType) => void;
}

const ENABLE_REQUEST_DECISION = "ENABLE_REQUEST_DECISION";

export const MentionTypePicker = observer(function MentionTypePicker({ selected, onSelect }: Props) {
  const [isDecisionFeatureFlagEnabled] = usePersistedState<boolean>({
    key: ENABLE_REQUEST_DECISION,
    initialValue: false,
    isDetachedFromTeam: true,
  });

  const availableMentionTypePickerLabels = isDecisionFeatureFlagEnabled
    ? MENTION_TYPE_PICKER_LABELS
    : omit(MENTION_TYPE_PICKER_LABELS, [REQUEST_DECISION]);

  const mentionLabelPairs = toPairs(availableMentionTypePickerLabels) as [MentionType, string][];
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
