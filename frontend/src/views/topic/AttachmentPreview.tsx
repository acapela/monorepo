import React from "react";
import styled from "styled-components";
import { useGetAttachmentQuery } from "~frontend/gql/topics";
import { MessageAttachment } from "~frontend/views/topic/Message/MessageAttachment";

interface Props {
  id: string;
  onRemoveRequest: (id: string) => void;
}

export const AttachmentPreview = ({ id, onRemoveRequest }: Props) => {
  const [data] = useGetAttachmentQuery({ id });

  if (!data?.attachment) return null;

  return (
    <UIHolder onClick={() => onRemoveRequest(id)}>
      <MessageAttachment attachment={data.attachment} selectedMediaTime={null} onMediaTimeUpdate={() => null} />
    </UIHolder>
  );
};

const UIHolder = styled.div``;
