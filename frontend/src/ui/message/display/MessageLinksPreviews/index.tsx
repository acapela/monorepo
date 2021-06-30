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
    <>
      {links.map((linkUrl) => {
        const previewProvider = supportedPreviewProviders.find(({ isUrlSupported }) => isUrlSupported(linkUrl));

        if (!previewProvider) return null;

        const { PreviewComponent } = previewProvider;

        return <PreviewComponent key={linkUrl} url={linkUrl} />;
      })}
    </>
  );
};
