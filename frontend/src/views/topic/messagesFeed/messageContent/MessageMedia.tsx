import styled from "styled-components";
import { AttachmentDetailedInfoFragment, TopicMessageDetailedInfoFragment } from "~frontend/../../gql";
import { MessageAttachment } from "./attachment/MessageAttachment";
import { ATTACHMENT_PREVIEW_HEIGHT_PX } from "./attachment/MessageAttachmentDisplayer";
import { AttachmentWithTranscription } from "./AttachmentWithTranscription";

interface Props {
  message: TopicMessageDetailedInfoFragment;
}

export function MessageMedia({ message }: Props) {
  const attachments = message.message_attachments ?? [];

  function renderMedia() {
    if (message.transcription) {
      // TODO: Status pending
      return (
        <AttachmentWithTranscription
          attachment={attachments[0].attachment}
          transcript={message.transcription.transcript}
        />
      );
    }

    return (
      <>
        {attachments.length > 0 && (
          <UIAttachments>
            {attachments.map(({ attachment }) => (
              <MessageAttachment key={attachment.id} attachment={attachment} />
            ))}
          </UIAttachments>
        )}
      </>
    );
  }

  return <UIHolder>{renderMedia()}</UIHolder>;
}

const UIHolder = styled.div``;

const UIAttachments = styled.div`
  margin-top: 1rem;
  display: flex;
  height: ${ATTACHMENT_PREVIEW_HEIGHT_PX}px;
`;
