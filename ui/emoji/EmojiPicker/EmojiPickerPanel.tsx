import { chunk } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "react-use";
import { List } from "react-virtualized";
import styled, { css } from "styled-components";

import { emojiByCategories, getEmojiSearchIndex, getEmojiSlug } from "@aca/shared/emoji/list";
import { typedKeys } from "@aca/shared/object";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";
import { theme } from "@aca/ui/theme";

import { useFrequentlyUsedEmoji } from "./frequentlyUsed";

const EMOJI_SIZE = 30;
const EMOJI_IN_ROW_COUNT = 10;

const PICKER_WIDTH = EMOJI_SIZE * EMOJI_IN_ROW_COUNT;
const PICKER_HEIGHT = EMOJI_SIZE * 7;

/**
 * We use virtualized list which is a bit limiting in ways how we can render content.
 *
 * Each row has the same height, and we have 2 kinds of rows. Emoji row and header row (eg for category name)
 */
type HeaderRow = {
  type: "header";
  label: string;
};

type EmojiRow = {
  type: "emoji-row";
  emojiInRow: string[];
};

type VirtualizedRow = HeaderRow | EmojiRow;

function convertEmojiListToVirtualizedRows(emojiList: string[]): VirtualizedRow[] {
  const rows: VirtualizedRow[] = [];
  const emojiRows = chunk(emojiList, EMOJI_IN_ROW_COUNT);

  for (const emojiRow of emojiRows) {
    rows.push({ type: "emoji-row", emojiInRow: emojiRow });
  }

  return rows;
}

// Create virtualized rows with category headers
function convertEmojiMapToVirtualizedRows(): VirtualizedRow[] {
  const rows: VirtualizedRow[] = [];

  for (const categoryName of typedKeys(emojiByCategories)) {
    const categoryEmojiList = emojiByCategories[categoryName];

    // For each category start with category header
    rows.push({ type: "header", label: categoryName });

    // Divide category emojis into rows
    const emojiRows = convertEmojiListToVirtualizedRows(categoryEmojiList);
    rows.push(...emojiRows);
  }

  return rows;
}

// It will never change so let's compute at module level
const emojiVirtualizedRows = convertEmojiMapToVirtualizedRows();

export interface EmojiPickerProps {
  onEmojiPicked?: (emoji: string) => void;
}

// Used for eg. navigating with keyboard. Position of currently selected emoji 'in grid'
// Note: 'grid' ignores header rows when computing emoji position (this allows eg. ignoring headers when moving with keyboard)

interface Point {
  x: number;
  y: number;
}

// Keyboard direction
type Direction = "up" | "down" | "left" | "right";

