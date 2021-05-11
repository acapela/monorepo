import React from "react";
import { AttachmentDetailedInfoFragment, Message_Type_Enum } from "~frontend/gql";
import styled from "styled-components";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { motion } from "framer-motion";

interface AttachmentProps {
  attachment: AttachmentDetailedInfoFragment;
  attachmentUrl: string;
  className?: string;
  onClick?: () => void;
  layoutId?: string | null;
}

export const MessageAttachmentDisplayer = ({
  attachment,
  className,
  attachmentUrl,
  onClick,
  layoutId = `attachment-${attachment.id}`,
}: AttachmentProps) => {
  const messageType = chooseMessageTypeFromMimeType(attachment.mimeType);

  function renderAttachment() {
    if (messageType === Message_Type_Enum.Video) {
      return (
        <PlayableMediaWrapper>
          <video className={className} src={attachmentUrl} controls>
            Sorry, your browser doesn't support embedded videos.
          </video>
        </PlayableMediaWrapper>
      );
    }

    if (messageType === Message_Type_Enum.Audio) {
      return (
        <PlayableMediaWrapper>
          <audio className={className} src={attachmentUrl} controls>
            Sorry, your browser doesn't support embedded audios.
          </audio>
        </PlayableMediaWrapper>
      );
    }

    if (messageType === Message_Type_Enum.Text) {
      const type = attachment.mimeType.split("/")[0];

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
    <UIHolder layoutId={layoutId ?? undefined} onClick={onClick}>
      {renderAttachment()}
    </UIHolder>
  );
};

const UIHolder = styled(motion.div)``;

const ImageWrapper = styled.img``;

const PlayableMediaWrapper = styled.div`
  max-width: 100%;

  audio,
  video {
    max-width: 100%;
  }
`;
