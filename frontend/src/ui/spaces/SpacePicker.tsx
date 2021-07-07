import React from "react";
import styled from "styled-components";
import { slugify } from "~shared/slugify";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { createSpace, useCurrentTeamSpaces } from "~frontend/gql/spaces";
import { SpaceGradientIcon } from "~frontend/ui/spaces/spaceGradient";
import { openUIPrompt } from "~frontend/utils/prompt";
import { SpaceBasicInfoFragment } from "~gql";
import { SingleOptionDropdown } from "~ui/forms/OptionsDropdown/single";
import { IconSelection } from "~frontend/../../ui/icons";

interface Props {
  selectedSpaceId: string | null;
  onChange: (spaceId: string) => void;
}

export const SpacePicker = ({ selectedSpaceId, onChange }: Props) => {
  const [spacesList = []] = useCurrentTeamSpaces();
  const teamId = useAssertCurrentTeamId();

  const selectedSpace = spacesList.find((space) => space.id === selectedSpaceId);

  async function handleCreateNewSpace() {
    const spaceName = await openUIPrompt({
      title: "New space name",
      placeholder: "Space name...",
      validateInput: createLengthValidator("Space name", 3),
      submitLabel: "Create new space",
    });

    if (!spaceName) return;

    const [newSpace] = await createSpace({ name: spaceName, slug: slugify(spaceName), teamId });

    if (!newSpace) return;

    onChange(newSpace.id);
  }

  return (
    <SingleOptionDropdown<SpaceBasicInfoFragment>
      icon={<IconSelection />}
      name="Space"
      placeholder="Select a space..."
      items={spacesList}
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

const SpaceDropdownIcon = styled(SpaceGradientIcon)`
  font-size: 20px;
`;
