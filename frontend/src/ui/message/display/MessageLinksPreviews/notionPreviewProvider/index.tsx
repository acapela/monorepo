import React from "react";
import styled from "styled-components";

import { MessageEmbedPreviewConfig } from "~frontend/ui/message/display/MessageLinksPreviews/MessageEmbedPreviewConfig";
import { IconNotionLogo } from "~ui/icons";
import { theme } from "~ui/theme";
import { TextBody } from "~ui/typo";

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

    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <UICard>
          <IconNotionLogo />
          <TextBody semibold>{previewText}</TextBody>
        </UICard>
      </a>
    );
  },
};

const UICard = styled.div<{}>`
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    font-size: 2em;
  }

  ${theme.transitions.hover()};
  ${theme.borderRadius.card};
  ${theme.colors.actions.tertiary.all()}
`;
