import React from "react";
import styled from "styled-components";
import { PopoverMenu, PopoverPosition } from "~ui/PopoverMenu";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { IconMoreVert } from "~ui/icons";
import { ACTION_ACTIVE_COLOR, hoverTransition } from "~ui/transitions";
import { RenameModal } from "./RenameModal";
import { TopicDetailedInfoFragment } from "~frontend/gql";

interface Props {
  topic: TopicDetailedInfoFragment;
}

export const ManageTopic = ({ topic }: Props) => {
  const [isModalOpen, { toggle }] = useBoolean(false);

  return (
    <>
      {isModalOpen && <RenameModal onClose={toggle} topic={topic} />}
      <PopoverMenu
        position={PopoverPosition.RIGHT_BOTTOM}
        options={[
          {
            label: "Rename",
            onSelect: toggle,
          },
        ]}
      >
        <Toggle>
          <IconMoreVert />
        </Toggle>
      </PopoverMenu>
    </>
  );
};

const TOGGLE_SIZE_PX = 18;

const Toggle = styled.button`
  width: ${TOGGLE_SIZE_PX}px;
  height: ${TOGGLE_SIZE_PX}px;
  background: #ffffff;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${hoverTransition()};
  cursor: pointer;
  @media (hover) {
    :hover {
      background-color: ${ACTION_ACTIVE_COLOR};
    }
  }
`;
