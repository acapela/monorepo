import React from "react";
import styled from "styled-components";
import { PreviewProvider } from "./PreviewProvider";

const getLoomIFrameUrl = (shareUrl: string) => {
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

export const LoomPreviewProvider: PreviewProvider = {
  isUrlSupported: (url) => {
    if (url.includes("loom")) {
      return true;
    }

    return false;
  },
  PreviewComponent: ({ url }) => {
    const iFrameUrl = getLoomIFrameUrl(url);

    if (!iFrameUrl) {
      return null;
    }

    return <UIPreview src={iFrameUrl} allow="fullscreen" />;
  },
};

const UIPreview = styled.iframe`
  width: 640px;
  height: 392px;
`;
