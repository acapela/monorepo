import type { BaseEmoji } from "emoji-mart";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Channel } from "~shared/channel";
import { SelectionPopover } from "~ui/popovers/SelectionPopover";
import { SelectList } from "~ui/SelectList";

interface Props {
  keywordChannel: Channel<string | null>;
  onEmojiSelected: (emoji: string) => void;
}

async function findEmoji(keyword: string, limit = 5) {
  const { emojiIndex } = await import("emoji-mart");

  const foundEmoji = emojiIndex.search(keyword);

  return (foundEmoji?.slice(0, limit) ?? []) as BaseEmoji[];
}

/**
 * Select box component that will show up when user writes `:emoji-search-keyword` in the rich editor.
 */
export function EmojiSearchModal({ keywordChannel, onEmojiSelected }: Props) {
  const searchKeyword = keywordChannel.useLastValue();
  const [foundEmoji, setFoundEmoji] = useState<BaseEmoji[]>([]);

  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchKeyword) {
      setFoundEmoji([]);
      return;
    }

    let isEffectRunning = true;

    const update = async () => {
      const foundEmoji = await findEmoji(searchKeyword);

      if (!isEffectRunning) return;
      setFoundEmoji(foundEmoji);
    };

    update();

    return () => {
      isEffectRunning = false;
    };
  }, [searchKeyword]);

  if (!searchKeyword) return null;

  return (
    <UIHolder ref={holderRef}>
      <SelectionPopover placement="top" ignoreMouseSelectionChange>
        <SelectList<BaseEmoji>
          items={foundEmoji}
          keyGetter={(emoji) => emoji.id}
          renderItem={(emoji) => (
            <>
              <UIEmoji>{emoji.native}</UIEmoji> {emoji.colons}
            </>
          )}
          onItemSelected={(emoji) => {
            keywordChannel.publish(null);
            onEmojiSelected(emoji.native);
          }}
        />
      </SelectionPopover>
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const UIEmoji = styled.div<{}>`
  margin-right: 0.5rem;
`;
