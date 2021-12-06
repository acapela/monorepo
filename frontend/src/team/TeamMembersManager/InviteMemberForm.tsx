import { observer } from "mobx-react";
import { useState } from "react";
import styled from "styled-components";
import isEmail from "validator/lib/isEmail";

import { cachedComputed } from "~clientdb";
import { TeamEntity } from "~frontend/clientdb/team";
import { useInviteUser } from "~frontend/team/useInviteUser";
import { isNotNullish } from "~shared/nullish";
import { Button } from "~ui/buttons/Button";
import { TextInput } from "~ui/forms/TextInput";
import { IconPlusSquare } from "~ui/icons";
import { theme } from "~ui/theme";

interface Props {
  team: TeamEntity;
}

const getTeamEmails = cachedComputed((team: TeamEntity) => {
  return new Set(team.memberships.all.map((members) => members.user?.email).filter(isNotNullish));
});

export const InviteMemberForm = observer(({ team }: Props) => {
  const [inviteUser] = useInviteUser();
  const [error, setError] = useState<string | null>(null);

  const teamEmails = getTeamEmails(team);

  const [email, setEmail] = useState("");

  const isEmailValid = isEmail(email);

  const isAlreadyInvited = teamEmails.has(email);

  const handleSubmit = async () => {
    setError(null);

    if (isAlreadyInvited) {
      setError(`This user is already invited`);
      return;
    }

    try {
      await inviteUser({ variables: { input: { email, team_id: team.id } } });
      setEmail("");
    } catch (error) {
      setError(`Failed to invite user`);
    }
  };

  return (
    <UIHolder>
      {error && <UIError>{error}</UIError>}
      <TextInput placeholder="user@company.com" name="invite-email" value={email} onChangeText={setEmail} />
      <Button
        iconAtStart
        icon={<IconPlusSquare />}
        onClick={handleSubmit}
        isDisabled={!isEmailValid}
        shortcut={"Enter"}
      >
        Send invite
      </Button>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
`;

const UIError = styled.div`
  ${theme.colors.status.danger.asColor};
`;
