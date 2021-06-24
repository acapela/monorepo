import styled from "styled-components";
import { MessageDetailedInfoFragment } from "~gql";
import { MessageAttachment } from "~frontend/ui/message/attachment/MessageAttachment";
import { ATTACHMENT_PREVIEW_HEIGHT_PX } from "~frontend/ui/message/attachment/MessageAttachmentDisplayer";
import { removeMessageAttachment } from "~frontend/gql/attachments";

interface Props {
  message: MessageDetailedInfoFragment;
}

export function MessageMedia({ message }: Props) {
  const attachments = message.message_attachments ?? [];

  if (attachments.length < 1) {
    return null;
  }

  return (
    <UIHolder>
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
    </UIHolder>
  );
}

const UIHolder = styled.div``;

const UIAttachments = styled.div`
  display: flex;
  height: ${ATTACHMENT_PREVIEW_HEIGHT_PX}px;
`;
