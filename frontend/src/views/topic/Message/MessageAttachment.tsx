import React from "react";
import { AttachmentDetailedInfoFragment } from "~frontend/gql";
import styled from "styled-components";
import { useGetAttachmentQuery, useGetDownloadUrlQuery } from "~frontend/gql/topics";
import { MessageAttachmentDisplayer } from "./MessageAttachmentDisplayer";
import { BodyPortal } from "~ui/BodyPortal";
import { zIndex } from "~ui/zIndex";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { AnimateSharedLayout } from "framer-motion";

interface AttachmentProps {
  attachment: AttachmentDetailedInfoFragment;
  className?: string;
}

const PureMessageAttachment = ({ attachment, className }: AttachmentProps) => {
  const { data: downloadUrlData } = useGetDownloadUrlQuery({ id: attachment.id });
  const url = downloadUrlData?.get_download_url?.downloadUrl;
  const { data: attachmentData } = useGetAttachmentQuery({ id: attachment.id });
  const [isFullscreenOpened, { toggle: toggleIsFullscreenOpened }] = useBoolean(false);

  if (!url) {
    return <div className={className}>Fetching</div>;
  }

  if (!attachmentData?.attachment) return null;

  const renderAttachment = (isPlaceholder = false) => {
    return (
      <MessageAttachmentDisplayer
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attachment={attachmentData.attachment!}
        attachmentUrl={url}
        onClick={toggleIsFullscreenOpened}
        layoutId={isPlaceholder ? null : `attachment-${attachment.id}`}
      />
    );
  };

  return (
    <AnimateSharedLayout>
      <UIInlineAttachmentHolder>
        {!isFullscreenOpened && renderAttachment()}
        {isFullscreenOpened && <UIAttachmentPlaceholder>{renderAttachment(true)}</UIAttachmentPlaceholder>}
      </UIInlineAttachmentHolder>
      <BodyPortal>
        {isFullscreenOpened && (
          <UIFullscreenHolder onClick={toggleIsFullscreenOpened}>{renderAttachment()}</UIFullscreenHolder>
        )}
      </BodyPortal>
    </AnimateSharedLayout>
  );
};

const UIFullscreenHolder = styled.div`
  position: fixed;
  z-index: ${zIndex.FullScreenPreview};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0004;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UIAttachmentPlaceholder = styled.div`
  visibility: hidden;
  opacity: 0;
`;

const UIInlineAttachmentHolder = styled.div`
  max-width: 200px;
`;

export const MessageAttachment = styled(PureMessageAttachment)``;
