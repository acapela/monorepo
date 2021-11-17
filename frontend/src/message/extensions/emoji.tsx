import type { BaseEmoji } from "emoji-mart";
import React, { useState } from "react";
import styled from "styled-components";

import { createAutocompletePlugin } from "~richEditor/autocomplete";
import { AutocompletePickerProps } from "~richEditor/autocomplete/component";
import { useAsyncEffect } from "~shared/hooks/useAsyncEffect";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { SelectList } from "~ui/SelectList";
import { theme } from "~ui/theme";

interface EmojiData {
  name: string;
  emoji: string;
}

function EmojiPicker({ keyword, onSelect }: AutocompletePickerProps<EmojiData>) {
  const [results, setResults] = useState<BaseEmoji[]>([]);

  useAsyncEffect(
    async ({ getIsCancelled }) => {
      const { emojiIndex } = await import("emoji-mart");

      if (getIsCancelled()) return;

      setResults((emojiIndex.search(keyword) as BaseEmoji[]) ?? []);
    },
    [keyword]
  );

  return (
    <SelectList<BaseEmoji>
      items={results.slice(0, 5)}
      noItemsPlaceholder={
        <EmptyStatePlaceholder
          description={keyword.length === 0 ? "Type to search for emojis" : "No emoji found"}
          noSpacing
        />
      }
      keyGetter={(emoji) => emoji.id + emoji.name}
      onItemSelected={(emoji) => {
        onSelect([{ emoji: emoji.native, name: emoji.id }]);
      }}
      renderItem={(emoji) => {
        return (
          <UISelectItem>
            <UIPickerEmoji>{emoji.native}</UIPickerEmoji> :{emoji.id}
          </UISelectItem>
        );
      }}
    />
  );
}

export const emojiAutocompleteExtension = createAutocompletePlugin<EmojiData>({
  type: "emoji",
  triggerChar: ":",
  nodeComponent({ data }) {
    // TODO: We might want a bit different UI for emoji eg. a bit bigger font face then the rest of the text
    return <UIEmoji data-tooltip={`:${data.name}`}>{data.emoji}</UIEmoji>;
  },
  pickerComponent: EmojiPicker,
});

const UISelectItem = styled.div<{}>`
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap};
`;

/**
 * Emoji has larger font size than surrounding text. This is this size difference ratio.
 */
const EMOJI_SIZE_RATIO = 1.5;

const UIEmoji = styled.span`
  font-size: ${EMOJI_SIZE_RATIO}em;
  line-height: ${1 / EMOJI_SIZE_RATIO}em;
  /* Lets make emoji vertically aligned to the rest of the text */
  vertical-align: middle;
`;

const UIPickerEmoji = styled.span`
  font-size: ${EMOJI_SIZE_RATIO}em;
  /* Lets make emoji vertically aligned to the rest of the text */
  vertical-align: middle;
`;
