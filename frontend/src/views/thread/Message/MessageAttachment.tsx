import React from "react";
import { AttachmentDetailedInfoFragment, Message_Type_Enum } from "~frontend/gql";
import styled from "styled-components";
import { chooseType } from "~frontend/utils/chooseMessageType";
import { useGetDownloadUrlQuery } from "~frontend/gql/threads";

interface AttachmentProps {
  attachment: AttachmentDetailedInfoFragment;
  className?: string;
}

const PureMessageAttachment = ({ attachment, className }: AttachmentProps) => {
  const { data: downloadUrlData } = useGetDownloadUrlQuery({ id: attachment.id });
  const url = downloadUrlData?.get_download_url?.downloadUrl;
  const messageType = chooseType(attachment.mimeType);

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
      return (
        <a href={url} target="_blank">
          <img className={className} src={url} alt={attachment.originalName || ""} />
        </a>
      );
    } else {
      return (
        <a href={url} target="_blank">
          <span>{attachment.originalName}</span>
        </a>
      );
    }
  }

  return null;
};

export const MessageAttachment = styled(PureMessageAttachment)`
  max-height: 100px;
  max-width: 100px;
`;
