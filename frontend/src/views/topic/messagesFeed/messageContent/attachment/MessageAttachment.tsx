import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { AttachmentDetailedInfoFragment } from "~gql";
import { useDownloadUrlQuery } from "~frontend/gql/topics";
import { useBoolean } from "~shared/hooks/useBoolean";
import { BodyPortal } from "~ui/BodyPortal";
import { zIndex } from "~ui/zIndex";
import { ATTACHMENT_PREVIEW_HEIGHT_PX, MessageAttachmentDisplayer } from "./MessageAttachmentDisplayer";

interface AttachmentProps {
  attachment: AttachmentDetailedInfoFragment;
  selectedMediaTime?: number | null;
  onMediaTimeUpdate?: (time: number) => void;
  className?: string;
}

const PureMessageAttachment = ({ attachment, selectedMediaTime, onMediaTimeUpdate, className }: AttachmentProps) => {
  const mediaRef = useRef<HTMLVideoElement>(null);
  const [url] = useDownloadUrlQuery({ id: attachment.id });
  const [isFullscreenOpened, { toggle: toggleIsFullscreenOpened }] = useBoolean(false);

  const onTimeUpdate = () => onMediaTimeUpdate?.(mediaRef.current?.currentTime ?? 0);

  useEffect(() => {
    if (typeof selectedMediaTime === "number" && mediaRef.current) {
      mediaRef.current.currentTime = selectedMediaTime;
    }
  }, [selectedMediaTime]);

  useEffect(() => {
    mediaRef.current?.addEventListener("timeupdate", onTimeUpdate);
    return () => mediaRef.current?.removeEventListener("timeupdate", onTimeUpdate);
  }, [mediaRef.current]);

  if (!url) {
    return <UILoadingPlaceholder className={className}></UILoadingPlaceholder>;
  }

  if (!attachment) return null;

  const renderAttachment = (isPlaceholder = false) => {
    return (
      <MessageAttachmentDisplayer
        mediaRef={mediaRef}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attachment={attachment!}
        attachmentUrl={url.downloadUrl}
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
        <AnimatePresence>
          {isFullscreenOpened && (
            <UIFullscreenHolder
              presenceStyles={{
                backgroundColor: ["#0000", "#0004"],
                pointerEvents: ["none", "all"],
              }}
              onClick={toggleIsFullscreenOpened}
            >
              {renderAttachment()}
            </UIFullscreenHolder>
          )}
        </AnimatePresence>
      </BodyPortal>
    </AnimateSharedLayout>
  );
};

const UIFullscreenHolder = styled(PresenceAnimator)`
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

const UILoadingPlaceholder = styled.div`
  height: ${ATTACHMENT_PREVIEW_HEIGHT_PX}rem;
`;

const UIAttachmentPlaceholder = styled.div`
  visibility: hidden;
  opacity: 0;
  display: flex;
`;

const UIInlineAttachmentHolder = styled.div`
  display: flex;
`;

export const MessageAttachment = styled(PureMessageAttachment)``;
