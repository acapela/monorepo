import _slugify from "@sindresorhus/slugify";

async function slugifyWithEmojis(text: string): Promise<string> {
  const emojis = (await import("@aca/shared/emoji/slugs.json")).default;
  const customReplacements = Object.entries(emojis);
  const slug = _slugify(text, { customReplacements });
  if (slug.length != 0) return slug;
  return `U${text.charCodeAt(0)}`;
}

export async function slugify(text: string): Promise<string> {
  const slug = _slugify(text);
  if (slug.length != 0) return slug;
  return slugifyWithEmojis(text);
}

export function slugifySync(text: string, emptyResultBackup: string) {
  const slug = _slugify(text);

  if (!slug.length) {
    return emptyResultBackup;
  }

  return slug;
}
