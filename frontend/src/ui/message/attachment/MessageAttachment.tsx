import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDownloadUrlQuery } from "~frontend/gql/attachments";
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
  const user = useCurrentUser();
  const [attachmentInfo] = useDownloadUrlQuery({ id: attachment.id });
  const canEditAttachments = attachment.message?.user_id === user?.id;

  if (!attachmentInfo) {
    return <UILoadingPlaceholder className={className}></UILoadingPlaceholder>;
  }

  if (!attachment) return null;

  return (
    <AnimateSharedLayout>
      <UIInlineAttachmentHolder>
        <MessageAttachmentDisplayer attachment={attachment} attachmentUrl={attachmentInfo.downloadUrl} />
        <AnimatePresence>
          {canEditAttachments && (
            <MessageAttachmentActions onRemoveRequest={() => onAttachmentRemoveRequest?.(attachment)} />
          )}
        </AnimatePresence>
      </UIInlineAttachmentHolder>
    </AnimateSharedLayout>
  );
})``;

const UILoadingPlaceholder = styled.div<{}>`
  height: 100%;
`;

const UIInlineAttachmentHolder = styled.div<{}>`
  display: flex;
  position: relative;
  ${theme.borderRadius.item}
  overflow: hidden;
`;
