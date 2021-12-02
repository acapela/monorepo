import { action } from "mobx";
import { observer } from "mobx-react";
import styled from "styled-components";

import { useCurrentTeam } from "~frontend/team/CurrentTeam";
import { openUIPrompt } from "~frontend/utils/prompt";
import { Button } from "~ui/buttons/Button";
import { addToast } from "~ui/toasts/data";

import { Panel } from "./ui";

export const TeamSettings = observer(() => {
  const team = useCurrentTeam();
  return (
    <Panel title="Danger Zone">
      <UIButtons>
        <Button
          isWide
          onClick={action(async () => {
            const name = await openUIPrompt({
              title: "Rename team",
              description: "Enter a new name for this team:",
            });
            if (name) {
              team?.update({ name });
              addToast({ type: "success", title: "Your team has been renamed" });
            }
          })}
        >
          Rename Team
        </Button>
        <Button
          isWide
          onClick={async () => {
            const shouldDelete = !!(await openUIPrompt({
              title: "Delete team",
              description: "This action can NOT be undone. If you are sure, enter you team's name:",
              validateInput: (input) => (team?.name == input ? true : "This is not your team's name"),
              submitLabel: "Permanently delete this team",
            }));
            if (shouldDelete) {
              team?.remove();
            }
          }}
        >
          Delete Team
        </Button>
      </UIButtons>
    </Panel>
  );
});

const UIButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
