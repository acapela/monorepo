import { action } from "mobx";
import { observer } from "mobx-react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { TopicEntity } from "~frontend/clientdb/topic";
import { UserEntity } from "~frontend/clientdb/user";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";

import { MESSAGES_VIEW_MAX_WIDTH_PX } from "./ui";

interface Props {
  topic: TopicEntity;
  user: UserEntity;
}

export const TopicHeader = observer(function TopicHeader({ topic, user }: Props) {
  function handleCloseRequest() {
    topic.update({ closed_at: new Date().toISOString(), closed_by_user_id: user.id });
  }

  const handleReopenTopic = action(() => {
    topic.update({
      closed_at: null,
      closed_by_user_id: null,
      closing_summary: null,
    });
    trackEvent("Reopened Topic", { topicId: topic.id });
  });

  return (
    <UIHolder>
      <UITitle>{topic.name}</UITitle>
      <UITopicTools>
        <AvatarList users={topic.participants.all} maxVisibleCount={5} />
        {/* TODO: Include invite button */}
        <Button
          kind="secondary"
          tooltip={topic.isClosed ? "Reopen Request" : "Close request for all participants"}
          onClick={() => (topic.isClosed ? handleReopenTopic() : handleCloseRequest())}
        >
          {!topic.isClosed && <>Close Request</>}
          {topic.isClosed && <>Reopen Request</>}
        </Button>
      </UITopicTools>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
  max-width: ${MESSAGES_VIEW_MAX_WIDTH_PX}px;
`;

const UITitle = styled.h3`
  ${theme.typo.pageTitle};
`;

const UITopicTools = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.horizontalActions.asGap}
  ${theme.typo.pageTitle};
`;
