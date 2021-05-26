import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UserBasicInfoFragment } from "~frontend/gql";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { handleWithStopPropagation } from "~shared/events";
import { TransparentButton } from "~ui/button";
import { IconPlusCircle } from "~ui/icons";
import { UserPickerModal } from "./UserPickerModal";

interface Props {
  users: UserBasicInfoFragment[];
  onAddMemberRequest: (userId: string) => Promise<void> | void;
  onLeaveRequest: () => Promise<void> | void;
  className?: string;
}

export const MembersManager = styled(function MembersManager({
  users,
  onLeaveRequest,
  onAddMemberRequest,
  className,
}: Props) {
  const [isPickingUser, { set: openUserPicker, unset: closeUserPicker }] = useBoolean(false);
  const user = useCurrentUser();

  const isMember = users.some((memberUser) => memberUser.id === user?.id);

  const canJoin = !!user && !isMember;
  const canLeave = !!user && isMember;

  async function handleJoin() {
    if (!user) return;

    await onAddMemberRequest(user.id);
  }

  return (
    <>
      {isPickingUser && (
        <UserPickerModal
          currentUsers={users}
          currentUserLabel="Joined"
          onCloseRequest={closeUserPicker}
          onUserSelected={(selectedUser) => {
            onAddMemberRequest(selectedUser.id);
          }}
        />
      )}
      <UIHolder className={className}>
        <UIMembers>
          {users.length > 0 && <AvatarList users={users} />}
          <UIAddIcon onClick={handleWithStopPropagation(openUserPicker)} />
        </UIMembers>

        <UIActions>
          {canLeave && <TransparentButton onClick={handleWithStopPropagation(onLeaveRequest)}>Leave</TransparentButton>}
          {canJoin && <TransparentButton onClick={handleWithStopPropagation(handleJoin)}>Join</TransparentButton>}
        </UIActions>
      </UIHolder>
    </>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const UIMembers = styled.div`
  display: flex;

  ${AvatarList} {
    margin-right: 0.5rem;
  }
`;

const UIActions = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const UIAddIcon = styled(IconPlusCircle)`
  font-size: 2rem;
`;
