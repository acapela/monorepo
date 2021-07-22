import styled from "styled-components";
import { SpaceDetailedInfoFragment } from "~frontend/../../gql";
import { PopoverMenuTrigger } from "~frontend/../../ui/popovers/PopoverMenuTrigger";
import { useSpaceManager } from "~frontend/../pages/space/useSpaceManager";
import { JoinToggleButton } from "~frontend/ui/buttons/JoinToggleButton";
import { CircleOptionsButton, OptionsButton } from "~frontend/ui/options/OptionsButton";

interface Props {
  space: SpaceDetailedInfoFragment;
}

export function SpaceTools({ space }: Props) {
  const { isCurrentUserMember, join, leave } = useSpaceManager(space);
  return (
    <UIHolder>
      <JoinToggleButton isMember={isCurrentUserMember} onJoin={join} onLeave={leave} />
      <PopoverMenuTrigger options={[]}>
        <CircleOptionsButton />
      </PopoverMenuTrigger>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
