import React from "react";
import styled from "styled-components";

import { useAttachmentQuery } from "~frontend/gql/attachments";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { IconCross } from "~ui/icons";

import { MessageAttachmentDisplayer } from "./MessageAttachmentDisplayer";

interface Props {
  id: string;
  onRemoveRequest?: (id: string) => void;
}

export const AttachmentPreview = ({ id, onRemoveRequest }: Props) => {
  const [attachment] = useAttachmentQuery({ id });

  if (!attachment) return null;

  return (
    <UIHolder>
      <MessageAttachmentDisplayer attachmentUrl={`/attachments/${attachment.id}`} attachment={attachment} />
      {!!onRemoveRequest && (
        <UIRemoveButtonHolder>
          <CircleIconButton
            tooltip="Remove file"
            kind="primary"
            icon={<IconCross />}
            onClick={() => onRemoveRequest(id)}
          />
        </UIRemoveButtonHolder>
      )}
    </UIHolder>
  );
};

const UIHolder = styled.div<{}>`
  display: flex;
  position: relative;
  height: 120px;
`;

const UIRemoveButtonHolder = styled.div<{}>`
  position: absolute;
  top: 4px;
  right: 4px;
`;
