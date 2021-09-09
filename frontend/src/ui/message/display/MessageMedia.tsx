import { gql } from "@apollo/client";
import { observer } from "mobx-react";
import styled, { css } from "styled-components";

import { MessageEntity } from "~frontend/clientdb/message";
import { removeAttachment } from "~frontend/gql/attachments";
import { withFragments } from "~frontend/gql/utils";
import { MessageAttachment } from "~frontend/ui/message/attachment/MessageAttachment";
import { MessageMedia_MessageFragment } from "~gql";

interface Props {
  message: MessageEntity;
  nonInteractive?: boolean;
}

export const MessageMedia = observer(({ message, nonInteractive }: Props) =>
  message.attachments.all.length == 0 ? null : (
    <UIAttachments nonInteractive={Boolean(nonInteractive)}>
      {message.attachments.all.map((attachment) => (
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
  )
);

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
