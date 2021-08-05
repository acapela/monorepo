import { motion } from "framer-motion";
import React, { ReactNode, Ref } from "react";
import styled from "styled-components";
import { AudioPlayer } from "~ui/media/AudioPlayer";
import { VideoPlayer } from "~ui/media/VideoPlayer";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { AttachmentDetailedInfoFragment } from "~gql";
import { theme } from "~ui/theme";
import { MessageImageAttachment } from "./MessageImageAttachment";

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
              <UIMediaTypeIndicator>Shared video</UIMediaTypeIndicator>
              <VideoPlayer fileUrl={attachmentUrl} />
            </PlayableMediaWrapper>
          );
        case "AUDIO":
          return (
            <PlayableMediaWrapper>
              <UIMediaTypeIndicator>Shared audio</UIMediaTypeIndicator>
              <AudioPlayer fileUrl={attachmentUrl} />
            </PlayableMediaWrapper>
          );
        case "TEXT": {
          const [type] = attachment.mimeType.split("/");

          if (type === "image") {
            return <MessageImageAttachment attachmentUrl={attachmentUrl} alt={attachment.originalName || ""} />;
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

const PlayableMediaWrapper = styled.div<{ isWide?: boolean }>`
  width: 100%;
`;

const UIMediaTypeIndicator = styled.div`
  ${theme.font.body12.semibold.build()};
  margin-bottom: 16px;
`;
