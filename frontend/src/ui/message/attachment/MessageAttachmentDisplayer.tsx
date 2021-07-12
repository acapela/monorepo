import React, { Ref } from "react";
import { AttachmentDetailedInfoFragment } from "~gql";
import styled from "styled-components";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { motion } from "framer-motion";
import { borderRadius } from "~ui/baseStyles";

export const ATTACHMENT_PREVIEW_HEIGHT_PX = 120;

interface AttachmentProps {
  mediaRef?: Ref<HTMLVideoElement>;
  attachment: AttachmentDetailedInfoFragment;
  attachmentUrl: string;
  className?: string;
  onClick?: () => void;
}

export const MessageAttachmentDisplayer = ({
  mediaRef,
  attachment,
  className,
  attachmentUrl,
  onClick,
}: AttachmentProps) => {
  const messageType = chooseMessageTypeFromMimeType(attachment.mimeType);

  function renderAttachment() {
    if (messageType === "VIDEO") {
      return (
        <PlayableMediaWrapper>
          <video ref={mediaRef} className={className} src={attachmentUrl} controls>
            Sorry, your browser doesn't support embedded videos.
          </video>
        </PlayableMediaWrapper>
      );
    }

    if (messageType === "AUDIO") {
      return (
        <PlayableMediaWrapper>
          <audio ref={mediaRef} className={className} src={attachmentUrl} controls>
            Sorry, your browser doesn't support embedded audios.
          </audio>
        </PlayableMediaWrapper>
      );
    }

    if (messageType === "TEXT") {
      const [type] = attachment.mimeType.split("/");

      if (type === "image") {
        return <ImageWrapper className={className} src={attachmentUrl} alt={attachment.originalName || ""} />;
      }

      return (
        <a href={attachmentUrl} target="_blank">
          <span>{attachment.originalName}</span>
        </a>
      );
    }

    return (
      <a href={attachmentUrl} target="_blank">
        <span>{attachment.originalName}</span>
      </a>
    );
  }

  return (
    <UIHolder onClick={onClick} transition={{ type: "spring", stiffness: 400, damping: 40 }}>
      {renderAttachment()}
    </UIHolder>
  );
};

const UIHolder = styled(motion.div)`
  max-height: 100%;
  min-width: 0;
  display: flex;
`;

const ImageWrapper = styled.img`
  max-height: 100%;
  max-height: 100%;
  /* Don't allow image to extend over space of the parent */
  min-width: 0;
  min-height: 0;
  user-select: none;
  ${borderRadius.item}
`;

const PlayableMediaWrapper = styled.div`
  max-height: 100%;

  audio,
  video {
    max-height: 100%;
  }
`;
