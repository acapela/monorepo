import styled from "styled-components";
import { slugify } from "~frontend/../../shared/slugify";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { useCreateSpaceMutation } from "~frontend/gql/spaces";
import { routes } from "~frontend/routes";
import { Toolbar } from "~frontend/ui/Toolbar";
import { openUIPrompt } from "~frontend/utils/prompt";
import { Button } from "~ui/button";
import { Container } from "~ui/layout/Container";
import { SpacesList } from "./SpacesList";

export function SpacesView() {
  const teamId = useAssertCurrentTeamId();
  const [createSpace] = useCreateSpaceMutation();

  async function handleCreateSpace() {
    const spaceName = await openUIPrompt({
      title: "New space name",
      placeholder: "Design team",
      submitLabel: "Create space",
    });

    if (!spaceName?.trim()) return;

    const result = await createSpace({ name: spaceName, teamId, slug: slugify(spaceName) });

    const spaceId = result.data?.space?.id;

    if (!spaceId) {
      return;
    }

    routes.space.push({ spaceId });
  }

  return (
    <>
      <Container>
        <Toolbar>
          <Button onClick={handleCreateSpace}>Create new space</Button>
        </Toolbar>
        <UISpaces>
          <SpacesList />
        </UISpaces>
      </Container>
    </>
  );
}

const UISpaces = styled.div`
  margin-top: 2rem;
`;
