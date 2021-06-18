import React from "react";
import styled from "styled-components";
import { useAttachmentQuery } from "~frontend/gql/topics";
import { MessageAttachment } from "./messagesFeed/messageContent/attachment/MessageAttachment";

interface Props {
  id: string;
  onRemoveRequest: (id: string) => void;
}

export const AttachmentPreview = ({ id, onRemoveRequest }: Props) => {
  const [attachment] = useAttachmentQuery({ id });

  if (!attachment) return null;

  return (
    <UIHolder onClick={() => onRemoveRequest(id)}>
      <MessageAttachment attachment={attachment} selectedMediaTime={null} onMediaTimeUpdate={() => null} />
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: flex;
`;
