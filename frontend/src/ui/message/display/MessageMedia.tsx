import styled from "styled-components";
import { MessageDetailedInfoFragment } from "~gql";
import { MessageAttachment } from "~frontend/ui/message/attachment/MessageAttachment";
import { ATTACHMENT_PREVIEW_HEIGHT_PX } from "~frontend/ui/message/attachment/MessageAttachmentDisplayer";
import { removeMessageAttachment } from "~frontend/gql/attachments";
// import { AttachmentWithTranscription } from "./AttachmentWithTranscription";

interface Props {
  message: MessageDetailedInfoFragment;
}

export function MessageMedia({ message }: Props) {
  const attachments = message.message_attachments ?? [];

  function renderMedia() {
    if (message.transcription) {
      // TODO: Status pending
      return <div>todo AttachmentWithTranscription</div>;
      // return (
      //   <AttachmentWithTranscription
      //     attachment={attachments[0].attachment}
      //     transcript={message.transcription.transcript}
      //   />
      // );
    }

    return (
      <>
        {attachments.length > 0 && (
          <UIAttachments>
            {attachments.map(({ attachment }) => (
              <MessageAttachment
                key={attachment.id}
                attachment={attachment}
                onAttachmentRemoveRequest={() => {
                  removeMessageAttachment({ attachmentId: attachment.id, messageId: message.id });
                }}
              />
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
