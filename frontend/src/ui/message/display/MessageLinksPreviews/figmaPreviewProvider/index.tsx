import React from "react";
import { MessageEmbedPreviewConfig } from "../MessageEmbedPreviewConfig";
import { MessageLinkPreviewIFrame } from "../MessageLinkPreviewIFrame";
import { getFigmaEmbedUrl } from "./getFigmaEmbedUrl";

const PREVIEW_RATIO = 800 / 450;

export const figmaPreviewProvider: MessageEmbedPreviewConfig = {
  isUrlSupported: (url) => url.includes("figma.com/file"),
  PreviewComponent: ({ url }) => <MessageLinkPreviewIFrame ratio={PREVIEW_RATIO} url={getFigmaEmbedUrl(url)} />,
};
