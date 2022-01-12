import { Index } from "flexsearch";
import { memoize } from "lodash";

import { typedKeys } from "@aca/shared/object";

import emojiByCategory from "./categories.json";
import emojiSearchTags from "./search.json";
import emojiSlugByNative from "./slugs.json";

export const emojiByCategories = emojiByCategory;

export function getEmojiSlug(native: string): string | null {
  return emojiSlugByNative[native as keyof typeof emojiSlugByNative] ?? null;
}

export function getAllEmojiList() {
  const emojiList: string[] = [];

  for (const categoryName of typedKeys(emojiByCategory)) {
    const categoryEmojiList = emojiByCategory[categoryName];

    emojiList.push(...categoryEmojiList);
  }

  return emojiList;
}

export function getEmojiSearchData(emoji: string): string {
  const tags = emojiSearchTags[emoji as keyof typeof emojiSearchTags];

  if (!tags) return "emoji";

  return tags.join(" ");
}

export const getEmojiSearchIndex = memoize(() => {
  const allEmoji = getAllEmojiList();

  const index = new Index({
    preset: "match",
    // Will find "hello", when looking for "he"
    tokenize: "full",
    // Will normalize custom characters.
    charset: "lating:advanced",
    language: "en",
  });

  allEmoji.forEach((emoji) => {
    index.add(emoji, getEmojiSearchData(emoji));
  });

  function search(input: string) {
    return index.search(input) as string[];
  }

  return search;
});
