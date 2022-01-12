import React from "react";

import { CornerButtonWrapper } from "@aca/ui/buttons/CornerButtonWrapper";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconTrash } from "@aca/ui/icons";

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
