import React from "react";
import { CornerButtonWrapper } from "~frontend/../../ui/buttons/CornerButtonWrapper";
import { WideIconButton } from "~frontend/../../ui/buttons/WideIconButton";
import { CornerOptionsMenu } from "~frontend/ui/options/CornerOptionsMenu";
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
