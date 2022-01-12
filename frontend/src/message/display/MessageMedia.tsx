import { action } from "mobx";
import { observer } from "mobx-react";
import styled, { css } from "styled-components";

import { MessageEntity } from "@aca/frontend/clientdb/message";
import { MessageAttachment } from "@aca/frontend/message/attachment/MessageAttachment";

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
          onAttachmentRemoveRequest={action(() => {
            attachment.remove();
          })}
        />
      ))}
    </UIAttachments>
  );
});

const UIAttachments = styled.div<{ nonInteractive: boolean }>`
  display: flex;
  gap: 8px;

  ${(props) =>
    props.nonInteractive &&
    css`
      pointer-events: none;
      height: 60px;
    `}
`;
