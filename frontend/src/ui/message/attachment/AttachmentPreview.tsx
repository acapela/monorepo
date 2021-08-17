import React from "react";
import styled from "styled-components";

import { useAttachmentQuery } from "~frontend/gql/attachments";
import { WideIconButton } from "~ui/buttons/WideIconButton";
import { IconTrash } from "~ui/icons";

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
      {!!onRemoveRequest && (
        <UIRemoveButtonHolder>
          <WideIconButton
            tooltip="Remove attachment"
            kind="primary"
            icon={<IconTrash />}
            onClick={() => onRemoveRequest(id)}
          />
        </UIRemoveButtonHolder>
      )}

      {<MessageAttachmentDisplayer attachmentUrl={`/attachments/${attachment.id}`} attachment={attachment} />}
    </UIHolder>
  );
};

const UIHolder = styled.div<{}>`
  display: flex;
  position: relative;
`;

const UIRemoveButtonHolder = styled.div<{}>`
  position: absolute;
  top: 8px;
  right: 8px;
`;
