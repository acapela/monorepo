import React from "react";
import styled from "styled-components";
import { MessageEmbedPreviewConfig } from "../MessageEmbedPreviewConfig";
import { getLoomEmbedUrl } from "./getLoomEmbedUrl";

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
