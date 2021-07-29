import React from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import styled, { css } from "styled-components";
import { TopicDetailedInfoFragment } from "~gql";
import { UIScrollContainer, UITopicsList, UITopic } from "./shared";
import { TopicMenuItem } from "./TopicMenuItem";
import { theme } from "~ui/theme";
import { setColorOpacity } from "~shared/colors";

interface Props {
  topics: TopicDetailedInfoFragment[];
  isDisabled?: boolean;
  activeTopicId: string | null;
  onMoveToStart: (toMove: TopicDetailedInfoFragment) => void;
  onMoveToEnd: (toMove: TopicDetailedInfoFragment) => void;
  onMoveBetween: (
    toMove: TopicDetailedInfoFragment,
    start: TopicDetailedInfoFragment,
    end: TopicDetailedInfoFragment
  ) => void;
}

export const SortableTopicsList = ({
  topics,
  activeTopicId,
  isDisabled,
  onMoveToStart: moveToStart,
  onMoveToEnd: moveToEnd,
  onMoveBetween: moveBetween,
}: Props) => {
  function handleDrag({ destination, source }: DropResult) {
    // Dropped outside of droppable area
    if (!destination) {
      return;
    }

    // Dropped in same position
    if (destination.index === source.index) {
      return;
    }

    if (destination.index === 0) {
      moveToStart(topics[source.index]);
      return;
    }

    if (destination.index === topics.length - 1) {
      moveToEnd(topics[source.index]);
      return;
    }

    // destination indexes differ depending if the source comes before/after item
    const { start, end } =
      destination.index > source.index
        ? { start: destination.index, end: destination.index + 1 }
        : { start: destination.index - 1, end: destination.index };

    moveBetween(topics[source.index], topics[start], topics[end]);
  }

  return (
    <UIScrollContainer>
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId={"droppable-id-static"}>
          {({ droppableProps, innerRef, placeholder: droppablePlaceholder }) => (
            <UITopicsList {...droppableProps} ref={innerRef}>
              {topics.map((topic, index) => {
                const isActive = activeTopicId === topic.id;

                return (
                  <Draggable key={topic.id} draggableId={topic.id} index={index} isDragDisabled={isDisabled}>
                    {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => {
                      const result = (
                        <>
                          <UIDraggableTopic
                            ref={innerRef}
                            {...draggableProps}
                            {...dragHandleProps}
                            isDragging={isDragging}
                          >
                            <TopicMenuItem topic={topic} isActive={isActive} />
                          </UIDraggableTopic>
                        </>
                      );

                      if (isDragging) {
                        return ReactDOM.createPortal(result, document.body);
                      }
                      return result;
                    }}
                  </Draggable>
                );
              })}
              {droppablePlaceholder}
            </UITopicsList>
          )}
        </Droppable>
      </DragDropContext>
    </UIScrollContainer>
  );
};

const UIDraggableTopic = styled(UITopic)<{ isDragging: boolean }>`
  ${({ isDragging }) =>
    isDragging
      ? css`
          background: ${(props) => setColorOpacity(props.theme.colors.interactive.selected, 0.8)};
          ${theme.borderRadius.item}
        `
      : ""}
`;
