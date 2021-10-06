import { observer } from "mobx-react";
import styled, { css } from "styled-components";

import { MessageEntity } from "~frontend/clientdb/message";
import { removeAttachment } from "~frontend/gql/attachments";
import { MessageAttachment } from "~frontend/ui/message/attachment/MessageAttachment";

interface Props {
  message: MessageEntity;
  nonInteractive?: boolean;
}

export const MessageMedia = observer(({ message, nonInteractive }: Props) => {
  const attachments = message.attachments.all;
  return attachments.length == 0 ? null : (
    <UIAttachments nonInteractive={Boolean(nonInteractive)}>
      {attachments.map((attachment) => (
        <MessageAttachment
          key={attachment.id}
          message={message}
          attachment={attachment}
          onAttachmentRemoveRequest={() => {
            removeAttachment({ id: attachment.id });
          }}
        />
      ))}
    </UIAttachments>
  );
});

const UIAttachments = styled.div<{ nonInteractive: boolean }>`
  display: flex;
  gap: 8px;
  max-height: 200px;

  ${(props) =>
    props.nonInteractive &&
    css`
      pointer-events: none;
      height: 60px;
    `}
`;
