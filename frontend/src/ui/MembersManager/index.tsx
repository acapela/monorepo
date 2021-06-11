import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UserBasicInfoFragment } from "~frontend/gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { handleWithStopPropagation } from "~shared/events";
import { TransparentButton } from "~ui/buttons/TransparentButton";
import { UserPickerModal } from "./UserPickerModal";

interface Props {
  users: UserBasicInfoFragment[];
  onAddMemberRequest: (userId: string) => Promise<void> | void;
  onLeaveRequest: (userId: string) => Promise<void> | void;
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

  return (
    <>
      <AnimatePresence>
        {isPickingUser && (
          <UserPickerModal
            currentUsers={users}
            onCloseRequest={closeUserPicker}
            onAddUser={onAddMemberRequest}
            onRemoveUser={onLeaveRequest}
          />
        )}
      </AnimatePresence>
      <UIHolder className={className}>
        <UIMembers>
          {users.length > 0 && <AvatarList users={users} />}
          <TransparentButton onClick={handleWithStopPropagation(openUserPicker)}>Manage</TransparentButton>
        </UIMembers>

        <UIActions>
          {user && isMember && (
            <TransparentButton onClick={handleWithStopPropagation(() => onLeaveRequest(user.id))}>
              Leave
            </TransparentButton>
          )}
          {user && !isMember && (
            <TransparentButton onClick={handleWithStopPropagation(() => onAddMemberRequest(user.id))}>
              Join
            </TransparentButton>
          )}
        </UIActions>
      </UIHolder>
    </>
  );
})``;

const UIHolder = styled.div`
  margin-top: 4px;
  display: flex;
  align-items: center;
  width: 100%;
`;

const UIMembers = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px;
  align-items: center;
`;

const UIActions = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;
