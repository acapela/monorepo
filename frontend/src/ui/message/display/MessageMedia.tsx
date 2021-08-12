import { gql } from "@apollo/client";
import styled, { css } from "styled-components";

import { removeAttachment } from "~frontend/gql/attachments";
import { withFragments } from "~frontend/gql/utils";
import { MessageAttachment } from "~frontend/ui/message/attachment/MessageAttachment";
import { MessageMedia_MessageFragment } from "~gql";

const fragments = {
  message: gql`
    ${MessageAttachment.fragments.attachment}
    ${MessageAttachment.fragments.message}

    fragment MessageMedia_message on message {
      id
      ...MessageAttachment_message
      message_attachments {
        ...MessageAttachment_attachment
      }
    }
  `,
};

interface Props {
  message: MessageMedia_MessageFragment;
  nonInteractive?: boolean;
}

export const MessageMedia = withFragments(fragments, ({ message, nonInteractive }: Props) =>
  message.message_attachments.length == 0 ? null : (
    <UIAttachments nonInteractive={Boolean(nonInteractive)}>
      {message.message_attachments.map((attachment) => (
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

  ${(props) =>
    props.nonInteractive &&
    css`
      pointer-events: none;
      height: 60px;
    `}
`;
