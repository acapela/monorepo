import { useRef } from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useCreateSpaceMutation } from "~frontend/gql/spaces";
import { PageHeader } from "~frontend/layouts/AppLayout/PageHeader";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { routes } from "~frontend/router";
import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { openUIPrompt } from "~frontend/utils/prompt";
import { getUUID } from "~shared/uuid";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { Button } from "~ui/buttons/Button";
import { IconPlusSquare, IconSelection } from "~ui/icons";

import { SpacesList } from "./SpacesList";

export function SpacesView() {
  const teamId = useAssertCurrentTeamId();
  const [createSpace] = useCreateSpaceMutation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  async function handleCreateSpace() {
    const spaceId = getUUID();
    routes.space.prefetch({ spaceId });
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

    createSpace({ input: { name: spaceName, team_id: teamId, id: spaceId } });

    routes.space.push({ spaceId });
    trackEvent("Created Space", { spaceName });
  }

  return (
    <>
      <SpacedAppLayoutContainer>
        <PageHeader
          title="Spaces"
          actionsNode={
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

const UISpaces = styled.div<{}>``;
