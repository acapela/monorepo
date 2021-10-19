import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

import { Button } from "~frontend/../../ui/buttons/Button";
import { TextButton } from "~frontend/../../ui/buttons/TextButton";
import { TextInput } from "~frontend/../../ui/forms/TextInput";
import { theme } from "~frontend/../../ui/theme";
import { trackEvent } from "~frontend/analytics/tracking";
import { useDb } from "~frontend/clientdb";
import { useCurrentTeamContext } from "~frontend/team/CurrentTeam";
import { ActionWithAlternative } from "~frontend/ui/ButtonWithAlternative";
import { routes } from "~shared/routes";
import { slugify } from "~shared/slugify";

export const CreateTeamView = observer(() => {
  const db = useDb();
  const teamManaer = useCurrentTeamContext();
  const hasOtherTeams = db.team.all.length > 0;
  const router = useRouter();
  const [name, setName] = useState("");

  async function handleCreateNewTeam() {
    if (!name?.trim()) {
      return;
    }

    runInAction(async () => {
      const newTeam = db.team.create({ name, slug: slugify(name) });

      await newTeam.waitForSync();

      await teamManaer.changeTeamId(newTeam.id);

      trackEvent("Account Created", { teamName: name });
      trackEvent("Trial Started", { teamName: name });

      router.push(routes.teamSlack);
    });
  }

  return (
    <UIHolder>
      <UITeams>
        <TextInput placeholder="Team name..." value={name} onChangeText={setName} />
      </UITeams>
      <ActionWithAlternative
        alternative={
          hasOtherTeams && (
            <TextButton
              onClick={() => {
                router.push(routes.teamSelect);
              }}
            >
              Select existing team instead
            </TextButton>
          )
        }
      >
        <Button onClick={handleCreateNewTeam} isWide kind="primary" isDisabled={name.trim().length < 3}>
          Create new team
        </Button>
      </ActionWithAlternative>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>``;

const UITeams = styled.div<{}>`
  margin-bottom: 30px;
`;

const UITeam = styled.div<{}>`
  display: flex;
  align-items: center;
  ${theme.spacing.horizontalActions.asGap}
`;

const UITeamInfo = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  ${theme.spacing.close.asGap}
`;

const UITeamName = styled.div`
  ${theme.typo.item.title};
`;

const UITeamMeta = styled.div`
  ${theme.typo.content.secondary};
`;
