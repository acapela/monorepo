import styled from "styled-components";
import { Button } from "~ui/buttons/Button";
import { useAcceptInviteMutation } from "~frontend/gql/invitations";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { LoginOptionsView } from "../LoginOptionsView";

interface Props {
  code: string;
}

export function TeamInvitationView({ code }: Props) {
  const user = useCurrentUser();
  const [acceptInvite] = useAcceptInvite(code);
  return (
    <UIHolder>
      You have been invited to join the team.
      <div>
        {!user && <LoginOptionsView />}
        {user && <Button onClick={acceptInvite}>Accept</Button>}
      </div>
    </UIHolder>
  );
}

const useAcceptInvite = (token: string) => {
  const [acceptInvite, { loading, error }] = useAcceptInviteMutation();

  async function handleAcceptInvite() {
    await acceptInvite({ token });

    // perform full reload returning back to homepage
    location.pathname = "";
  }

  return [handleAcceptInvite, { loading, error }] as const;
};

const UIHolder = styled.div``;
