export const getFigmaEmbedUrl = (figmaFileUrl: string) =>
  `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaFileUrl)}`;
