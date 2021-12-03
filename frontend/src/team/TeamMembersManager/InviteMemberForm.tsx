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

interface Props {
  team: TeamEntity;
}

const getTeamEmails = cachedComputed((team: TeamEntity) => {
  return new Set(team.memberships.all.map((members) => members.user?.email).filter(isNotNullish));
});

export const InviteMemberForm = observer(({ team }: Props) => {
  const [inviteUser] = useInviteUser();

  const teamEmails = getTeamEmails(team);

  const [email, setEmail] = useState("");

  const isEmailValid = isEmail(email);

  const isAlreadyInvited = teamEmails.has(email);

  const handleSubmit = () => {
    if (isAlreadyInvited) {
      alert(`This user is already invited`);
    }

    inviteUser({ variables: { input: { email, team_id: team.id } } });
    setEmail("");
  };

  return (
    <UIHolder>
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
