import { observer } from "mobx-react";
import styled from "styled-components";

import { MessageEntity } from "@aca/frontend/clientdb/message";
import { extractLinksFromRichContent } from "@aca/richEditor/links/extract";

import { figmaPreviewProvider } from "./figmaPreviewProvider";
import { loomPreviewProvider } from "./loomPreviewProvider";
import { notionPreviewProvider } from "./notionPreviewProvider";

const supportedPreviewProviders = [loomPreviewProvider, figmaPreviewProvider, notionPreviewProvider];

export const MessageLinksPreviews = observer(({ message }: { message: MessageEntity }) => {
  const links = extractLinksFromRichContent(message.content);

  const linksPreviews = links
    .map((linkUrl) => {
      const previewProvider = supportedPreviewProviders.find(({ isUrlSupported }) => isUrlSupported(linkUrl));

      if (!previewProvider) return null;

      const { PreviewComponent } = previewProvider;

      return <PreviewComponent key={linkUrl} url={linkUrl} />;
    })
    .filter((linkPreview) => linkPreview !== null);

  if (linksPreviews.length < 1) return null;

  return <UIHolder>{linksPreviews}</UIHolder>;
});

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 16px;

  max-width: 600px;

  @media (max-width: 1280px) {
    max-width: 400px;
  }

  @media (max-width: 800px) {
    max-width: 300px;
  }
`;
