import React from "react";
import styled from "styled-components";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { createSpace } from "~frontend/gql/spaces";
import { SpaceGradientIcon } from "~frontend/ui/spaces/spaceGradient";
import { openUIPrompt } from "~frontend/utils/prompt";
import { SpacePickerQuery, SpacePickerQueryVariables } from "~gql";
import { SingleOptionDropdown } from "~ui/forms/OptionsDropdown/single";
import { IconSelection } from "~ui/icons";
import { createQuery } from "~frontend/gql/utils";
import { gql } from "@apollo/client";

interface Props {
  selectedSpaceId: string | null;
  onChange: (spaceId: string) => void;
}

const [useSpacePickerQuery] = createQuery<SpacePickerQuery, SpacePickerQueryVariables>(
  () => gql`
    query SpacePicker($teamId: uuid) {
      spaces: space(where: { team_id: { _eq: $teamId } }) {
        id
        name
      }
    }
  `
);

export const SpacePicker = ({ selectedSpaceId, onChange }: Props) => {
  const teamId = useAssertCurrentTeamId();
  const [spaces = []] = useSpacePickerQuery({ teamId });

  const selectedSpace = spaces.find((space) => space.id === selectedSpaceId);

  async function handleCreateNewSpace() {
    const spaceName = await openUIPrompt({
      title: "New space name",
      placeholder: "Space name...",
      validateInput: createLengthValidator("Space name", 3),
      submitLabel: "Create new space",
    });

    if (!spaceName) return;

    const [newSpace] = await createSpace({ input: { name: spaceName, team_id: teamId } });

    if (!newSpace) return;

    onChange(newSpace.id);
  }

  return (
    <SingleOptionDropdown<typeof spaces[0]>
      icon={<IconSelection />}
      name="Space"
      placeholder="Select a space..."
      items={spaces}
      selectedItem={selectedSpace}
      onChange={(space) => {
        onChange(space.id);
      }}
      keyGetter={(space) => space.id}
      labelGetter={(space) => space.name}
      iconGetter={(space) => <SpaceDropdownIcon spaceId={space.id} />}
      newItem={{
        label: "Create new space...",
        onCreateRequest: handleCreateNewSpace,
      }}
    />
  );
};

const SpaceDropdownIcon = styled(SpaceGradientIcon)<{}>`
  font-size: 24px;
`;
