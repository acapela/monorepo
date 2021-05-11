import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { AttachmentDetailedInfoFragment, Message_Type_Enum } from "~frontend/gql";
import { useGetDownloadUrlQuery } from "~frontend/gql/threads";
import { chooseMessageTypeFromMimeType } from "~frontend/utils/chooseMessageType";

interface AttachmentProps {
  attachment: AttachmentDetailedInfoFragment;
  selectedMediaTime?: number;
  onMediaTimeUpdate: (time: number) => void;
  className?: string;
}

const PureMessageAttachment = ({ attachment, selectedMediaTime, onMediaTimeUpdate, className }: AttachmentProps) => {
  const mediaRef = useRef<HTMLVideoElement>(null);
  const { data: downloadUrlData } = useGetDownloadUrlQuery({ id: attachment.id });
  const url = downloadUrlData?.get_download_url?.downloadUrl;
  const messageType = chooseMessageTypeFromMimeType(attachment.mimeType);

  const onTimeUpdate = () => onMediaTimeUpdate(mediaRef.current?.currentTime ?? 0);

  useEffect(() => {
    if (typeof selectedMediaTime === "number" && mediaRef.current) {
      mediaRef.current.currentTime = selectedMediaTime;
    }
  }, [selectedMediaTime]);

  useEffect(() => {
    mediaRef.current?.addEventListener("timeupdate", onTimeUpdate);
    return () => mediaRef.current?.removeEventListener("timeupdate", onTimeUpdate);
  }, [mediaRef.current]);

  if (!url) {
    return <div className={className}>Fetching</div>;
  }

  if (messageType === Message_Type_Enum.Video) {
    return (
      <PlayableMediaWrapper>
        <video ref={mediaRef} className={className} src={url} controls>
          Sorry, your browser doesn't support embedded videos.
        </video>
      </PlayableMediaWrapper>
    );
  }

  if (messageType === Message_Type_Enum.Audio) {
    return (
      <PlayableMediaWrapper>
        <audio ref={mediaRef} className={className} src={url} controls>
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
