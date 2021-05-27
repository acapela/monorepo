import { useState } from "react";
import styled from "styled-components";
import { useCreateSpaceMutation } from "~frontend/gql/spaces";
import { slugify } from "~shared/slugify";
import { Button } from "~ui/button";
import { TextInput } from "~ui/forms/TextInput";
import { Modal } from "../Modal";

interface Props {
  teamId: string;
  onCloseRequest: () => void;
  onCreated: (teamId: string) => void;
}

/* ManageSpaceModal since we'll extend this modal with edit space functionality */
export const ManageSpaceModal = ({ teamId, onCloseRequest, onCreated }: Props) => {
  const [createSpace] = useCreateSpaceMutation();
  const [spaceName, setSpaceName] = useState("");

  async function onCreateSpace() {
    if (!spaceName.trim()) {
      onCloseRequest();
      return;
    }

    const slug = slugify(spaceName);

    const { data: spaceCreationResult } = await createSpace({ name: spaceName, teamId, slug });

    const spaceId = spaceCreationResult?.space?.id;

    if (!spaceId) {
      onCloseRequest();
      return;
    }

    onCloseRequest();
    onCreated(spaceId);
  }

  return (
    <Modal
      head={{
        title: "Create new space",
        description: "",
      }}
      onCloseRequest={onCloseRequest}
    >
      <UIContentWrapper>
        <TextInput placeholder="Enter space name" value={spaceName} onChangeText={(value) => setSpaceName(value)} />
        <Button onClick={onCreateSpace}>Create</Button>
      </UIContentWrapper>
    </Modal>
  );
};

const UIContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  ${Button} {
    margin-top: 1rem;
  }
`;
