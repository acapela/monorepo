import { MessageBasicInfoFragment } from "~gql";
import { extractLinksFromMessageContent } from "./extractLinksFromMessageContent";
import { getPreviewProviders } from "./PreviewProviders";
import { LoomPreviewProvider } from "./LoomPreviewProvider";
import { PreviewProvider } from "./PreviewProvider";

const supportedPreviewProviders = [LoomPreviewProvider];

interface Props {
  message: MessageBasicInfoFragment;
}

export const MessagePreviews = ({ message }: Props) => {
  const links = extractLinksFromMessageContent(message.content);
  const previewProviders = getPreviewProviders(links);

  return (
    <>
      {links.reduce((acc: PreviewProvider[], url) => {
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
