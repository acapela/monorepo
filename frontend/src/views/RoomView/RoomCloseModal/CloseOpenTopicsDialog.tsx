import React from "react";
import styled from "styled-components";
import { Button } from "~frontend/../../ui/buttons/Button";
import { PageTitle, SecondaryText } from "~frontend/../../ui/typo";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { Modal } from "~frontend/ui/Modal";

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

interface Props {
  openTopics: TopicDetailedInfoFragment[];
  isLoading: boolean;
  onCloseRequest: () => void;
  onConfirmation: () => void;
}

export const CloseOpenTopicsDialog = ({ openTopics, isLoading, onCloseRequest, onConfirmation }: Props) => {
  const columnsOfTopics = splitTopicsIntoColumns(openTopics);

  return (
    <Modal onCloseRequest={onCloseRequest}>
      <UIContentWrapper>
        <PageTitle>Just a sec, there are open topics!</PageTitle>
        <UITopicClosingInfo>
          In order to close the room, all topics must be closed. We can do it for you now or you go back to the room and
          do it manually. Just a quick reminder, here is the list of open topics:
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
        <Button isLoading={isLoading} onClick={onConfirmation}>
          Close all open topics
        </Button>
      </UIContentWrapper>
    </Modal>
  );
};

const UIContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;

  min-width: 360px;
  max-width: 720px;

  padding: 0 52px 24px 52px;
`;

const UITopicClosingInfo = styled(SecondaryText)`
  color: hsla(0, 0%, 71%, 1);
`;

const UIOpenTopicsColumns = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 48px;

  text-align: start;
  margin: 24px 0;
`;

const UIOpenTopicsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UIOpenTopicItem = styled.div``;
