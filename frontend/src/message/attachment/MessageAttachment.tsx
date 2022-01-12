import { AnimatePresence, LayoutGroup } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { AttachmentEntity } from "@aca/frontend/clientdb/attachment";
import { MessageEntity } from "@aca/frontend/clientdb/message";
import { styledObserver } from "@aca/shared/component";
import { theme } from "@aca/ui/theme";

import { MessageAttachmentActions } from "./MessageAttachmentActions";
import { MessageAttachmentDisplayer } from "./MessageAttachmentDisplayer";

interface Props {
  message: MessageEntity;
  attachment: AttachmentEntity;
  onAttachmentRemoveRequest?: (attachment: unknown) => void;
  className?: string;
}

export const MessageAttachment = styledObserver<Props>(
  ({ message, attachment, className, onAttachmentRemoveRequest }) => {
    function getCanEditAttachments() {
      if (!message.isOwn) return false;

      // For messages of non-text type, attachment is essential part of it, so entire message should be removed instead.
      return message.type === "TEXT";
    }

    const canEditAttachments = getCanEditAttachments();

    if (!attachment) return null;

    return (
      <LayoutGroup>
        <UIInlineAttachmentHolder className={className}>
          <MessageAttachmentDisplayer attachment={attachment} attachmentUrl={`/attachments/${attachment.id}`} />
          <AnimatePresence>
            {canEditAttachments && (
              <MessageAttachmentActions onRemoveRequest={() => onAttachmentRemoveRequest?.(attachment)} />
            )}
          </AnimatePresence>
        </UIInlineAttachmentHolder>
      </LayoutGroup>
    );
  }
)``;

const UIInlineAttachmentHolder = styled.div<{}>`
  height: 100%;
  display: flex;
  position: relative;
  ${theme.radius.secondaryItem}
  overflow: hidden;
`;
