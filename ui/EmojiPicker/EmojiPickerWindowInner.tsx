import { Index } from "flexsearch";
import { chunk, memoize } from "lodash";
import { useMemo, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { List } from "react-virtualized";
import styled from "styled-components";
import emojiByCategory from "unicode-emoji-json/data-by-group.json";

import { typedKeys } from "~shared/object";
import { TextInput } from "~ui/forms/TextInput";
import { theme } from "~ui/theme";

export type EmojiData = typeof emojiByCategory["Smileys & Emotion"][0];

const EMOJI_SIZE = 30;
const EMOJI_IN_ROW_COUNT = 10;

const PICKER_WIDTH = EMOJI_SIZE * EMOJI_IN_ROW_COUNT;
const PICKER_HEIGHT = EMOJI_SIZE * 7;

type VirtualizedRow =
  | {
      type: "header";
      label: string;
    }
  | {
      type: "emoji-row";
      emojiInRow: EmojiData[];
    };

function convertEmojiListToVirtualizedRows(emojiList: EmojiData[]): VirtualizedRow[] {
  const rows: VirtualizedRow[] = [];
  const emojiRows = chunk(emojiList, 10);

  for (const emojiRow of emojiRows) {
    rows.push({ type: "emoji-row", emojiInRow: emojiRow });
  }

  return rows;
}

function convertEmojiMapToVirtualizedRows(): VirtualizedRow[] {
  const rows: VirtualizedRow[] = [];

  for (const categoryName of typedKeys(emojiByCategory)) {
    const categoryEmojiList = emojiByCategory[categoryName] as EmojiData[];

    rows.push({ type: "header", label: categoryName });

    const emojiRows = convertEmojiListToVirtualizedRows(categoryEmojiList);
    rows.push(...emojiRows);
  }

  return rows;
}

function getAllEmojiList() {
  const emojiList: EmojiData[] = [];

  for (const categoryName of typedKeys(emojiByCategory)) {
    const categoryEmojiList = emojiByCategory[categoryName] as EmojiData[];

    emojiList.push(...categoryEmojiList);
  }

  return emojiList;
}

function getEmojiSearchData(emoji: EmojiData): string {
  return [emoji.name, emoji.slug].join(" ");
}

const getEmojiSearchIndex = memoize(() => {
  const allEmoji = getAllEmojiList();
  const emojiSlugMap = new Map<string, EmojiData>();

  const index = new Index({
    preset: "match",
    // Will find "hello", when looking for "he"
    tokenize: "full",
    // Will normalize custom characters.
    charset: "lating:advanced",
    language: "en",
  });

  allEmoji.forEach((emoji) => {
    emojiSlugMap.set(emoji.slug, emoji);
    index.add(emoji.slug, getEmojiSearchData(emoji));
  });

  function search(input: string) {
    return index.search(input).map((slug) => emojiSlugMap.get(slug as string)!);
  }

  return search;
});

const emojiVirtualizedRows = convertEmojiMapToVirtualizedRows();

export interface EmojiPickerProps {
  onEmojiPicked?: (emoji: EmojiData) => void;
}

export function EmojiPickerWindowInner({ onEmojiPicked }: EmojiPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const searchResult = useMemo<VirtualizedRow[] | null>(() => {
    if (!searchTerm.trim()) return null;

    const search = getEmojiSearchIndex();

    const foundEmoji = search(searchTerm);

    return convertEmojiListToVirtualizedRows(foundEmoji);
  }, [searchTerm]);

  const resultsToShow = searchResult ?? emojiVirtualizedRows;

  return (
    <UIHolder>
      <UISearch>
        <UISearchInput
          placeholder="Search..."
          autoFocus
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
      </UISearch>
      <UIEmojiList>
        <List
          rowCount={resultsToShow.length}
          rowHeight={EMOJI_SIZE}
          height={PICKER_HEIGHT}
          width={PICKER_WIDTH}
          rowRenderer={(row) => {
            const { index, style } = row;
            const rowData = resultsToShow[index];

            if (rowData.type === "header") {
              return <UIHeader style={style}>{rowData.label}</UIHeader>;
            }

            return (
              <UIEmojiRow style={style}>
                {rowData.emojiInRow.map((emoji) => {
                  return (
                    <UIEmojiButton
                      key={emoji.slug}
                      data-tooltip={`:${emoji.slug}:`}
                      onClick={() => {
                        onEmojiPicked?.(emoji);
                      }}
                    >
                      {emoji.emoji}
                    </UIEmojiButton>
                  );
                })}
              </UIEmojiRow>
            );
          }}
        />
      </UIEmojiList>
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>``;

const UISearch = styled.div``;

const UISearchInput = styled.input`
  ${theme.colors.panels.popover.border.asBg};
  ${theme.typo.content.resetLineHeight};
  ${theme.box.item};
  ${theme.radius.button};
  width: 100%;
  color: #fff;
  outline: none;
`;

const UIEmojiList = styled.div`
  margin-top: 10px;
`;

const UIHeader = styled.div`
  height: ${EMOJI_SIZE}px;
  display: flex;
  align-items: center;
  ${theme.typo.item.title};
`;

const UIEmojiRow = styled.div`
  height: ${EMOJI_SIZE}px;
  display: flex;
`;

const UIEmojiButton = styled.button`
  height: ${EMOJI_SIZE}px;
  width: ${EMOJI_SIZE}px;
  ${theme.colors.panels.popover.interactive};
  font-size: ${EMOJI_SIZE * 0.6}px;
  ${theme.radius.button};
  ${theme.transitions.hover()};
`;
