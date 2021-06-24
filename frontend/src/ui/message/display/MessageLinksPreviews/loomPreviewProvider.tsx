import React from "react";
import styled from "styled-components";
import { MessageEmbedPreviewConfig } from "./MessageEmbedPreviewConfig";

const getLoomEmbedUrl = (shareUrl: string) => {
  try {
    const { pathname } = new URL(shareUrl);

    const parts = pathname.split("/");
    const sharePartIndex = parts.indexOf("share");
    if (sharePartIndex < 0) {
      return null;
    }

    const videoId = parts[sharePartIndex + 1];

    return `https://www.loom.com/embed/${videoId}`;
  } catch (err) {
    return null;
  }
};

export const loomPreviewProvider: MessageEmbedPreviewConfig = {
  isUrlSupported: (url) => url.includes("loom.com/share"),
  PreviewComponent: ({ url }) => {
    const embedUrl = getLoomEmbedUrl(url);

    if (!embedUrl) {
      return null;
    }

    return <UIPreview src={embedUrl} allow="fullscreen" />;
  },
};

const UIPreview = styled.iframe`
  width: 640px;
  height: 392px;
`;
