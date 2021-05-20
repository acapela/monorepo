import { Button } from "~ui/button";
import { useCreateSpaceMutation } from "~frontend/gql/spaces";
import { Toolbar } from "~frontend/ui/Toolbar";
import styled from "styled-components";
import { SpacesList } from "./SpacesList";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { slugify } from "~shared/slugify";

export function SpacesView() {
  const [createSpace] = useCreateSpaceMutation();
  const teamId = useAssertCurrentTeamId();

  async function handleCreate() {
    const name = window.prompt("Name of the space?");

    if (!name?.trim()) return;

    const slug = slugify(name);

    const { data: spaceCreationResult } = await createSpace({ name, teamId, slug });

    spaceCreationResult?.space;
  }

  return (
    <>
      <Toolbar>
        <Button onClick={handleCreate}>Create new space</Button>
      </Toolbar>
      <UISpaces>
        <SpacesList />
      </UISpaces>
    </>
  );
}

const UISpaces = styled.div`
  margin-top: 2rem;
`;
