import { MessageBasicInfoFragment } from "~gql";
import { extractLinksFromMessageContent } from "./extractLinksFromMessageContent";
import { loomPreviewProvider } from "./loomPreviewProvider";
import { ReactElement } from "react";

const supportedPreviewProviders = [loomPreviewProvider];

interface Props {
  message: MessageBasicInfoFragment;
}

export const MessageLinksPreviews = ({ message }: Props) => {
  const links = extractLinksFromMessageContent(message.content);

  return (
    <>
      {links.reduce((acc: ReactElement[], url) => {
        const previewProvider = supportedPreviewProviders.find(({ isUrlSupported }) => isUrlSupported(url));

        if (previewProvider) {
          const { PreviewComponent } = previewProvider;
          acc.push(<PreviewComponent url={url} />);
        }

        return acc;
      }, [])}
    </>
  );
};
