import { handleWithStopPropagation } from "~shared/events";
import { ToggleButton } from "~ui/buttons/ToggleButton";
import { IconCheck, IconLogIn } from "~ui/icons";

interface Props {
  isMember: boolean;
  onJoin: () => void;
  onLeave: () => void;
}

export function JoinToggleButton({ isMember, onJoin, onLeave }: Props) {
  return (
    <ToggleButton
      onClick={handleWithStopPropagation(() => (isMember ? onLeave() : onJoin()))}
      isActive={isMember}
      icon={isMember ? <IconCheck /> : <IconLogIn />}
    >
      {isMember ? "Joined" : "Join"}
    </ToggleButton>
  );
}
