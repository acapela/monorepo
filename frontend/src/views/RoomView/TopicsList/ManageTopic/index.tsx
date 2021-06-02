import React from "react";
import styled from "styled-components";
import { PopoverMenu, PopoverPosition } from "~ui/PopoverMenu";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { IconVerticalThreeDots } from "~ui/icons";
import { hoverTransition } from "~ui/transitions";
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
          <IconVerticalThreeDots />
        </Toggle>
      </PopoverMenu>
    </>
  );
};

const Toggle = styled.button`
  --size: 18px;
  width: var(--size);
  height: var(--size);
  background: var(--white);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${hoverTransition()};
  cursor: pointer;
  @media (hover) {
    :hover {
      background-color: var(--active);
    }
  }
`;
