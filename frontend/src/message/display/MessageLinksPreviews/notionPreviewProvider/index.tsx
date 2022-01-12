import React from "react";

import { MessageEmbedPreviewConfig } from "@aca/frontend/message/display/MessageLinksPreviews/MessageEmbedPreviewConfig";
import { MessageLinkCard } from "@aca/frontend/message/display/MessageLinksPreviews/MessageLinkCard";
import { IconNotionLogo } from "@aca/ui/icons";

import { getNotionPreviewText } from "./getNotionPreviewText";

export const notionPreviewProvider: MessageEmbedPreviewConfig = {
  isUrlSupported: (url) => {
    const domainName = "notion.so";

    if (!url.includes(domainName)) {
      return false;
    }

    const [partOfUrlAfterDomainName] = url.split(domainName).reverse();

    return partOfUrlAfterDomainName.length > 1;
  },
  PreviewComponent: ({ url }) => {
    const previewText = getNotionPreviewText(url);

    if (!previewText) {
      return null;
    }

    return <MessageLinkCard href={url} text={previewText} icon={<IconNotionLogo />} />;
  },
};
