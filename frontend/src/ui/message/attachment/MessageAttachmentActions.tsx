import React from "react";
import { CornerOptionsMenu } from "~frontend/ui/options/CornerOptionsMenu";
import { IconTrash } from "~ui/icons";

interface AttachmentProps {
  onRemoveRequest: () => void;
}

export const MessageAttachmentActions = ({ onRemoveRequest }: AttachmentProps) => {
  return (
    <CornerOptionsMenu
      options={[
        {
          label: "Delete attachment",
          onSelect: onRemoveRequest,
          icon: <IconTrash />,
          isDestructive: true,
        },
      ]}
      tooltip="Show options..."
    />
  );
};
