import styled from "styled-components";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { routes } from "~frontend/routes";
import { ManageSpaceModal } from "~frontend/ui/spaces/ManageSpaceModal";
import { Toolbar } from "~frontend/ui/Toolbar";
import { Button } from "~ui/button";
import { Container } from "~ui/layout/Container";
import { SpacesList } from "./SpacesList";

export function SpacesView() {
  const teamId = useAssertCurrentTeamId();
  const [isCreatingSpace, { set: openCreateSpaceModal, unset: closeCreateSpaceModal }] = useBoolean(false);

  return (
    <>
      {isCreatingSpace && (
        <ManageSpaceModal
          teamId={teamId}
          onCloseRequest={closeCreateSpaceModal}
          onCreated={(spaceId: string) => routes.space.push({ spaceId })}
        />
      )}
      <Container>
        <Toolbar>
          <Button onClick={openCreateSpaceModal}>Create new space</Button>
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
