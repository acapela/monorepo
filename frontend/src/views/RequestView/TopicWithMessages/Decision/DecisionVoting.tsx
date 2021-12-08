import { groupBy, maxBy, toPairs } from "lodash";
import { observer } from "mobx-react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { MessageEntity } from "~frontend/clientdb/message";
import { UserEntity } from "~frontend/clientdb/user";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { REQUEST_DECISION } from "~shared/types/mention";
import { TextInput, TextInputProps } from "~ui/forms/TextInput";
import { IconCheck } from "~ui/icons";
import { theme } from "~ui/theme";

interface Props {
  message: MessageEntity;
}

export const DecisionVoting = observer(function DecisionVoting({ message }: Props) {
  const db = useDb();

  const options = db.decisionOption.query({ message_id: message.id }).all;

  const amountOfDecisionRequests = message.tasks.query({ type: REQUEST_DECISION }).count;
  const allVotes = options.flatMap((option) => option.votes.all);
  const amountOfVotesCast = allVotes.length;

  const highestVoteOption = maxBy(toPairs(groupBy(allVotes, (vote) => vote.decision_option_id)), "1")?.[0];
  const isComplete = amountOfDecisionRequests === amountOfVotesCast;

  return (
    <UIHolder>
      <UIOptions>
        {options.map((option) => {
          const votingUsers: UserEntity[] = option.votes.all
            .filter((vote) => vote?.user)
            .map((vote) => vote.user) as UserEntity[];

          const isWinner = isComplete && option.id === highestVoteOption;

          return (
            <UIOption key={option.index}>
              <UIOptionValue value={option.option} disabled icon={isWinner ? <IconCheck /> : undefined} />
              <AvatarList users={votingUsers} maxVisibleCount={2} />
            </UIOption>
          );
        })}
      </UIOptions>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  background-color: ${theme.colors.tags.decision.opacity(0.1)};
  min-height: 60px;
  padding: 20px;
  max-width: 300px;
`;

const UIOptions = styled.div<{}>`
  display: flex;
  flex-direction: column;
  ${theme.spacing.actionsSection.asGap}
  width: 100%;
`;

const UIOption = styled.div<{}>`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 2fr 1fr;

  align-items: center;
  width: 100%;
`;

const UIOptionValue = styled<TextInputProps>(TextInput)``;
