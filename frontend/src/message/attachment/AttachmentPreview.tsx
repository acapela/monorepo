import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useDb } from "@aca/frontend/clientdb";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconCross } from "@aca/ui/icons";

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
          <IconButton kind="primary" icon={<IconCross />} onClick={() => onRemoveRequest(id)} />
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
