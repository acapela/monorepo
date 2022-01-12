import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

import { useDb } from "@aca/frontend/clientdb";
import { useCurrentTeamContext } from "@aca/frontend/team/CurrentTeam";
import { ActionWithAlternative } from "@aca/frontend/ui/ButtonWithAlternative";
import { routes } from "@aca/shared/routes";
import { slugify } from "@aca/shared/slugify";
import { Button } from "@aca/ui/buttons/Button";
import { TextButton } from "@aca/ui/buttons/TextButton";
import { TextInput } from "@aca/ui/forms/TextInput";
import { addToast } from "@aca/ui/toasts/data";

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
        <Button
          onClick={handleCreateNewTeam}
          isWide
          kind="primary"
          isDisabled={name.trim().length < 3}
          shortcut={["Enter"]}
        >
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
