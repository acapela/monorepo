export const getFigmaPreviewText = (url: string) => {
  const { pathname } = new URL(url);

  return pathname.split("/").pop()?.split("-").join(" ");
};
