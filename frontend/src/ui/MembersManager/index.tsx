import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UserBasicInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { handleWithStopPropagation } from "~shared/events";
import { IconPlus } from "~ui/icons";
import { MembersManagerModal } from "./MembersManagerModal";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { JoinToggleButton } from "~frontend/ui/buttons/JoinToggleButton";

interface Props {
  title: string;
  users: UserBasicInfoFragment[];
  onAddMemberRequest: (userId: string) => Promise<void> | void;
  onRemoveMemberRequest: (userId: string) => Promise<void> | void;
  className?: string;
  isReadonly?: boolean;
}

export const MembersManager = styled(function MembersManager({
  title,
  users,
  onRemoveMemberRequest,
  onAddMemberRequest,
  className,
  isReadonly,
}: Props) {
  const [isPickingUser, { set: openUserPicker, unset: closeUserPicker }] = useBoolean(false);
  const user = useCurrentUser();

  const isMember = users.some((memberUser) => memberUser.id === user?.id);

  return (
    <>
      <AnimatePresence>
        {isPickingUser && (
          <MembersManagerModal
            title={title}
            currentUsers={users}
            onCloseRequest={closeUserPicker}
            onAddUser={onAddMemberRequest}
            onRemoveUser={onRemoveMemberRequest}
          />
        )}
      </AnimatePresence>
      <UIHolder className={className}>
        <UIMembers onClick={handleWithStopPropagation(openUserPicker)}>
          {users.length > 0 && <AvatarList users={users} size="inherit" />}
          {!isReadonly && (
            <CircleIconButton
              kind="primary"
              onClick={handleWithStopPropagation(openUserPicker)}
              icon={<IconPlus />}
              size="inherit"
              tooltip="Manage members"
            />
          )}
        </UIMembers>
        <UIActions>
          {user && (
            <JoinToggleButton
              isMember={isMember}
              onJoin={() => onAddMemberRequest(user.id)}
              onLeave={() => onRemoveMemberRequest(user.id)}
            />
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
  font-size: 24px;
  cursor: pointer;
`;

const UIActions = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;
