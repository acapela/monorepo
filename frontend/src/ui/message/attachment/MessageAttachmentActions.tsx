import React from "react";
import { CornerButtonWrapper } from "~ui/buttons/CornerButtonWrapper";
import { WideIconButton } from "~ui/buttons/WideIconButton";
import { IconTrash } from "~ui/icons";

interface AttachmentProps {
  onRemoveRequest: () => void;
}

export const MessageAttachmentActions = ({ onRemoveRequest }: AttachmentProps) => {
  return (
    <CornerButtonWrapper showOnlyIfParentHovered>
      <WideIconButton icon={<IconTrash />} onClick={onRemoveRequest} tooltip="Remove attachment" />
    </CornerButtonWrapper>
  );
};
