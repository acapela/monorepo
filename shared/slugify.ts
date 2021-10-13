import _slugify from "@sindresorhus/slugify";
import emojis from "emoji.json";

const customReplacements = emojis.map(({ char, name }) => [char, name] as [string, string]);

export function slugify(text: string) {
  return _slugify(text, { customReplacements });
}
