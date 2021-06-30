export const getNotionPreviewText = (url: string) => {
  const [pageNameWithId] = url.split("/").reverse();

  const previewText = pageNameWithId.split("-").slice(0, -1).join(" ");

  return previewText;
};
