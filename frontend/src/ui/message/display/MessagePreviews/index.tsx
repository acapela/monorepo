import { MessageBasicInfoFragment } from "~gql";
import { extractLinksFromMessageContent } from "./extractLinksFromMessageContent";
import { LoomPreviewProvider } from "./LoomPreviewProvider";
import { ReactElement } from "react";

const supportedPreviewProviders = [LoomPreviewProvider];

interface Props {
  message: MessageBasicInfoFragment;
}

export const MessagePreviews = ({ message }: Props) => {
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
