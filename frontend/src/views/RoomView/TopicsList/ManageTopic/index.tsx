import React, { useCallback } from "react";
import styled from "styled-components";
import { PopoverMenu, PopoverPosition } from "~ui/PopoverMenu";
import { IconMoreVert } from "~ui/icons";
import { ACTION_ACTIVE_COLOR, hoverTransition } from "~ui/transitions";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { openUIPrompt } from "~frontend/utils/prompt";
import { useEditTopicMutation } from "~frontend/gql/topics";

interface Props {
  topic: TopicDetailedInfoFragment;
}

export const ManageTopic = ({ topic }: Props) => {
  const [editTopic] = useEditTopicMutation();
  const handleRenameSelect = useCallback(async () => {
    const name = await openUIPrompt({
      title: "Rename topic",
      submitLabel: "Rename",
      placeholder: "Enter topic name",
    });
    if (!name?.trim()) {
      return;
    }
    await editTopic({ topicId: topic.id, name });
  }, []);

  return (
    <>
      <PopoverMenu
        position={PopoverPosition.RIGHT_BOTTOM}
        options={[
          {
            label: "Rename",
            onSelect: handleRenameSelect,
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
