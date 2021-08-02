import React from "react";

import { createPromiseUI } from "~ui/createPromiseUI";

import { TopicDetailedInfoFragment } from "~gql";
import { Modal } from "~frontend/ui/Modal";
import { useCloseOpenTopicsMutation } from "~frontend/gql/rooms";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import styled from "styled-components";
import { Button } from "~ui/buttons/Button";
import { TextH3, TextBody } from "~ui/typo";

interface RoomCloseModalInput {
  roomId: string;
  openTopics: TopicDetailedInfoFragment[];
}

type RoomCloseModalResult = boolean;

const MAX_TOPICS_PER_COLUMN = 5;

// When there's more than 5 open topics, the height of the modal starts increasing significantly
// We're dividing the topics into columns after they pass a certain threshold
// Each of the columns will be of similar in size e.g, 6 topics = 2 columns of 3 topics each
function splitTopicsIntoColumns(topics: TopicDetailedInfoFragment[]): TopicDetailedInfoFragment[][] {
  const columns = [];

  const numberOfColumns = Math.ceil(topics.length / MAX_TOPICS_PER_COLUMN);
  const spacesInColumn = Math.ceil(topics.length / numberOfColumns);

  for (let i = 0; i < topics.length; i += spacesInColumn) {
    columns.push(topics.slice(i, i + spacesInColumn));
  }

  return columns;
}

export const closeOpenTopicsPrompt = createPromiseUI<RoomCloseModalInput, RoomCloseModalResult>(
  ({ roomId, openTopics }, resolve) => {
    const { id: closedByUserId } = useAssertCurrentUser();

    const [closeOpenTopics, { loading: isClosingOpenTopics }] = useCloseOpenTopicsMutation();

    async function handleCloseOpenTopics() {
      await closeOpenTopics({
        roomId,
        closedAt: new Date().toISOString(),
        closedByUserId,
      });
      resolve(true);
      return;
    }

    const columnsOfTopics = splitTopicsIntoColumns(openTopics);

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
  }
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
