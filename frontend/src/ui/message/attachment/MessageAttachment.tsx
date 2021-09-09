import { gql } from "@apollo/client";
import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { AttachmentEntity } from "~frontend/clientdb/attachment";
import { MessageEntity } from "~frontend/clientdb/message";
import { withFragments } from "~frontend/gql/utils";
import { MessageAttachment_AttachmentFragment, MessageAttachment_MessageFragment } from "~gql";
import { theme } from "~ui/theme";

import { MessageAttachmentActions } from "./MessageAttachmentActions";
import { MessageAttachmentDisplayer } from "./MessageAttachmentDisplayer";

interface Props {
  message: MessageEntity;
  attachment: AttachmentEntity;
  onAttachmentRemoveRequest?: (attachment: unknown) => void;
  className?: string;
}

const _MessageAttachment = styled<Props>(({ message, attachment, className, onAttachmentRemoveRequest }) => {
  const user = useAssertCurrentUser();

  function getCanEditAttachments() {
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

export const MessageAttachment = observer(_MessageAttachment);

const UIInlineAttachmentHolder = styled.div<{}>`
  height: 100%;
  display: flex;
  position: relative;
  ${theme.borderRadius.item}
  overflow: hidden;
`;
