import styled, { css } from "styled-components";

import { removeAttachment } from "~frontend/gql/attachments";
import { MessageAttachment } from "~frontend/ui/message/attachment/MessageAttachment";
import { MessageDetailedInfoFragment } from "~gql";

interface Props {
  message: MessageDetailedInfoFragment;
  nonInteractive?: boolean;
}

export function MessageMedia({ message, nonInteractive }: Props) {
  const attachments = message.message_attachments ?? [];

  if (attachments.length < 1) {
    return null;
  }

  return (
    <UIAttachments nonInteractive={Boolean(nonInteractive)}>
      {attachments.map((attachment) => (
        <MessageAttachment
          key={attachment.id}
          attachment={attachment}
          onAttachmentRemoveRequest={() => {
            removeAttachment({ id: attachment.id });
          }}
        />
      ))}
    </UIAttachments>
  );
}

const UIAttachments = styled.div<{ nonInteractive: boolean }>`
  display: flex;
  gap: 8px;
  height: 400px;

  ${(props) =>
    props.nonInteractive &&
    css`
      pointer-events: none;
      height: 60px;
    `}
`;
