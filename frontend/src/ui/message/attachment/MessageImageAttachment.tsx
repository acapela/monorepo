import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { IconButton } from "~frontend/../../ui/buttons/IconButton";
import { ScreenCover } from "~frontend/ui/Modal/ScreenCover";
import { useBoolean } from "~shared/hooks/useBoolean";
import { PopPresenceAnimator } from "~ui/animations";
import { CornerButtonWrapper } from "~ui/buttons/CornerButtonWrapper";
import { IconCross } from "~ui/icons";
import { useShortcuts } from "~ui/keyboard/useShortcut";
import { theme } from "~ui/theme";

interface AttachmentProps {
  attachmentUrl: string;
  className?: string;
  alt?: string;
}

export const MessageImageAttachment = styled<AttachmentProps>(({ attachmentUrl, className }) => {
  const [isFullscreenOpened, { set: openFullScreen, unset: closeFullscreen }] = useBoolean(false);

  useShortcuts(
    ["Space", "Esc"],
    () => {
      closeFullscreen();
    },
    { isEnabled: isFullscreenOpened }
  );

  return (
    <AnimateSharedLayout>
      <UIInlineAttachmentHolder onClick={openFullScreen}>
        <ImageWrapper src={attachmentUrl} className={className} />
      </UIInlineAttachmentHolder>
      <AnimatePresence>
        {isFullscreenOpened && (
          <ScreenCover isTransparent={false} onCloseRequest={closeFullscreen}>
            <CornerButtonWrapper>
              <IconButton tooltip="Esc or Space" onClick={closeFullscreen} icon={<IconCross />} />
            </CornerButtonWrapper>
            <PopPresenceAnimator>
              <ImageWrapper src={attachmentUrl} className={className} />
            </PopPresenceAnimator>
          </ScreenCover>
        )}
      </AnimatePresence>
    </AnimateSharedLayout>
  );
})``;

const UIInlineAttachmentHolder = styled.div<{}>`
  display: flex;
  position: relative;
  ${theme.radius.secondaryItem}
  overflow: hidden;
  cursor: pointer;
`;

const ImageWrapper = styled.img<{}>`
  /* Image doesn't fill whole screen when in fullscreen */
  max-height: 80vh;

  /* Don't allow image to extend over space of the parent */
  min-width: 0;
  min-height: 0;

  user-select: none;

  ${theme.radius.secondaryItem};
  will-change: transform, opacity;

  /* Safari fix - make sure image always keeps its aspect ratio. */
  object-fit: cover;
`;
