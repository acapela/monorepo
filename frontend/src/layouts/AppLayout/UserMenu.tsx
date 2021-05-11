import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { Avatar } from "~frontend/design/Avatar";

export function UserMenu() {
  const { user } = useCurrentUser();
  return (
    <UIHolder>
      <Avatar url={user?.picture} />
    </UIHolder>
  );
}

const UIHolder = styled.div``;
