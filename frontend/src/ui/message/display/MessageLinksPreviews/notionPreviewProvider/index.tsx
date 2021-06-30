import React from "react";
import { MessageEmbedPreviewConfig } from "~frontend/ui/message/display/MessageLinksPreviews/MessageEmbedPreviewConfig";
import { getNotionPreviewText } from "./getNotionPreviewText";

export const notionPreviewProvider: MessageEmbedPreviewConfig = {
  isUrlSupported: (url) => url.includes("notion.so"),
  PreviewComponent: ({ url }) => {
    const previewText = getNotionPreviewText(url);

    if (!previewText) {
      return null;
    }

    return <p>{previewText}</p>;
  },
};
