import { gql, useApolloClient } from "@apollo/client";
import React, { useState } from "react";

import { getDb } from "@aca/desktop/clientdb";
import { authStore } from "@aca/desktop/store/authStore";
import { ChangeCurrentTeamIdMutation, ChangeCurrentTeamIdMutationVariables } from "@aca/gql";
import { slugify } from "@aca/shared/slugify";
import { Button } from "@aca/ui/buttons/Button";
import { TextInput } from "@aca/ui/forms/TextInput";

export function CreateTeamForm() {
  const [name, setName] = useState("");
  const apollo = useApolloClient();
  const db = getDb();
  const currentUser = authStore.user;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        (async () => {
          const team = db.team.create({ name, slug: await slugify(name) });
          await team.waitForSync();
          await apollo.mutate<ChangeCurrentTeamIdMutation, ChangeCurrentTeamIdMutationVariables>({
            variables: { userId: currentUser.id, teamId: team.id },
            mutation: gql`
              mutation ChangeCurrentTeamId($userId: uuid!, $teamId: uuid) {
                update_user_by_pk(pk_columns: { id: $userId }, _set: { current_team_id: $teamId }) {
                  id
                }
              }
            `,
          });
        })();
      }}
      style={{ display: "flex", flexDirection: "row" }}
    >
      <TextInput placeholder="Team Name" value={name} onChange={(event) => setName(event.target.value)} />
      <Button disabled={!name.trim()}>Create Team</Button>
    </form>
  );
}
