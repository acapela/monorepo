import React, { useState } from "react";
import { Attachment } from "~frontend/gql";
import styled from "styled-components";
import { useIsomorphicLayoutEffect } from "react-use";
import axios from "axios";

interface AttachmentProps {
  attachment: Pick<Attachment, "id" | "original_name">;
  className?: string;
}

const PureMessageAttachment = ({ attachment, className }: AttachmentProps) => {
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

  return (
    <a href={url} target="_blank">
      <img className={className} src={url} alt={attachment.original_name || ""} />
    </a>
  );
};

export const MessageAttachment = styled(PureMessageAttachment)`
  max-height: 100px;
  max-width: 100px;
`;
