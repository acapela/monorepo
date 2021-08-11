import React from "react";
import { useResendInvitation } from "~frontend/gql/teams";
import { Button } from "~ui/buttons/Button";

interface Props {
  invitationId: string;
}

export const ResendInviteButton = ({ invitationId }: Props) => {
  const [resendInvitation, { loading }] = useResendInvitation();

  const handleClick = () => {
    resendInvitation({ invitation_id: invitationId });
  };

  return (
    <Button onClick={handleClick} isLoading={loading} size="small">
      Re-send invite
    </Button>
  );
};
