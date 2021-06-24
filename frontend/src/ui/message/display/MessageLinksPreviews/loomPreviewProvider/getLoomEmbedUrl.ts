export const getLoomEmbedUrl = (shareUrl: string) => {
  try {
    const { pathname } = new URL(shareUrl);

    const parts = pathname.split("/");
    const sharePartIndex = parts.indexOf("share");
    if (sharePartIndex < 0) {
      return null;
    }

    const videoId = parts[sharePartIndex + 1];

    return `https://www.loom.com/embed/${videoId}`;
  } catch (err) {
    console.error(`Failed to parse Loom URL: ${shareUrl}`);
    return null;
  }
};
