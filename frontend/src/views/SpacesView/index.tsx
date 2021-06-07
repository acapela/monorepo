import styled from "styled-components";
import { slugify } from "~shared/slugify";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { useCreateSpaceMutation } from "~frontend/gql/spaces";
import { routes } from "~frontend/routes";
import { Toolbar } from "~frontend/ui/Toolbar";
import { openUIPrompt } from "~frontend/utils/prompt";
import { Button } from "~ui/buttons/Button";
import { Container } from "~ui/layout/Container";
import { SpacesList } from "./SpacesList";
import { useRef } from "react";
import { createLengthValidator } from "~shared/validation/inputValidation";

export function SpacesView() {
  const teamId = useAssertCurrentTeamId();
  const [createSpace] = useCreateSpaceMutation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  async function handleCreateSpace() {
    const spaceName = await openUIPrompt({
      title: "New space name",
      placeholder: "eg. Design team",
      submitLabel: "Create space",
      anchor: {
        ref: buttonRef,
        placement: "bottom-start",
      },
      validateInput: createLengthValidator("Space name", 3),
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
          <Button ref={buttonRef} onClick={handleCreateSpace}>
            Create new space
          </Button>
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
