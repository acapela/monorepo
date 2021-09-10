import { motion } from "framer-motion";
import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { AttachmentEntity } from "~frontend/clientdb/attachment";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { TranscriptData } from "~shared/types/transcript";
import { AudioPlayer } from "~ui/media/AudioPlayer";
import { VideoPlayer } from "~ui/media/VideoPlayer";
import { theme } from "~ui/theme";

import { MessageImageAttachment } from "./MessageImageAttachment";

interface AttachmentProps {
  attachment: AttachmentEntity;
  attachmentUrl: string;
  className?: string;
}

export const MessageAttachmentDisplayer = styled<AttachmentProps>(
  observer(({ attachment, className, attachmentUrl }) => {
    const messageType = chooseMessageTypeFromMimeType(attachment.mime_type);
    // TODOC add transcript
    const transcript: TranscriptData | undefined = undefined;

    // const transcript: TranscriptData | undefined = attachment.transcription?.transcript;

    function renderAttachment(): ReactNode {
      switch (messageType) {
        case "VIDEO":
          return (
            <PlayableMediaWrapper>
              <UIMediaTypeIndicator>Shared video</UIMediaTypeIndicator>
              <VideoPlayer fileUrl={attachmentUrl} transcript={transcript} />
            </PlayableMediaWrapper>
          );
        case "AUDIO":
          return (
            <PlayableMediaWrapper>
              <UIMediaTypeIndicator>Shared audio</UIMediaTypeIndicator>
              <AudioPlayer fileUrl={attachmentUrl} transcript={transcript} />
            </PlayableMediaWrapper>
          );
      }

      const [attachmentMimeType] = attachment.mime_type.split("/");

      if (attachmentMimeType === "image") {
        return <MessageImageAttachment attachmentUrl={attachmentUrl} alt={attachment.original_name || ""} />;
      }

      return (
        <a href={attachmentUrl} target="_blank">
          <span>{attachment.original_name}</span>
        </a>
      );
    }

    return (
      <UIHolder className={className} transition={{ type: "spring", stiffness: 400, damping: 40 }}>
        {renderAttachment()}
      </UIHolder>
    );
  })
)``;

const UIHolder = styled(motion.div)<{}>`
  max-height: 100%;
  min-width: 0;
  display: flex;
`;

const PlayableMediaWrapper = styled.div<{}>`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UIMediaTypeIndicator = styled.div`
  ${theme.font.body12.semibold.build()};
`;
