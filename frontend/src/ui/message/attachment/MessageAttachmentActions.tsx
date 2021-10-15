import React from "react";

import { CornerButtonWrapper } from "~ui/buttons/CornerButtonWrapper";
import { IconButton } from "~ui/buttons/IconButton";
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
