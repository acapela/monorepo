import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { AttachmentDetailedInfoFragment } from "~gql";
import { useDownloadUrlQuery } from "~frontend/gql/attachments";
import { useBoolean } from "~shared/hooks/useBoolean";
import { zIndex } from "~ui/zIndex";
import { MessageAttachmentDisplayer, ATTACHMENT_PREVIEW_HEIGHT_PX } from "./MessageAttachmentDisplayer";
import { MessageAttachmentActions } from "./MessageAttachmentActions";
import { borderRadius } from "~ui/baseStyles";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useShortcuts } from "~ui/keyboard/useShortcut";
import { CornerButtonWrapper } from "~ui/buttons/CornerButtonWrapper";
import { IconCross } from "~ui/icons";
import { IconButton } from "~ui/buttons/IconButton";

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
    const canEditAttachments = attachment.message?.user_id === user?.id;
    const [isFullscreenOpened, { set: openFullScreen, unset: closeFullscreen }] = useBoolean(false);

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

    useShortcuts(
      ["Space", "Esc"],
      () => {
        closeFullscreen();
      },
      { isEnabled: isFullscreenOpened }
    );

    if (!attachmentInfo) {
      return <UILoadingPlaceholder className={className}></UILoadingPlaceholder>;
    }

    if (!attachment) return null;

    const renderAttachment = () => {
      return (
        <MessageAttachmentDisplayer
          mediaRef={mediaRef}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          attachment={attachment!}
          attachmentUrl={attachmentInfo.downloadUrl}
          onClick={openFullScreen}
        />
      );
    };

    return (
      <AnimateSharedLayout>
        <UIInlineAttachmentHolder>
          {renderAttachment()}
          <AnimatePresence>
            {canEditAttachments && (
              <MessageAttachmentActions onRemoveRequest={() => onAttachmentRemoveRequest?.(attachment)} />
            )}
          </AnimatePresence>
        </UIInlineAttachmentHolder>

        {isFullscreenOpened && (
          <UIFullscreenHolder onClick={closeFullscreen}>
            <CornerButtonWrapper>
              <IconButton tooltip="Esc or Space" onClick={closeFullscreen} type="primary" icon={<IconCross />} />
            </CornerButtonWrapper>
            {renderAttachment()}
          </UIFullscreenHolder>
        )}
      </AnimateSharedLayout>
    );
  }
)``;

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
  padding: 48px;
`;

const UILoadingPlaceholder = styled.div`
  height: 100%;
`;

const UIInlineAttachmentHolder = styled.div`
  display: flex;
  position: relative;
  ${borderRadius.item}
  overflow: hidden;

  /* Set explicit max height so it works properly in Safari. */
  ${MessageAttachmentDisplayer} {
    max-height: ${ATTACHMENT_PREVIEW_HEIGHT_PX}px;
  }
`;
