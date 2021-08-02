import { motion } from "framer-motion";
import React, { ReactNode, Ref } from "react";
import styled from "styled-components";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { AttachmentDetailedInfoFragment } from "~gql";
import { theme } from "~ui/theme";

export const ATTACHMENT_PREVIEW_HEIGHT_PX = 120;

interface AttachmentProps {
  mediaRef?: Ref<HTMLVideoElement>;
  attachment: AttachmentDetailedInfoFragment;
  attachmentUrl: string;
  className?: string;
  onClick?: () => void;
}

export const MessageAttachmentDisplayer = styled<AttachmentProps>(
  ({ mediaRef, attachment, className, attachmentUrl, onClick }) => {
    const messageType = chooseMessageTypeFromMimeType(attachment.mimeType);

    function renderAttachment(): ReactNode {
      switch (messageType) {
        case "VIDEO":
          return (
            <PlayableMediaWrapper>
              <video ref={mediaRef} src={attachmentUrl} controls>
                Sorry, your browser doesn't support embedded videos.
              </video>
            </PlayableMediaWrapper>
          );
        case "AUDIO":
          return (
            <PlayableMediaWrapper>
              <audio ref={mediaRef} src={attachmentUrl} controls>
                Sorry, your browser doesn't support embedded audios.
              </audio>
            </PlayableMediaWrapper>
          );
        case "TEXT": {
          const [type] = attachment.mimeType.split("/");

          if (type === "image") {
            return <ImageWrapper src={attachmentUrl} alt={attachment.originalName || ""} />;
          }

          return (
            <a href={attachmentUrl} target="_blank">
              <span>{attachment.originalName}</span>
            </a>
          );
        }
      }

      return (
        <a href={attachmentUrl} target="_blank">
          <span>{attachment.originalName}</span>
        </a>
      );
    }

    return (
      <UIHolder className={className} onClick={onClick} transition={{ type: "spring", stiffness: 400, damping: 40 }}>
        {renderAttachment()}
      </UIHolder>
    );
  }
)``;

const UIHolder = styled(motion.div)<{}>`
  max-height: 100%;
  min-width: 0;
  display: flex;
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

const PlayableMediaWrapper = styled.div<{}>`
  max-height: 100%;

  audio,
  video {
    max-height: 100%;
  }
`;
