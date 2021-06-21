import React from "react";
import styled from "styled-components";
import { POP_PRESENCE_STYLES } from "~frontend/../../ui/animations";
import { IconButton } from "~frontend/../../ui/buttons/IconButton";
import { ITEM_COVER_COLOR } from "~frontend/../../ui/colors";
import { IconTrash } from "~frontend/../../ui/icons";
import { CornerOptionsMenu } from "~frontend/ui/options/CornerOptionsMenu";
import { PresenceAnimator } from "~ui/PresenceAnimator";

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
  return (
    <UIHolder presenceStyles={{ opacity: [0, 1] }}>
      <IconButton isPrimary icon={<IconTrash />} tooltip="Remove attachment" />
    </UIHolder>
  );
};

const UIHolder = styled(PresenceAnimator)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${ITEM_COVER_COLOR};
  color: #fff;
`;
