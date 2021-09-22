export const getFigmaPreviewText = (url: string) => {
  const [fileNameWithNode] = url.split("/").reverse();

  const [fileName] = fileNameWithNode.split("?");

  const previewText = fileName.split("-").join(" ");

  return previewText;
};
