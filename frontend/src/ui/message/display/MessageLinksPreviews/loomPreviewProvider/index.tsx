import React from "react";
import { MessageEmbedPreviewConfig } from "~frontend/ui/message/display/MessageLinksPreviews/MessageEmbedPreviewConfig";
import { MessageLinkPreviewIFrame } from "~frontend/ui/message/display/MessageLinksPreviews/MessageLinkPreviewIFrame";
import { getLoomEmbedUrl } from "./getLoomEmbedUrl";

export const loomPreviewProvider: MessageEmbedPreviewConfig = {
  isUrlSupported: (url) => url.includes("loom.com/share"),
  PreviewComponent: ({ url }) => {
    const embedUrl = getLoomEmbedUrl(url);

    if (!embedUrl) {
      return null;
    }

    return <MessageLinkPreviewIFrame ratio={"640 / 392"} url={embedUrl} />;
  },
};
