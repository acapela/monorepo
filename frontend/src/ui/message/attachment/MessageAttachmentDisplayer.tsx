import { gql } from "@apollo/client";
import { motion } from "framer-motion";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";
import { MessageAttachmentDisplayer_AttachmentFragment } from "~gql";
import { AudioPlayer } from "~ui/media/AudioPlayer";
import { VideoPlayer } from "~ui/media/VideoPlayer";
import { theme } from "~ui/theme";

import { MessageImageAttachment } from "./MessageImageAttachment";

const fragments = {
  attachment: gql`
    fragment MessageAttachmentDisplayer_attachment on attachment {
      mimeType: mime_type
      originalName: original_name
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
    }

    const [attachmentMimeType] = attachment.mimeType.split("/");

    if (attachmentMimeType === "image") {
      return <MessageImageAttachment attachmentUrl={attachmentUrl} alt={attachment.originalName || ""} />;
    }

    return (
      <a href={attachmentUrl} target="_blank">
        <span>{attachment.originalName}</span>
      </a>
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
