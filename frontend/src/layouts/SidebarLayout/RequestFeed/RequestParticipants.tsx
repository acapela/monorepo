import { observer } from "mobx-react";

import { TopicEntity } from "~frontend/clientdb/topic";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";

interface Props {
  topic: TopicEntity;
}

// TODO: Extend this component so that it shows multiple participants accordingly
export const RequestParticipants = observer(function RequestParticipants({ topic }: Props) {
  const participants = topic.participants.all;

  return (
    <span>
      {participants
        .filter((participant) => participant !== null)
        .map((participant) => (
          <UserAvatar key={participant.id} user={participant} size="small" />
        ))}
    </span>
  );
});
