import React from "react";

import { UserEntity } from "~frontend/clientdb/user";
import { useInviteUser } from "~frontend/team/useInviteUser";
import { Button } from "~ui/buttons/Button";
import { addToast } from "~ui/toasts/data";

export const ResendInviteButton = ({ user, teamId }: { user: UserEntity; teamId: string }) => {
  const [inviteUser, { loading, called }] = useInviteUser();

  const handleClick = async () => {
    await inviteUser({ variables: { input: { email: user.email, team_id: teamId } } });
    addToast({ type: "success", title: `Team invitation was sent` });
  };

  return (
    <Button size="compact" onClick={handleClick} isLoading={loading} isDisabled={called}>
      Re-send invite
    </Button>
  );
};
