import { MessageEmbedPreviewConfig } from "~frontend/ui/message/display/MessageLinksPreviews/MessageEmbedPreviewConfig";
import { MessageLinkCard } from "~frontend/ui/message/display/MessageLinksPreviews/MessageLinkCard";
import { IconFigmaLogo } from "~ui/icons";

import { getFigmaPreviewText } from "./getFigmaPreviewText";

export const figmaPreviewProvider: MessageEmbedPreviewConfig = {
  isUrlSupported: (url) => url.includes("figma.com/file"),
  PreviewComponent: ({ url }) => {
    const previewText = getFigmaPreviewText(url);

    if (!previewText) {
      return null;
    }

    return <MessageLinkCard href={url} text={previewText} icon={<IconFigmaLogo />} />;
  },
};
