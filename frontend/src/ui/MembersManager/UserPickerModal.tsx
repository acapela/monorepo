import { useMemo } from "react";
import styled from "styled-components";
import { useCurrentTeamMembers } from "~frontend/gql/user";
import { UserBasicInfoFragment } from "~gql";
import { UsersCombobox } from "./UsersCombobox";
import { MembersContainer } from "./MembersContainer";
import { MemberItem } from "./MemberItem";
import { MembersManagerContainer } from "./MembersManagerContainer";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { POP_PRESENCE_STYLES } from "~ui/animations";
import { ScreenCover } from "~frontend/ui/Modal/ScreenCover";

interface Props {
  title: string;
  currentUsers: UserBasicInfoFragment[];
  onCloseRequest: () => void;
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
}

export function UserPickerModal({ currentUsers, onCloseRequest, onAddUser, onRemoveUser, title }: Props) {
  const teamMembers = useCurrentTeamMembers();

  const potentialUsers = useMemo(() => {
    const currentUsersIdsSet = new Set<string>(currentUsers.map(({ id }) => id));
    return teamMembers.filter(({ id }) => !currentUsersIdsSet.has(id));
  }, [teamMembers, currentUsers]);

  return (
    <ScreenCover isTransparent={false} onCloseRequest={onCloseRequest}>
      <PresenceAnimator presenceStyles={POP_PRESENCE_STYLES}>
        <MembersManagerContainer title={title} onClose={onCloseRequest}>
          <UIHolder>
            <UsersCombobox users={potentialUsers} onSelect={onAddUser} />
            {currentUsers.length > 0 && (
              <MembersContainer>
                {currentUsers.map((user) => (
                  <MemberItem key={user.id} user={user} onRemove={() => onRemoveUser(user.id)} />
                ))}
              </MembersContainer>
            )}
          </UIHolder>
        </MembersManagerContainer>
      </PresenceAnimator>
    </ScreenCover>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 20px;
`;
