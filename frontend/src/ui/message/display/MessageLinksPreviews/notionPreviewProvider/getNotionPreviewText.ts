export const getNotionPreviewText = (url: string) => {
  try {
    const [pageNameWithId] = url.split("/").reverse();

    const previewText = pageNameWithId.split("-").slice(0, -1).join(" ");

    return previewText;
  } catch (err) {
    console.error(`Failed to parse Notion URL: ${url}`);
    return null;
  }
};
