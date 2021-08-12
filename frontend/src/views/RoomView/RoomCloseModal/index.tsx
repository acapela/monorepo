import { gql, useMutation } from "@apollo/client";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { withFragments } from "~frontend/gql/utils";
import { Modal } from "~frontend/ui/Modal";
import { RoomCloseModal_RoomFragment } from "~gql";
import { Button } from "~ui/buttons/Button";
import { createPromiseUI } from "~ui/createPromiseUI";
import { TextBody, TextH3 } from "~ui/typo";

type RoomCloseModalResult = boolean;

const MAX_TOPICS_PER_COLUMN = 5;

// When there's more than 5 open topics, the height of the modal starts increasing significantly
// We're dividing the topics into columns after they pass a certain threshold
// Each of the columns will be of similar in size e.g, 6 topics = 2 columns of 3 topics each
type Topics = RoomCloseModal_RoomFragment["topics"];
function splitTopicsIntoColumns(topics: Topics): Topics[] {
  const columns = [];

  const numberOfColumns = Math.ceil(topics.length / MAX_TOPICS_PER_COLUMN);
  const spacesInColumn = Math.ceil(topics.length / numberOfColumns);

  for (let i = 0; i < topics.length; i += spacesInColumn) {
    columns.push(topics.slice(i, i + spacesInColumn));
  }

  return columns;
}

export const closeOpenTopicsPrompt = withFragments(
  {
    room: gql`
      fragment RoomCloseModal_room on room {
        id
        topics {
          id
          name
        }
      }
    `,
  },
  createPromiseUI<RoomCloseModal_RoomFragment, RoomCloseModalResult>((room, resolve) => {
    const { id: closedByUserId } = useAssertCurrentUser();

    const [closeOpenTopics, { loading: isClosingOpenTopics }] = useMutation(gql`
      mutation CloseOpenTopics($roomId: uuid!, $closedAt: timestamp, $closedByUserId: uuid) {
        update_topic(
          where: { room_id: { _eq: $roomId } }
          _set: { closed_at: $closedAt, closed_by_user_id: $closedByUserId }
        ) {
          affected_rows
        }
      }
    `);

    async function handleCloseOpenTopics() {
      await closeOpenTopics({
        variables: {
          roomId: room.id,
          closedAt: new Date().toISOString(),
          closedByUserId,
        },
      });
      resolve(true);
      return;
    }

    const columnsOfTopics = splitTopicsIntoColumns(room.topics);

    return (
      <Modal onCloseRequest={() => resolve(false)}>
        <UIContentWrapper>
          <TextH3>Just a sec, there are open topics!</TextH3>
          <UITopicClosingInfo>
            In order to close the room, all topics must be closed. We can do it for you now or you go back to the room
            and do it manually. Just a quick reminder, here is the list of open topics:
          </UITopicClosingInfo>

          <UIOpenTopicsColumns>
            {columnsOfTopics.map((topicsColumn, columnIndex) => (
              <UIOpenTopicsColumn key={columnIndex}>
                {topicsColumn.map((topic) => (
                  <UIOpenTopicItem key={topic.id}>{topic.name}</UIOpenTopicItem>
                ))}
              </UIOpenTopicsColumn>
            ))}
          </UIOpenTopicsColumns>
          <Button isLoading={isClosingOpenTopics} onClick={handleCloseOpenTopics}>
            Close all open topics
          </Button>
        </UIContentWrapper>
      </Modal>
    );
  })
);

const UIContentWrapper = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;

  min-width: 360px;
  max-width: 720px;

  padding: 0 52px 24px 52px;
`;

const UITopicClosingInfo = styled(TextBody)<{}>`
  color: hsla(0, 0%, 71%, 1);
`;

const UIOpenTopicsColumns = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 48px;

  text-align: start;
  margin: 24px 0;
`;

const UIOpenTopicsColumn = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UIOpenTopicItem = styled.div<{}>``;
