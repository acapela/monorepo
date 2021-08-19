import { gql, useMutation } from "@apollo/client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import React, { useMemo, useState } from "react";

import { withFragments } from "~frontend/gql/utils";
import {
  getIndexBetweenCurrentAndLast,
  getIndexBetweenFirstAndCurrent,
  getIndexBetweenItems,
} from "~frontend/rooms/order";
import { byIndexAscending } from "~frontend/topics/utils";
import { SortableTopicList_RoomFragment, UpdateTopicIndexMutation, UpdateTopicIndexMutationVariables } from "~gql";
import { BodyPortal } from "~ui/BodyPortal";

import { UITopic, UITopicsList } from "./shared";
import { SortableTopicMenuItem, TopicMenuItem } from "./TopicMenuItem";

const useUpdateTopicIndex = () =>
  useMutation<UpdateTopicIndexMutation, UpdateTopicIndexMutationVariables>(
    gql`
      mutation UpdateTopicIndex($id: uuid!, $index: String!) {
        topic: update_topic_by_pk(pk_columns: { id: $id }, _set: { index: $index }) {
          id
          index
        }
      }
    `,
    {
      optimisticResponse: ({ id, index }) => ({
        __typename: "mutation_root",
        topic: { __typename: "topic", id, index },
      }),
    }
  );

const fragments = {
  room: gql`
    ${SortableTopicMenuItem.fragments.room}
    ${SortableTopicMenuItem.fragments.topic}

    fragment SortableTopicList_room on room {
      id
      ...TopicMenuItem_room
      topics {
        id
        index
        ...TopicMenuItem_topic
      }
    }
  `,
};

type Props = {
  room: SortableTopicList_RoomFragment;
  isDisabled?: boolean;
  activeTopicId: string | null;
};

export const SortableTopicsList = withFragments(fragments, ({ room, activeTopicId, isDisabled }: Props) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [updateTopicIndex] = useUpdateTopicIndex();
  // Sensors can be used to support multiple input modalities for drag-and-drop
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { delay: 250, tolerance: 200 } }));

  const sortedTopics = useMemo(() => room.topics.slice().sort(byIndexAscending), [room.topics]);

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const overIndex = sortedTopics.findIndex((topic) => topic.id == over.id)!;
    const activeIndex = sortedTopics.findIndex((topic) => topic.id == active.id);
    let newIndex: string;
    if (overIndex === 0) {
      newIndex = getIndexBetweenFirstAndCurrent(sortedTopics[0].index);
    } else if (overIndex === sortedTopics.length - 1) {
      const lastTopicInList = sortedTopics[sortedTopics.length - 1];
      newIndex = getIndexBetweenCurrentAndLast(lastTopicInList.index);
    } else {
      // overTopic indexes differ depending if the draggedTopic comes before/after item
      const { start, end } =
        overIndex > activeIndex ? { start: overIndex, end: overIndex + 1 } : { start: overIndex - 1, end: overIndex };

      newIndex = getIndexBetweenItems(sortedTopics[start].index, sortedTopics[end].index);
    }
    updateTopicIndex({ variables: { id: sortedTopics[activeIndex].id, index: newIndex } });
  }

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToFirstScrollableAncestor]}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setDraggedId(active.id)}
      onDragEnd={handleDragEnd}
    >
      <UITopicsList>
        <SortableContext items={sortedTopics.map((topic) => topic.id)} strategy={verticalListSortingStrategy}>
          {sortedTopics.map((topic) => (
            <UITopic key={topic.id}>
              <SortableTopicMenuItem
                isDisabled={isDisabled}
                room={room}
                topic={topic}
                isActive={activeTopicId === topic.id}
              />
            </UITopic>
          ))}
        </SortableContext>
      </UITopicsList>
      <BodyPortal>
        <DragOverlay>
          {draggedId && (
            <TopicMenuItem
              room={room}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              topic={sortedTopics.find((t) => t.id == draggedId)!}
              isActive={activeTopicId === draggedId}
              isDragged
            />
          )}
        </DragOverlay>
      </BodyPortal>
    </DndContext>
  );
});
