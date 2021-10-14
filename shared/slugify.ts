import _slugify from "@sindresorhus/slugify";

async function slugifyWithEmojis(text: string): Promise<string> {
  const emojis = await import("emoji.json");
  const customReplacements = emojis.default.map(({ char, name }) => [char, name] as [string, string]);
  return _slugify(text, { customReplacements });
}

export async function slugify(text: string): Promise<string> {
  const slug = _slugify(text);
  if (slug.length != 0) return slug;
  return slugifyWithEmojis(text);
}
