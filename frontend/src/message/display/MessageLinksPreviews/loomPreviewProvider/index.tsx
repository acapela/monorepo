import React from "react";

import { MessageEmbedPreviewConfig } from "@aca/frontend/message/display/MessageLinksPreviews/MessageEmbedPreviewConfig";
import { MessageLinkPreviewIFrame } from "@aca/frontend/message/display/MessageLinksPreviews/MessageLinkPreviewIFrame";

import { getLoomEmbedUrl } from "./getLoomEmbedUrl";

const PREVIEW_DIMENTIONS_RATIO = 640 / 392;

export const loomPreviewProvider: MessageEmbedPreviewConfig = {
  isUrlSupported: (url) => url.includes("loom.com/share"),
  PreviewComponent: ({ url }) => {
    const embedUrl = getLoomEmbedUrl(url);

    if (!embedUrl) {
      return null;
    }

    return <MessageLinkPreviewIFrame ratio={PREVIEW_DIMENTIONS_RATIO} url={embedUrl} />;
  },
};
