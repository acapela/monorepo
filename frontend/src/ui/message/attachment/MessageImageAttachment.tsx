import { AnimateSharedLayout } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { ScreenCover } from "~frontend/ui/Modal/ScreenCover";
import { useBoolean } from "~shared/hooks/useBoolean";
import { CornerButtonWrapper } from "~ui/buttons/CornerButtonWrapper";
import { WideIconButton } from "~ui/buttons/WideIconButton";
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

      {isFullscreenOpened && (
        <ScreenCover isTransparent={false} onCloseRequest={closeFullscreen}>
          <CornerButtonWrapper>
            <WideIconButton tooltip="Esc or Space" onClick={closeFullscreen} kind="primary" icon={<IconCross />} />
          </CornerButtonWrapper>
          <ImageWrapper src={attachmentUrl} className={className} />
        </ScreenCover>
      )}
    </AnimateSharedLayout>
  );
})``;

const UIInlineAttachmentHolder = styled.div<{}>`
  display: flex;
  position: relative;
  ${theme.borderRadius.item}
  overflow: hidden;
  max-height: 120px;
`;

const ImageWrapper = styled.img<{}>`
  max-height: 100%;
  /* Allow parent to control max-height so it can be used both for fullscreen and inline displaying. */
  max-height: inherit;
  /* Don't allow image to extend over space of the parent */
  min-width: 0;
  min-height: 0;
  user-select: none;
  ${theme.borderRadius.item}

  /* Safari fix - make sure image always keeps its aspect ratio. */
  object-fit: scale-down;
`;
