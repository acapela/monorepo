import { observer } from "mobx-react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import isEmail from "validator/lib/isEmail";

import { TeamEntity } from "~frontend/clientdb/team";
import { useInviteUser } from "~frontend/team/useInviteUser";
import { isNotNullish } from "~shared/nullish";
import { Button } from "~ui/buttons/Button";
import { TextInput } from "~ui/forms/TextInput";
import { IconPlusSquare } from "~ui/icons";

interface Props {
  team: TeamEntity;
}

export const InviteMemberForm = observer(({ team }: Props) => {
  const [inviteUser] = useInviteUser();

  const teamEmails = useMemo(
    () => new Set(team.members.all.map((members) => members.user?.email).filter(isNotNullish)),
    [team]
  );

  const [email, setEmail] = useState("");

  const isEmailAcceptable = isEmail(email) && !teamEmails.has(email);

  const handleSubmit = () => {
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
        isDisabled={!isEmailAcceptable}
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
