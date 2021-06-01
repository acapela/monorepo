import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { LoginOptionsView } from "../LoginOptionsView";

export function TeamInvitationView() {
  const user = useCurrentUser();

  return (
    <UIHolder>
      {!user && (
        <>
          You have been invited to join the team.
          <div>{!user && <LoginOptionsView />}</div>
        </>
      )}
    </UIHolder>
  );
}

const UIHolder = styled.div``;
