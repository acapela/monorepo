import React from "react";

import { IconButton } from "~frontend/../../ui/buttons/IconButton";
import { CornerButtonWrapper } from "~ui/buttons/CornerButtonWrapper";
import { IconTrash } from "~ui/icons";

interface AttachmentProps {
  onRemoveRequest: () => void;
}

export const MessageAttachmentActions = ({ onRemoveRequest }: AttachmentProps) => {
  return (
    <CornerButtonWrapper showOnlyIfParentHovered>
      <IconButton icon={<IconTrash />} onClick={onRemoveRequest} tooltip="Remove attachment" />
    </CornerButtonWrapper>
  );
};
