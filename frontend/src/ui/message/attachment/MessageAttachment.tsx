import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { AttachmentDetailedInfoFragment } from "~gql";
import { useDownloadUrlQuery } from "~frontend/gql/attachments";
import { useBoolean } from "~shared/hooks/useBoolean";
import { BodyPortal } from "~ui/BodyPortal";
import { zIndex } from "~ui/zIndex";
import { ATTACHMENT_PREVIEW_HEIGHT_PX, MessageAttachmentDisplayer } from "./MessageAttachmentDisplayer";
import { MessageAttachmentActions } from "./MessageAttachmentActions";
import { borderRadius } from "~ui/baseStyles";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";

interface AttachmentProps {
  attachment: AttachmentDetailedInfoFragment;
  selectedMediaTime?: number | null;
  onMediaTimeUpdate?: (time: number) => void;
  onAttachmentRemoveRequest?: (attachment: AttachmentDetailedInfoFragment) => void;
  className?: string;
}

export const MessageAttachment = styled(
  ({ attachment, selectedMediaTime, onMediaTimeUpdate, className, onAttachmentRemoveRequest }: AttachmentProps) => {
    const mediaRef = useRef<HTMLVideoElement>(null);
    const user = useCurrentUser();
    const [attachmentInfo] = useDownloadUrlQuery({ id: attachment.id });
    const canEditAttachments = attachment.message_attachments.some(
      (attachment) => attachment.message.user_id === user?.id
    );
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

    if (!attachmentInfo) {
      return <UILoadingPlaceholder className={className}></UILoadingPlaceholder>;
    }

    if (!attachment) return null;

    const renderAttachment = (isPlaceholder = false) => {
      return (
        <MessageAttachmentDisplayer
          mediaRef={mediaRef}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          attachment={attachment!}
          attachmentUrl={attachmentInfo.downloadUrl}
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
          <AnimatePresence>
            {canEditAttachments && (
              <MessageAttachmentActions onRemoveRequest={() => onAttachmentRemoveRequest?.(attachment)} />
            )}
          </AnimatePresence>
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
  }
)``;

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
  position: relative;
  ${borderRadius.item}
  overflow: hidden;
`;
