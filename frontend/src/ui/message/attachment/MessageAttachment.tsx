import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDownloadUrlQuery } from "~frontend/gql/attachments";
import { ScreenCover } from "~frontend/ui/Modal/ScreenCover";
import { AttachmentDetailedInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { CornerButtonWrapper } from "~ui/buttons/CornerButtonWrapper";
import { WideIconButton } from "~ui/buttons/WideIconButton";
import { IconCross } from "~ui/icons";
import { useShortcuts } from "~ui/keyboard/useShortcut";
import { theme } from "~ui/theme";
import { MessageAttachmentActions } from "./MessageAttachmentActions";
import { ATTACHMENT_PREVIEW_HEIGHT_PX, MessageAttachmentDisplayer } from "./MessageAttachmentDisplayer";

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
          <ScreenCover isTransparent={false} onCloseRequest={closeFullscreen}>
            <CornerButtonWrapper>
              <WideIconButton tooltip="Esc or Space" onClick={closeFullscreen} kind="primary" icon={<IconCross />} />
            </CornerButtonWrapper>
            {renderAttachment()}
          </ScreenCover>
        )}
      </AnimateSharedLayout>
    );
  }
)``;

const UILoadingPlaceholder = styled.div`
  height: 100%;
`;

const UIInlineAttachmentHolder = styled.div`
  display: flex;
  position: relative;
  ${theme.borderRadius.item}
  overflow: hidden;

  /* Set explicit max height so it works properly in Safari. */
  ${MessageAttachmentDisplayer} {
    max-height: ${ATTACHMENT_PREVIEW_HEIGHT_PX}px;
  }
`;
