import { AnimatePresence } from "framer-motion";
import { groupBy, orderBy, toPairs } from "lodash";
import { action, computed } from "mobx";
import { observer } from "mobx-react";
import styled, { css } from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { MessageEntity } from "~frontend/clientdb/message";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { isNotNullish } from "~shared/nullish";
import { REQUEST_DECISION } from "~shared/requests";
import { pluralize } from "~shared/text/pluralize";
import { FadePresenceAnimator } from "~ui/animations";
import { IconCheck } from "~ui/icons";
import { theme } from "~ui/theme";

interface Props {
  message: MessageEntity;
}

export const DecisionVoting = observer(function DecisionVoting({ message }: Props) {
  const db = useDb();

  const currentUser = useAssertCurrentUser();
  const options = db.decisionOption.query({ message_id: message.id }).all;

  const decisionRequestsCount = message.tasks.query({ type: REQUEST_DECISION }).count;
  const allVotes = options.flatMap((option) => option.votes.all);
  const votesCastCount = allVotes.length;

  const [top1, top2] = orderBy(
    toPairs(groupBy(allVotes, (vote) => vote.decision_option_id)).map(([optionId, votes]) => ({
      optionId,
      votes: votes.length,
    })),
    "votes",
    "desc"
  );
  const highestVoteOptionId = top1 && top1.votes > (top2?.votes ?? 0) ? top1.optionId : null;
  const isComplete =
    decisionRequestsCount === votesCastCount || (message.is_first_completion_enough && votesCastCount >= 1);
  const winningOption = isComplete && highestVoteOptionId ? db.decisionOption.findById(highestVoteOptionId) : null;

  const currentUserVote = computed(() =>
    options.flatMap((options) => options.votes.query({ user_id: currentUser.id }).first).find(Boolean)
  ).get();
  const currentUserDecisionTask = message.tasks?.query({ user_id: currentUser.id, type: REQUEST_DECISION }).first;

  const canVote = currentUserDecisionTask && !message.topic?.isClosed;

  return (
    <UIHolder>
      <UIOptions>
        {options.map((option) => {
          const votes = option.votes.all;
          const isWinner = isComplete && option.id === highestVoteOptionId;
          const isUserChoice = Boolean(currentUserVote && currentUserVote.decision_option_id === option.id);
          return (
            <UIOption
              key={option.index}
              $highlight={isUserChoice}
              disabled={!canVote}
              onClick={action(() => {
                if (currentUserVote) {
                  currentUserVote.remove();
                }

                const didUserVote = !currentUserVote || !isUserChoice;
                if (didUserVote) {
                  db.decisionVote.create({ decision_option_id: option.id, user_id: currentUser.id });
                }
                currentUserDecisionTask?.update({ done_at: didUserVote ? new Date().toISOString() : null });
              })}
            >
              <CheckBox status={isWinner ? "full" : isUserChoice ? "partial" : canVote ? "empty" : "hidden"} />
              <div>
                <UIOptionText>{option.option}</UIOptionText>
                <UIOptionVotes>
                  {isUserChoice
                    ? "You" +
                      (votes.length < 2
                        ? ""
                        : ` and ${votes.length - 1} ${pluralize(votes.length - 1, "other", "others")} voted`)
                    : votes.length == 0
                    ? "No vote yet"
                    : votes.length + " votes"}
                </UIOptionVotes>
              </div>
              <UIAvatarList users={votes.map((vote) => vote.user).filter(isNotNullish)} maxVisibleCount={6} />
            </UIOption>
          );
        })}
        <AnimatePresence>
          {winningOption && (
            <FadePresenceAnimator>
              <UIWinner>
                <div>
                  <UIBold>
                    {message.is_first_completion_enough ? (
                      <UIBold>
                        {allVotes.length == 1 ? allVotes[0].user?.name : `${votesCastCount} participants`}
                      </UIBold>
                    ) : (
                      `${top1.votes} of ${votesCastCount} participants`
                    )}
                  </UIBold>{" "}
                  decided <UIBold>{winningOption.option}</UIBold>
                </div>
                <UICheck />
              </UIWinner>
            </FadePresenceAnimator>
          )}
        </AnimatePresence>
      </UIOptions>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  border: 1px solid ${theme.colors.layout.background.border};
  ${theme.radius.panel};
  margin-top: 15px;
  min-height: 60px;
  padding: 20px;
  max-width: 600px;
`;

const UIOptions = styled.div<{}>`
  display: flex;
  flex-direction: column;
  ${theme.spacing.actionsSection.asGap}
  width: 100%;
`;

const UIOption = styled.button<{ $highlight: boolean }>`
  border: 1px solid ${theme.colors.layout.background.border};
  ${(props) =>
    props.$highlight &&
    css`
      border-color: black;
    `}
  ${theme.radius.panel};
  padding: 10px;

  display: flex;
  flex-direction: row;
  align-items: center;

  color: ${theme.colors.text};
  background: none;
  text-align: start;

  &:not([disabled]) {
    cursor: pointer;
    &:hover {
      ${theme.colors.layout.background.hover.opacity(0.5).asBg};
    }
  }
`;

type CheckBoxStatus = "full" | "partial" | "empty" | "hidden";

const CHECK_BOX_STYLES: Partial<Record<CheckBoxStatus, ReturnType<typeof css>>> = {
  full: css`
    ${theme.colors.tags.decision.asBg};
    ${theme.colors.tags.decision.asStyle("borderColor")};
    stroke: white;

    & path {
      fill: white;
    }
  `,
  hidden: css`
    visibility: hidden;
  `,
};

const CheckBox = styled<{ status: CheckBoxStatus }>((props) => (
  <div {...props}>{props.status !== "empty" && <IconCheck />}</div>
))`
  border: 2px solid ${theme.colors.layout.background.border};
  ${theme.radius.circle};
  margin-right: 10px;
  padding: 5px;
  width: 28px;
  height: 28px;

  stroke: black;

  ${({ status }) => (status in CHECK_BOX_STYLES ? CHECK_BOX_STYLES[status] : null)}
`;

const UIOptionText = styled.div<{}>`
  ${theme.typo.content};
`;

const UIOptionVotes = styled.div<{}>`
  ${theme.typo.label.secondary};
`;

const UIAvatarList = styled(AvatarList)`
  margin-left: auto;
`;

const UIWinner = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const UIBold = styled.span<{}>`
  ${theme.font.semibold}
`;

const UICheck = styled<{}>((props) => (
  <div {...props}>
    <IconCheck />
  </div>
))`
  margin-left: 10px;
  padding: 3px;
  display: inline-block;
  ${theme.radius.circle};
  ${theme.colors.tags.decision.asBg};
  stroke: white;

  & svg {
    width: 12px;
    height: 12px;
  }

  & path {
    fill: white;
  }
`;
