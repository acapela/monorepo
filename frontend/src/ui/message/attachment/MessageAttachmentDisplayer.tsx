import { gql } from "@apollo/client";
import { motion } from "framer-motion";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { MessageAttachmentDisplayer_AttachmentFragment } from "~gql";
import { TranscriptData } from "~shared/types/transcript";
import { IconFile } from "~ui/icons";
import { AudioPlayer } from "~ui/media/AudioPlayer";
import { VideoPlayer } from "~ui/media/VideoPlayer";
import { theme } from "~ui/theme";

import { MessageImageAttachment } from "./MessageImageAttachment";

const fragments = {
  attachment: gql`
    fragment MessageAttachmentDisplayer_attachment on attachment {
      mimeType: mime_type
      originalName: original_name
      transcription {
        id
        status
        transcript
      }
    }
  `,
};

interface AttachmentProps {
  attachment: MessageAttachmentDisplayer_AttachmentFragment;
  attachmentUrl: string;
  className?: string;
}

const _MessageAttachmentDisplayer = styled<AttachmentProps>(({ attachment, className, attachmentUrl }) => {
  const messageType = chooseMessageTypeFromMimeType(attachment.mimeType);

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

    const [attachmentMimeType] = attachment.mimeType.split("/");

    if (attachmentMimeType === "image") {
      return <MessageImageAttachment attachmentUrl={attachmentUrl} alt={attachment.originalName || ""} />;
    }

    return (
      <UIFileAttachmentDisplayer href={attachmentUrl} target="_blank" data-tooltip={attachment.originalName}>
        <IconFile />
        <UIFileName>{attachment.originalName}</UIFileName>
      </UIFileAttachmentDisplayer>
    );
  }

  return (
    <UIHolder className={className} transition={{ type: "spring", stiffness: 400, damping: 40 }}>
      {renderAttachment()}
    </UIHolder>
  );
})``;

export const MessageAttachmentDisplayer = withFragments(fragments, _MessageAttachmentDisplayer);

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
  ${theme.font.body12.semibold.build()}
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
  ${theme.font.body12.semibold.build()};
`;
