import { motion } from "framer-motion";
import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { AttachmentEntity } from "@aca/frontend/clientdb/attachment";
import { chooseMessageTypeFromMimeType } from "@aca/frontend/utils/chooseMessageType";
import { TranscriptData } from "@aca/shared/types/transcript";
import { IconFile } from "@aca/ui/icons";
import { AudioPlayer } from "@aca/ui/media/AudioPlayer";
import { VideoPlayer } from "@aca/ui/media/VideoPlayer";
import { theme } from "@aca/ui/theme";

import { MessageImageAttachment } from "./MessageImageAttachment";

interface AttachmentProps {
  attachment: AttachmentEntity;
  attachmentUrl: string;
  className?: string;
}

export const MessageAttachmentDisplayer = styled<AttachmentProps>(
  observer(({ attachment, className, attachmentUrl }) => {
    const messageType = chooseMessageTypeFromMimeType(attachment.mime_type);

    const transcript: TranscriptData | undefined = attachment.transcription?.transcript;

    function renderAttachment(): ReactNode {
      switch (messageType) {
        case "VIDEO":
          return (
            <UIPlayableMediaWrapper>
              <UIMediaTypeIndicator>Shared video</UIMediaTypeIndicator>
              <VideoPlayer fileUrl={attachmentUrl} transcript={transcript} />
            </UIPlayableMediaWrapper>
          );
        case "AUDIO":
          return (
            <UIPlayableMediaWrapper>
              <UIMediaTypeIndicator>Shared audio</UIMediaTypeIndicator>
              <AudioPlayer fileUrl={attachmentUrl} transcript={transcript} />
            </UIPlayableMediaWrapper>
          );
      }

      const [attachmentMimeType] = attachment.mime_type.split("/");

      if (attachmentMimeType === "image") {
        return <MessageImageAttachment attachmentUrl={attachmentUrl} alt={attachment.original_name || ""} />;
      }

      return (
        <UIFileAttachmentDisplayer href={attachmentUrl} target="_blank" data-tooltip={attachment.original_name}>
          <IconFile />
          <UIFileName>{attachment.original_name}</UIFileName>
        </UIFileAttachmentDisplayer>
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

  /* Images are not auto-resizing properly in safari. */
  ${MessageImageAttachment} {
    height: auto;
    width: 150px;
  }
`;

const UIFileAttachmentDisplayer = styled(motion.a)<{}>`
  width: 150px;
  height: 150px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const UIFileName = styled.div<{}>`
  ${theme.typo.label};
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
`;

const UIPlayableMediaWrapper = styled.div<{}>`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UIMediaTypeIndicator = styled.div`
  ${theme.typo.label}; ;
`;
