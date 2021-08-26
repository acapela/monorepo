import { gql, useMutation } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import styled, { css } from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useIsCurrentUserRoomMember } from "~frontend/gql/rooms";
import { withFragments } from "~frontend/gql/utils";
import { useIsCurrentUserTopicManager } from "~frontend/topics/useIsCurrentUserTopicManager";
import { isTopicClosed } from "~frontend/topics/utils";
import { ManageTopic } from "~frontend/views/RoomView/TopicsList/ManageTopic";
import {
  CloseTopicMutation,
  CloseTopicMutationVariables,
  TopicHeader_RoomFragment,
  TopicHeader_TopicFragment,
} from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";
import { TextH3 } from "~ui/typo";

import { CloseTopicModal } from "./CloseTopicModal";

const fragments = {
  room: gql`
    ${useIsCurrentUserRoomMember.fragments.room}
    ${useIsCurrentUserTopicManager.fragments.room}
    ${ManageTopic.fragments.room}

    fragment TopicHeader_room on room {
      id
      finished_at
      ...IsCurrentUserRoomMember_room
      ...IsCurrentUserTopicManager_room
      ...ManageTopic_room
    }
  `,
  topic: gql`
    ${isTopicClosed.fragments.topic}
    ${useIsCurrentUserTopicManager.fragments.topic}
    ${ManageTopic.fragments.topic}

    fragment TopicHeader_topic on topic {
      id
      name
      archived_at
      ...IsTopicClosed_topic
      ...IsCurrentUserTopicManager_topic
      ...ManageTopic_topic
    }
  `,
};

interface Props {
  room: TopicHeader_RoomFragment;
  topic: TopicHeader_TopicFragment;
  className?: string;
}

const useCloseTopic = () =>
  useMutation<CloseTopicMutation, CloseTopicMutationVariables>(
    gql`
      mutation CloseTopic(
        $id: uuid!
        $closed_at: timestamp
        $closed_by_user_id: uuid
        $closing_summary: String
        $archived_at: timestamptz
      ) {
        topic: update_topic_by_pk(
          pk_columns: { id: $id }
          _set: {
            closed_at: $closed_at
            closed_by_user_id: $closed_by_user_id
            closing_summary: $closing_summary
            archived_at: $archived_at
          }
        ) {
          id
          closed_at
          closed_by_user_id
          closing_summary
          archived_at
        }
      }
    `,
    {
      optimisticResponse: (vars) => ({
        __typename: "mutation_root",
        topic: { __typename: "topic", ...vars },
      }),
    }
  );

const _TopicHeader = ({ room, topic }: Props) => {
  const [isClosingTopic, { unset: closeClosingModal, set: openClosingTopicModal }] = useBoolean(false);
  const user = useAssertCurrentUser();
  const isMember = useIsCurrentUserRoomMember(room);
  const [closeTopic] = useCloseTopic();
  const isClosed = Boolean(topic && isTopicClosed(topic));
  const isTopicManager = useIsCurrentUserTopicManager(room, topic);

  return (
    <UIHolder>
      <UITitle isClosed={isClosed}>{topic.name}</UITitle>

      {!room.finished_at && (
        <UIActions>
          {isClosed &&
            (topic.archived_at ? (
              <UIToggleCloseButton
                onClick={() => {
                  closeTopic({
                    variables: { id: topic.id, closed_at: null, closed_by_user_id: null, archived_at: null },
                  });
                  trackEvent("Reopened Topic");
                }}
                isDisabled={!isTopicManager && { reason: `You have to be room or topic owner to restore topics` }}
              >
                Restore Topic
              </UIToggleCloseButton>
            ) : (
              <UIToggleCloseButton
                onClick={() => {
                  closeTopic({ variables: { id: topic.id, closed_at: null, closed_by_user_id: null } });
                  trackEvent("Reopened Topic");
                }}
                isDisabled={!isTopicManager && { reason: `You have to be room or topic owner to reopen topics` }}
              >
                Reopen Topic
              </UIToggleCloseButton>
            ))}
          {!isClosed && (
            <UIToggleCloseButton
              onClick={openClosingTopicModal}
              isDisabled={!isMember && { reason: `You have to be room member to close topics` }}
            >
              Close Topic
            </UIToggleCloseButton>
          )}
          {isMember && <ManageTopic room={room} topic={topic} />}
        </UIActions>
      )}
      <AnimatePresence>
        {isClosingTopic && (
          <CloseTopicModal
            loading={false}
            topicId={topic.id}
            onDismissRequest={() => closeClosingModal()}
            onTopicClosed={(topicSummary) => {
              closeTopic({
                variables: {
                  id: topic.id,
                  closed_at: new Date().toISOString(),
                  closed_by_user_id: user.id,
                  closing_summary: topicSummary,
                },
              });
              trackEvent("Closed Topic", { topicId: topic.id });
            }}
          />
        )}
      </AnimatePresence>
    </UIHolder>
  );
};

export const TopicHeader = withFragments(fragments, _TopicHeader);

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 96px;
`;

const UITitle = styled(TextH3)<{ isClosed: boolean }>`
  margin-top: 24px;

  text-align: start;

  align-self: flex-start;

  ${theme.font.h4.spezia.medium.build}

  ${(props) => {
    if (props.isClosed) {
      return css`
        text-decoration: line-through;
        color: ${theme.colors.layout.supportingText()};
      `;
    }
  }}
`;

const UIActions = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UIToggleCloseButton = styled(Button)<{}>``;
