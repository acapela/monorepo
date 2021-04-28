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
      <PlayableMediaWrapper>
        <video className={className} src={url} controls>
          Sorry, your browser doesn't support embedded videos.
        </video>
      </PlayableMediaWrapper>
    );
  }

  if (messageType === Message_Type_Enum.Audio) {
    return (
      <PlayableMediaWrapper>
        <audio className={className} src={url} controls>
          Sorry, your browser doesn't support embedded audios.
        </audio>
      </PlayableMediaWrapper>
    );
  }

  if (messageType === Message_Type_Enum.Text) {
    const type = attachment.mimeType.split("/")[0];

    if (type === "image") {
      return (
        <ImageWrapper href={url} target="_blank">
          <img className={className} src={url} alt={attachment.originalName || ""} />
        </ImageWrapper>
      );
    }

    return (
      <a href={url} target="_blank">
        <span>{attachment.originalName}</span>
      </a>
    );
  }

  return null;
};

const ImageWrapper = styled.a`
  display: inline-block;
  max-height: 100px;
  max-width: 100px;
`;

const PlayableMediaWrapper = styled.div`
  max-width: 100%;

  audio,
  video {
    max-width: 100%;
  }
`;

export const MessageAttachment = styled(PureMessageAttachment)``;
