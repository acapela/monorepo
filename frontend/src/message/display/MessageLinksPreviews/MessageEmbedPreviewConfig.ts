import React from "react";

interface EmbedPreviewComponentProps {
  url: string;
}

export interface MessageEmbedPreviewConfig {
  isUrlSupported: (url: string) => boolean;
  PreviewComponent: React.VFC<EmbedPreviewComponentProps>;
}