export function EmojiPickerWindowInner({ onEmojiPicked }: EmojiPickerProps) {
  const listRef = useRef<List>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<Point | null>(null);
  const { frequentlyUsedEmoji, markEmojiAsUsed } = useFrequentlyUsedEmoji();

  const resultsToShow = useMemo<VirtualizedRow[]>(() => {
    // If we're not searching - prepare regular list of all emoji
    if (!searchTerm.trim()) {
      return [
        // Add requently used rows
        { type: "header", label: "Frequently used" },
        ...convertEmojiListToVirtualizedRows(frequentlyUsedEmoji),
        ...emojiVirtualizedRows,
      ];
    }

    const search = getEmojiSearchIndex();

    const foundEmoji = search(searchTerm);

    return [{ type: "header", label: "Search results" }, ...convertEmojiListToVirtualizedRows(foundEmoji)];
  }, [searchTerm]);

  // To make navigation logic easier - create another list of virtualized rows, but ignoring headers.
  // This makes emoji x,y coordinates logic a lot simpler
  const emojiOnlyRows = useMemo(() => {
    const emojiRows = resultsToShow.filter((row) => row.type === "emoji-row") as EmojiRow[];

    return emojiRows;
  }, [resultsToShow]);

  // When typing in search - reset selected position
  useEffect(() => {
    setSelectedPosition(null);
  }, [searchTerm]);

  function getEmojiAtPosition(position: Point): string | null {
    const selectedEmoji = emojiOnlyRows[position.y]?.emojiInRow[position.x] ?? null;

    return selectedEmoji;
  }

  // Each time selected position changes - scroll to it to make it visible if needed
  useIsomorphicLayoutEffect(() => {
    if (!selectedPosition) return;

    const emojiRow = emojiOnlyRows[selectedPosition.y];

    if (!emojiRow) return;

    // To scroll accurately - we need now to take index of row including headers
    const realRow = resultsToShow.indexOf(emojiRow);

    if (realRow < 0) return;

    listRef.current?.scrollToRow(realRow);
  }, [selectedPosition, emojiOnlyRows]);

  // Will calculate new position of selection basing on current position and direction of movement
  function getNewKeyboardSelectionTarget(direction: Direction): Point {
    // If no position selected - put it on start no matter what
    if (!selectedPosition) {
      return { x: 0, y: 0 };
    }

    const { x, y } = selectedPosition;
    const maxRow = emojiOnlyRows.length - 1;
    const maxColumn = EMOJI_IN_ROW_COUNT - 1;

    if (direction === "up") {
      const targetNextY = y - 1;
      // If pressed up on first row - put selection to first column
      if (targetNextY < 0) {
        return { x: 0, y: 0 };
      }

      // Go one row up
      return { x, y: targetNextY };
    }

    if (direction === "down") {
      let targetNextY = y + 1;
      // If down on last row
      if (targetNextY > maxRow) {
        // Go to last column
        targetNextY = maxRow;
      }

      // Go to next row
      return { x, y: targetNextY };
    }

    if (direction === "left") {
      // Ignore if on start of the list
      if (x === 0 && y === 0) return selectedPosition;

      // Go to end of previous row
      if (x === 0) {
        return { y: y - 1, x: maxColumn };
      }

      // Go to previous column in same row
      return { x: x - 1, y };
    }

    if (direction === "right") {
      // If in the end - do nothing
      if (x === maxColumn && y === maxRow) return selectedPosition;

      // Go to start of next row
      if (x === maxColumn) {
        return { y: y + 1, x: 0 };
      }

      // Go to next column
      return { x: x + 1, y };
    }

    throw new Error("Incorrect direction");
  }

  function handleChangeSelectionByDirection(direction: Direction) {
    const newPosition = getNewKeyboardSelectionTarget(direction);

    // In case new position is not targeting any emoji - ignore it
    if (!getEmojiAtPosition(newPosition)) {
      return true;
    }

    setSelectedPosition(newPosition);

    return true;
  }

  useShortcut("ArrowDown", () => {
    return handleChangeSelectionByDirection("down");
  });

  useShortcut("ArrowUp", () => {
    return handleChangeSelectionByDirection("up");
  });

  useShortcut("ArrowLeft", () => {
    return handleChangeSelectionByDirection("left");
  });

  useShortcut("ArrowRight", () => {
    return handleChangeSelectionByDirection("right");
  });

  useShortcut("Enter", () => {
    if (!selectedPosition) return;
    const selectedEmoji = getEmojiAtPosition(selectedPosition);
    if (!selectedEmoji) return;
    onEmojiPicked?.(selectedEmoji);
  });

  function handleEmojiPicked(emoji: string) {
    // Increase emoji ranking in frequently used
    markEmojiAsUsed(emoji);
    onEmojiPicked?.(emoji);
  }

  return (
    <UIHolder>
      <UISearch>
        <UISearchInput
          placeholder="Find emoji..."
          autoFocus
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
      </UISearch>
      <UIEmojiList>
        <List
          ref={listRef}
          rowCount={resultsToShow.length}
          rowHeight={EMOJI_SIZE}
          height={PICKER_HEIGHT}
          width={PICKER_WIDTH}
          rowRenderer={(row) => {
            const { index, style, key } = row;

            // Get row this emoji is part of (including headers rows)
            const rowData = resultsToShow[index];

            if (rowData.type === "header") {
              return <UIHeader style={style}>{rowData.label}</UIHeader>;
            }

            // Get which emoji-only row is it in (excluding headers)
            const emojiRowIndex = emojiOnlyRows.indexOf(rowData);

            return (
              <UIEmojiRow style={style} key={key}>
                {rowData.emojiInRow.map((emoji, columnIndex) => {
                  /**
                   * Note - we decide if emoji is selected by x,y cords, not by emoji itself. It is because it is possible
                   * that same emoji appears twice (eg as frequently used and on the list)
                   */
                  const isSelected =
                    !!selectedPosition && selectedPosition.x === columnIndex && selectedPosition.y === emojiRowIndex;

                  return (
                    <UIEmojiButton
                      tabIndex={0}
                      onMouseEnter={() => {
                        setSelectedPosition({ x: columnIndex, y: emojiRowIndex });
                      }}
                      title={getEmojiSlug(emoji) ?? undefined}
                      key={emoji}
                      isSelected={isSelected}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleEmojiPicked(emoji);
                      }}
                    >
                      {emoji}
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
  ${theme.typo.body.resetLineHeight};
  ${theme.box.control.regular.padding.size.radius};
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
  ${theme.typo.bodyTitle};
`;

const UIEmojiRow = styled.div`
  height: ${EMOJI_SIZE}px;
  display: flex;
`;

const UIEmojiButton = styled.button<{ isSelected: boolean }>`
  height: ${EMOJI_SIZE}px;
  width: ${EMOJI_SIZE}px;
  ${theme.colors.panels.popover.asBgWithReadableText};
  font-size: ${EMOJI_SIZE * 0.6}px;
  ${theme.radius.button};
  ${theme.transitions.hover()};
  font-family: initial !important;
  ${(props) =>
    props.isSelected &&
    css`
      ${theme.colors.panels.popover.active.asBg};
      transition: 0.05s all;
    `};
`;
