import styled from "styled-components";
import { SpaceDetailedInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { useSpaceManager } from "~frontend/pages/space/useSpaceManager";
import { JoinToggleButton } from "~frontend/ui/buttons/JoinToggleButton";
import { UserPickerModal } from "~frontend/ui/MembersManager/UserPickerModal";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";

interface Props {
  space: SpaceDetailedInfoFragment;
}

export function SpaceTools({ space }: Props) {
  const { isCurrentUserMember, join, leave, addMember, removeMember, members, editNameWithModal, remove } =
    useSpaceManager(space);
  const [isPickingUser, { set: openUsersManager, unset: closeUsersManager }] = useBoolean(false);

  return (
    <>
      {isPickingUser && (
        <UserPickerModal
          currentUsers={members}
          onCloseRequest={closeUsersManager}
          onAddUser={addMember}
          onRemoveUser={removeMember}
        />
      )}
      <UIHolder>
        <JoinToggleButton isMember={isCurrentUserMember} onJoin={join} onLeave={leave} />
        <PopoverMenuTrigger
          options={[
            { label: "Manage team members", onSelect: openUsersManager },
            { label: "Rename space...", onSelect: editNameWithModal },
            { label: "Delete space...", onSelect: remove, isDestructive: true },
          ]}
        >
          <CircleOptionsButton />
        </PopoverMenuTrigger>
      </UIHolder>
    </>
  );
}

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
