import React, { useState } from "react";
import { AttachmentDetailedInfoFragment, Message_Type_Enum } from "~frontend/gql";
import styled from "styled-components";
import { useIsomorphicLayoutEffect } from "react-use";
import axios from "axios";

interface AttachmentProps {
  attachment: AttachmentDetailedInfoFragment;
  messageType: Message_Type_Enum;
  className?: string;
}

const PureMessageAttachment = ({ attachment, messageType, className }: AttachmentProps) => {
  const [url, setUrl] = useState();

  useIsomorphicLayoutEffect(() => {
    axios({
      method: "GET",
      url: `/api/backend/v1/attachments/${attachment.id}`,
    }).then(({ data: { publicUrl } }) => setUrl(publicUrl));
  }, []);

  if (!url) {
    return <div className={className}>Fetching</div>;
  }

  if (messageType === Message_Type_Enum.Video) {
    return (
      <video className={className} src={url} controls>
        Sorry, your browser doesn't support embedded videos.
      </video>
    );
  }

  /* !!! Not tested */
  if (messageType === Message_Type_Enum.Audio) {
    return (
      <audio className={className} src={url} controls>
        Sorry, your browser doesn't support embedded audios.
      </audio>
    );
  }

  if (messageType === Message_Type_Enum.Text) {
    const type = attachment.mimeType.split("/")[0];

    if (type === "image") {
      return <img className={className} src={url} alt={attachment.originalName || ""} />;
    }
  }

  return null;
};

export const MessageAttachment = styled(PureMessageAttachment)`
  max-height: 100px;
  max-width: 100px;
`;
