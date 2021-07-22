import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { UserBasicInfoFragment } from "~gql";
import { handleWithStopPropagation } from "~shared/events";
import { ToggleButton } from "~ui/buttons/ToggleButton";
import { IconCheck, IconLogIn } from "~ui/icons";

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
}: Props) {
  const user = useCurrentUser();

  const isMember = users.some((memberUser) => memberUser.id === user?.id);

  return (
    <>
      <UIHolder className={className}>
        <UIMembers>{users.length > 0 && <AvatarList users={users} />}</UIMembers>
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
