import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useDb } from "~frontend/clientdb";
import { useCurrentTeamContext } from "~frontend/team/CurrentTeam";
import { ActionWithAlternative } from "~frontend/ui/ButtonWithAlternative";
import { routes } from "~shared/routes";
import { slugify } from "~shared/slugify";
import { Button } from "~ui/buttons/Button";
import { TextButton } from "~ui/buttons/TextButton";
import { TextInput } from "~ui/forms/TextInput";
import { addToast } from "~ui/toasts/data";

export const CreateTeamView = observer(() => {
  const db = useDb();
  const teamManager = useCurrentTeamContext();
  const hasOtherTeams = db.team.hasItems;
  const router = useRouter();
  const [name, setName] = useState("");

  async function handleCreateNewTeam() {
    if (!name?.trim()) {
      return;
    }

    runInAction(async () => {
      const newTeam = db.team.create({ name, slug: await slugify(name) });

      try {
        await newTeam.waitForSync();
      } catch (error) {
        addToast({ title: "Creating team failed", type: "error" });
      }

      await teamManager.changeTeamId(newTeam.id);

      trackEvent("Account Created", { teamName: name });
      trackEvent("Trial Started", { teamName: name });

      router.push(routes.teamSlack);
    });
  }

  return (
    <UIHolder>
      <UITeams>
        <TextInput autoFocus placeholder="Team name..." value={name} onChangeText={setName} />
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
