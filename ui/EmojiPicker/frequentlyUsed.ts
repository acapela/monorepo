import { sortBy } from "lodash";

import { getLocalStorageValueManager } from "~shared/localStorage";

type EmojiUseageMap = Record<string, number>;

const initialFrequentlyUsed: EmojiUseageMap = {
  "👍": 1,
  "👌": 1,
  "🙏": 1,
  "❤️": 1,
  "👀": 1,
  "✅": 1,
  "🙂": 1,
};

const frequentlyUsedEmojiManager = getLocalStorageValueManager("frequently-used-emoji", initialFrequentlyUsed);

function getOrderedFrequentlyUsedEmoji(useageMap: EmojiUseageMap) {
  const entries = Object.entries(useageMap);

  return sortBy(entries, ([, useCount]) => -useCount)
    .map(([emoji]) => emoji)
    .slice(0, 10);
}

export function useFrequentlyUsedEmoji() {
  const useageMap = frequentlyUsedEmojiManager.useValue();

  const frequentlyUsedEmoji = getOrderedFrequentlyUsedEmoji(useageMap);

  function markEmojiAsUsed(emoji: string) {
    frequentlyUsedEmojiManager.update((currentMap) => {
      currentMap[emoji] = (currentMap[emoji] ?? 0) + 1;
    });
  }

  return {
    frequentlyUsedEmoji,
    markEmojiAsUsed,
  };
}
