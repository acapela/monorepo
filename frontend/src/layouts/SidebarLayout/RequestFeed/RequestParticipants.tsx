import { observer } from "mobx-react";
import styled, { css } from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { UserEntity } from "~frontend/clientdb/user";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { isClient } from "~shared/document";
import { theme } from "~ui/theme";

interface Props {
  topic: TopicEntity;
}

type AvatarLayoutDescription = [x: number, y: number];

type AvatarsLayoutDescription = {
  avatars: AvatarLayoutDescription[];
  avatarSize: number;
};

/**
 * Defines how to visually display avatars depending on count of participants
 */
const avatarLayoutByCount: Record<number, AvatarsLayoutDescription> = {
  // Show one, full size avatar
  1: { avatarSize: 1, avatars: [[0, 0]] },
  // Show smaller avatars on corners
  2: {
    avatarSize: 0.56,
    avatars: [
      // top left
      [0, 0],
      // bottom right
      [1, 1],
    ],
  },
  // Show triangle of avatars
  3: {
    avatarSize: 0.46,
    avatars: [
      // top left
      [0, 0],
      // top right
      [1, 0],
      // bottom center
      [0.5, 1],
    ],
  },
  // Show as square of 4 avatars
  4: {
    avatarSize: 0.46,
    avatars: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
  },
};

const MAX_PARTICIPANTS_TO_SHOW = 4;

function getParticipantsToShow(
  participants: UserEntity[]
): [participants: UserEntity[], notShownParticipants: UserEntity[]] {
  if (participants.length <= MAX_PARTICIPANTS_TO_SHOW) return [participants, []];

  const participantsToShow = participants.slice(0, MAX_PARTICIPANTS_TO_SHOW - 1);
  const participantsNotToShow = participants.slice(MAX_PARTICIPANTS_TO_SHOW - 1);

  return [participantsToShow, participantsNotToShow];
}

// TODO: Extend this component so that it shows multiple participants accordingly
export const RequestParticipants = observer(function RequestParticipants({ topic }: Props) {
  const participants = topic.participants.all;

  const [participantsToShow, notShownParticipants] = getParticipantsToShow(participants);

  const participantsCount = participantsToShow.length;
  const participantsLayoutCount = Math.min(participantsCount, MAX_PARTICIPANTS_TO_SHOW);

  if (isClient) Reflect.set(window, "topic", topic);

  if (!participants.length) {
    return null;
  }
  const layout = avatarLayoutByCount[participantsLayoutCount];

  const avatarSize = layout.avatarSize;

  return (
    <UIHolder>
      {participants.map((participant, index) => {
        const avatarLayout = layout.avatars[index];
        return (
          <UIAvatarHolder key={participant.id + index} avatarSize={avatarSize} layout={avatarLayout}>
            <UserAvatar user={participant} size="inherit" />
          </UIAvatarHolder>
        );
      })}
      {notShownParticipants.length > 0 && (
        <UIAvatarHolder avatarSize={avatarSize} layout={layout.avatars[layout.avatars.length - 1]}>
          <UIMoreIndicator>
            <span>{notShownParticipants.length}</span>
          </UIMoreIndicator>
        </UIAvatarHolder>
      )}
    </UIHolder>
  );
});

const PARTICIPANTS_BOX_SIZE = 30;

const UIHolder = styled.div`
  font-size: ${PARTICIPANTS_BOX_SIZE}px;
  height: 1em;
  width: 1em;
  position: relative;
`;

const UIAvatarHolder = styled.div<{ avatarSize: number; layout: AvatarLayoutDescription }>`
  font-size: ${(props) => PARTICIPANTS_BOX_SIZE * props.avatarSize}px;
  height: 1em;
  width: 1em;
  display: flex;
  position: absolute;
  ${(props) => {
    const {
      avatarSize,
      layout: [x, y],
    } = props;

    const maxMovement = 1 - avatarSize;
    const realX = x * maxMovement;
    const realY = y * maxMovement;

    return css`
      top: ${realY * PARTICIPANTS_BOX_SIZE}px;
      left: ${realX * PARTICIPANTS_BOX_SIZE}px;
    `;
  }}
`;

const UIMoreIndicator = styled.div`
  height: 1em;
  width: 1em;
  ${theme.borderRadius.circle};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.layout.softLine()};
  span {
    font-size: 0.7em;
    font-weight: bold;
  }
`;
