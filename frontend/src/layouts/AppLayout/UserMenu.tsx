import styled from "styled-components";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { Avatar } from "~frontend/ui/Avatar";

export function UserMenu() {
  return null;
  const user = useAssertCurrentUser();

  return (
    <UIHolder>
      <Avatar url={user.picture} name={user.name ?? undefined} />
    </UIHolder>
  );
}

const UIHolder = styled.div``;
