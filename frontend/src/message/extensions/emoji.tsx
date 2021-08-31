import { BaseEmoji, emojiIndex } from "emoji-mart";
import React from "react";
import styled from "styled-components";

import { createAutocompletePlugin } from "~richEditor/autocomplete";
import { AutocompletePickerProps } from "~richEditor/autocomplete/component";
import { SelectList } from "~ui/SelectList";
import { theme } from "~ui/theme";

interface EmojiData {
  name: string;
  emoji: string;
}

function UserPicker({ keyword, onSelect }: AutocompletePickerProps<EmojiData>) {
  const matchingEmoji = (emojiIndex.search(keyword) as BaseEmoji[]) ?? [];

  if (!keyword) {
    return <StateDescription>Type to search for emojis</StateDescription>;
  }

  if (!matchingEmoji.length) {
    return <StateDescription>No emoji found for :{keyword}</StateDescription>;
  }

  return (
    <SelectList<BaseEmoji>
      items={matchingEmoji.slice(0, 5)}
      keyGetter={(emoji) => emoji.id + emoji.name}
      onItemSelected={(emoji) => {
        onSelect({ emoji: emoji.native, name: emoji.id });
      }}
      renderItem={(emoji) => {
        return (
          <UISelectItem>
            {emoji.native} :{emoji.id}
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
  pickerComponent: UserPicker,
});

const UISelectItem = styled.div<{}>`
  display: flex;
  align-items: center;
`;

const StateDescription = styled.div<{}>`
  width: 240px;
  ${theme.font.body14.semibold.build()};
  padding: 16px;
  background: ${theme.colors.layout.foreground()};
  border: 1px solid ${theme.colors.layout.softLine()};
  box-sizing: border-box;
  ${theme.shadow.modal};
  ${theme.borderRadius.menu}
`;

const EMOJI_SIZE_RATIO = 1.5;

const UIEmoji = styled.span`
  font-size: ${EMOJI_SIZE_RATIO}em;
  line-height: ${1 / EMOJI_SIZE_RATIO}em;
  /* Lets make emoji vertically aligned to the rest of the text */
  vertical-align: middle;
`;
