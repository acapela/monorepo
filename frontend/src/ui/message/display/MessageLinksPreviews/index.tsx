import styled from "styled-components";
import { MessageBasicInfoFragment } from "~gql";
import { loomPreviewProvider } from "./loomPreviewProvider";
import { figmaPreviewProvider } from "./figmaPreviewProvider";
import { notionPreviewProvider } from "./notionPreviewProvider";
import { extractLinksFromRichContent } from "~richEditor/links/extract";

const supportedPreviewProviders = [loomPreviewProvider, figmaPreviewProvider, notionPreviewProvider];

interface Props {
  message: MessageBasicInfoFragment;
}

export const MessageLinksPreviews = ({ message }: Props) => {
  const links = extractLinksFromRichContent(message.content);

  return (
    <UIHolder>
      {links.map((linkUrl) => {
        const previewProvider = supportedPreviewProviders.find(({ isUrlSupported }) => isUrlSupported(linkUrl));

        if (!previewProvider) return null;

        const { PreviewComponent } = previewProvider;

        return <PreviewComponent key={linkUrl} url={linkUrl} />;
      })}
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 600px;

  @media (max-width: 1280px) {
    width: 400px;
  }

  @media (max-width: 800px) {
    width: 300px;
  }
`;
