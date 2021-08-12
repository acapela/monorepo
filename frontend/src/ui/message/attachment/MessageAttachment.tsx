import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { AttachmentDetailedInfoFragment } from "~gql";
import { theme } from "~ui/theme";
import { MessageAttachmentActions } from "./MessageAttachmentActions";
import { MessageAttachmentDisplayer } from "./MessageAttachmentDisplayer";

interface AttachmentProps {
  attachment: AttachmentDetailedInfoFragment;
  onAttachmentRemoveRequest?: (attachment: AttachmentDetailedInfoFragment) => void;
  className?: string;
}

export const MessageAttachment = styled<AttachmentProps>(({ attachment, className, onAttachmentRemoveRequest }) => {
  const user = useAssertCurrentUser();

  function getCanEditAttachments() {
    const message = attachment.message;

    if (!message) return false;

    if (message.user_id !== user.id) return false;

    // For messages of non-text type, attachment is essential part of it, so entire message should be removed instead.
    if (message.type !== "TEXT") return false;

    return true;
  }

  const canEditAttachments = getCanEditAttachments();

  if (!attachment) return null;

  return (
    <AnimateSharedLayout>
      <UIInlineAttachmentHolder className={className}>
        <MessageAttachmentDisplayer attachment={attachment} attachmentUrl={`/attachments/${attachment.id}`} />
        <AnimatePresence>
          {canEditAttachments && (
            <MessageAttachmentActions onRemoveRequest={() => onAttachmentRemoveRequest?.(attachment)} />
          )}
        </AnimatePresence>
      </UIInlineAttachmentHolder>
    </AnimateSharedLayout>
  );
})``;

const UIInlineAttachmentHolder = styled.div<{}>`
  display: flex;
  position: relative;
  ${theme.borderRadius.item}
  overflow: hidden;
`;
