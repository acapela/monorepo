import React from "react";
import { PreviewProvider } from "./PreviewProvider";

export const LoomPreviewProvider: PreviewProvider = {
  isUrlSupported: (url) => {
    if (url.includes("loom")) {
      return true;
    }

    return false;
  },
  PreviewComponent: () => {
    return <p>LoomIntegration will be here</p>;
  },
};
