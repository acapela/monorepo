import styled from "styled-components";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { useCreateSpaceMutation } from "~frontend/gql/spaces";
import { routes } from "~frontend/routes";
import { openUIPrompt } from "~frontend/utils/prompt";
import { Button } from "~ui/buttons/Button";
import { SpacesList } from "./SpacesList";
import { useRef } from "react";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { IconPlusSquare, IconSelection } from "~ui/icons";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { PageHeader } from "~frontend/layouts/AppLayout/PageHeader";

export function SpacesView() {
  const teamId = useAssertCurrentTeamId();
  const [createSpace] = useCreateSpaceMutation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  async function handleCreateSpace() {
    const spaceName = await openUIPrompt({
      title: "New space name",
      placeholder: "eg. Design team",
      inputIcon: <IconSelection />,
      submitLabel: "Create space",
      anchor: {
        ref: buttonRef,
        placement: "bottom-start",
      },
      validateInput: createLengthValidator("Space name", 3),
    });

    if (!spaceName?.trim()) return;

    const [space] = await createSpace({ input: { name: spaceName, team_id: teamId } });

    const spaceId = space?.id;

    if (!spaceId) {
      return;
    }

    routes.space.push({ spaceId });
  }

  return (
    <>
      <SpacedAppLayoutContainer>
        <PageHeader
          title="Spaces"
          actions={
            <Button ref={buttonRef} onClick={handleCreateSpace} icon={<IconPlusSquare />}>
              Create new space
            </Button>
          }
        />
        <UISpaces>
          <SpacesList />
        </UISpaces>
      </SpacedAppLayoutContainer>
    </>
  );
}

const UISpaces = styled.div``;
