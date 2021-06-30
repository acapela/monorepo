import React from "react";
import { MessageEmbedPreviewConfig } from "~frontend/ui/message/display/MessageLinksPreviews/MessageEmbedPreviewConfig";
import { MessageLinkPreviewIFrame } from "~frontend/ui/message/display/MessageLinksPreviews/MessageLinkPreviewIFrame";
import { getFigmaEmbedUrl } from "./getFigmaEmbedUrl";

export const figmaPreviewProvider: MessageEmbedPreviewConfig = {
  isUrlSupported: (url) => url.includes("figma.com/file"),
  PreviewComponent: ({ url }) => <MessageLinkPreviewIFrame ratio={"800 / 450"} url={getFigmaEmbedUrl(url)} />,
};
