import React from "react";

import { MessageEmbedPreviewConfig } from "~frontend/ui/message/display/MessageLinksPreviews/MessageEmbedPreviewConfig";
import { MessageLinkPreviewIFrame } from "~frontend/ui/message/display/MessageLinksPreviews/MessageLinkPreviewIFrame";

import { getFigmaEmbedUrl } from "./getFigmaEmbedUrl";

const PREVIEW_DIMENTIONS_RATIO = 800 / 450;

export const figmaPreviewProvider: MessageEmbedPreviewConfig = {
  isUrlSupported: (url) => url.includes("figma.com/file"),
  PreviewComponent: ({ url }) => (
    <MessageLinkPreviewIFrame ratio={PREVIEW_DIMENTIONS_RATIO} url={getFigmaEmbedUrl(url)} />
  ),
};
