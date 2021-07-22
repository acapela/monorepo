import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UserBasicInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { handleWithStopPropagation } from "~shared/events";
import { Button } from "~ui/buttons/Button";
import { ToggleButton } from "~ui/buttons/ToggleButton";
import { IconLogIn, IconCheck } from "~ui/icons";
import { UserPickerModal } from "./UserPickerModal";

interface Props {
  users: UserBasicInfoFragment[];
  onAddMemberRequest: (userId: string) => Promise<void> | void;
  onRemoveMemberRequest: (userId: string) => Promise<void> | void;
  className?: string;
  isReadonly?: boolean;
}

export const MembersManager = styled(function MembersManager({
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
          <UserPickerModal
            currentUsers={users}
            onCloseRequest={closeUserPicker}
            onAddUser={onAddMemberRequest}
            onRemoveUser={onRemoveMemberRequest}
          />
        )}
      </AnimatePresence>
      <UIHolder className={className}>
        <UIMembers>
          {users.length > 0 && <AvatarList users={users} />}
          {!isReadonly && (
            // TODO: Move this to the "edit entity" menu
            <Button kind="secondary" onClick={handleWithStopPropagation(openUserPicker)}>
              Manage
            </Button>
          )}
        </UIMembers>
        <UIActions>
          {user && (
            <ToggleButton
              onClick={handleWithStopPropagation(() =>
                isMember ? onRemoveMemberRequest(user.id) : onAddMemberRequest(user.id)
              )}
              isActive={isMember}
              icon={isMember ? <IconCheck /> : <IconLogIn />}
            >
              {isMember ? "Joined" : "Join"}
            </ToggleButton>
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
