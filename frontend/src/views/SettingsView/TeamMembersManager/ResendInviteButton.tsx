import { gql, useMutation } from "@apollo/client";
import React from "react";

import { ResendInvitationMutation, ResendInvitationMutationVariables } from "~gql";
import { Button } from "~ui/buttons/Button";
import { addToast } from "~ui/toasts/data";

interface Props {
  invitationId: string;
}

export const ResendInviteButton = ({ invitationId }: Props) => {
  const [resendInvitation, { loading }] = useMutation<ResendInvitationMutation, ResendInvitationMutationVariables>(
    gql`
      mutation ResendInvitation($invitation_id: ID!) {
        resend_invitation(invitation_id: $invitation_id) {
          sent_at
        }
      }
    `,
    {
      onCompleted() {
        addToast({ type: "success", title: `Team invitation was sent` });
      },
    }
  );

  const handleClick = () => {
    resendInvitation({ variables: { invitation_id: invitationId } });
  };

  return (
    <Button onClick={handleClick} isLoading={loading}>
      Re-send invite
    </Button>
  );
};
