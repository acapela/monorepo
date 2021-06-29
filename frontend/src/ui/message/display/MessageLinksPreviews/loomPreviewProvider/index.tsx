import React from "react";
import { MessageEmbedPreviewConfig } from "../MessageEmbedPreviewConfig";
import { MessageLinkPreviewIFrame } from "../MessageLinkPreviewIFrame";
import { getLoomEmbedUrl } from "./getLoomEmbedUrl";

const PREVIEW_RATIO = 640 / 392;

export const loomPreviewProvider: MessageEmbedPreviewConfig = {
  isUrlSupported: (url) => url.includes("loom.com/share"),
  PreviewComponent: ({ url }) => {
    const embedUrl = getLoomEmbedUrl(url);

    if (!embedUrl) {
      return null;
    }

    return <MessageLinkPreviewIFrame ratio={PREVIEW_RATIO} url={embedUrl} />;
  },
};
