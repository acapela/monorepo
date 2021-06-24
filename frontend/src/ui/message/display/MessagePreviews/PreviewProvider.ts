import React from "react";

interface PreviewComponentProps {
  url: string;
}

export interface PreviewProvider {
  isUrlSupported: (url: string) => boolean;
  PreviewComponent: React.FC<PreviewComponentProps>;
}
