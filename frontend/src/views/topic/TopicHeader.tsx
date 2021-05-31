import styled from "styled-components";
import { TextTitle } from "~ui/typo";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { Button } from "~ui/button";

interface Props {
  topic: TopicDetailedInfoFragment;
  className?: string;
}

export const TopicHeader = styled(function TopicHeader({ topic, className }: Props) {
  return (
    <UIHolder className={className}>
      <UITitle>{topic.name}</UITitle>
      <UIAction>
        <Button>Close topic</Button>
      </UIAction>
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UITitle = styled(TextTitle)``;

const UIAction = styled.div``;
