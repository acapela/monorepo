import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { IconCross } from "~ui/icons";

import { MessageAttachmentDisplayer } from "./MessageAttachmentDisplayer";

interface Props {
  id: string;
  onRemoveRequest?: (id: string) => void;
}

export const AttachmentPreview = observer(({ id, onRemoveRequest }: Props) => {
  const db = useDb();
  const attachment = db.attachment.findById(id);
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
});

const UIHolder = styled.div<{}>`
  display: flex;
  position: relative;
`;

const UIRemoveButtonHolder = styled.div<{}>`
  position: absolute;
  top: 4px;
  right: 4px;
`;
