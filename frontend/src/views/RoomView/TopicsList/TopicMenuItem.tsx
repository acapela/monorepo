import styled, { css } from "styled-components";
import { routes } from "~frontend/routes";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { hoverActionCss, ACTION_ACTIVE_COLOR } from "~ui/transitions";

interface Props {
  topic: TopicDetailedInfoFragment;
  isActive: boolean;
  className?: string;
}

const TopicLink = routes.spaceRoomTopic.Link;

export const TopicMenuItem = styled(function TopicMenuItem({ topic, isActive, className }: Props) {
  return (
    <TopicLink params={{ topicId: topic.id, roomId: topic.room.id, spaceId: topic.room.space_id }}>
      <UIHolder className={className} isActive={isActive}>
        {topic.name}
      </UIHolder>
    </TopicLink>
  );
})``;

const UIHolder = styled.a<{ isActive: boolean }>`
  position: relative;
  padding: 0.75em;
  margin-left: -0.75em;
  cursor: pointer;
  display: flex;

  ${hoverActionCss}

  ${(props) => {
    if (props.isActive) {
      return css`
        background: ${ACTION_ACTIVE_COLOR};
      `;
    }
  }}
`;
