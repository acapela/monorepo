import styled, { css } from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UserBasicInfoFragment } from "~frontend/gql";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { handleWithStopPropagation } from "~shared/events";
import { Button } from "~ui/button";
import { IconPlusSquare } from "~ui/icons";
import { UserPickerModal } from "./UserPickerModal";

interface Props {
  users: UserBasicInfoFragment[];
  onAddMemberRequest: (userId: string) => Promise<void> | void;
  onLeaveRequest: () => Promise<void> | void;
}

export function MembersManager({ users, onLeaveRequest, onAddMemberRequest }: Props) {
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
      <UIHolder>
        <UIMembers>
          <AvatarList
            users={users}
            css={css`
              margin-right: 0.5rem;
            `}
          />
          <Button onClick={handleWithStopPropagation(openUserPicker)}>
            <IconPlusSquare />
          </Button>
        </UIMembers>

        <UIActions>
          {canLeave && <Button onClick={handleWithStopPropagation(onLeaveRequest)}>Leave</Button>}
          {canJoin && <Button onClick={handleWithStopPropagation(handleJoin)}>Join</Button>}
        </UIActions>
      </UIHolder>
    </>
  );
}

const UIHolder = styled.div`
  display: flex;
  justify-content: space-between;
`;

const UIMembers = styled.div`
  display: flex;
`;

const UIActions = styled.div``;
