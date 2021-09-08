import { gql } from "@apollo/client";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { MessageLinksPreviews_MessageFragment } from "~gql";
import { extractLinksFromRichContent } from "~richEditor/links/extract";

import { figmaPreviewProvider } from "./figmaPreviewProvider";
import { loomPreviewProvider } from "./loomPreviewProvider";
import { notionPreviewProvider } from "./notionPreviewProvider";

const supportedPreviewProviders = [loomPreviewProvider, figmaPreviewProvider, notionPreviewProvider];

const fragments = {
  message: gql`
    fragment MessageLinksPreviews_message on message {
      content
    }
  `,
};

interface Props {
  message: MessageLinksPreviews_MessageFragment;
}

export const MessageLinksPreviews = withFragments(fragments, ({ message }: Props) => {
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
