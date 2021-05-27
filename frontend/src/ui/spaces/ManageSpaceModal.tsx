import { useState } from "react";
import { useKey } from "react-use";
import styled from "styled-components";
import { useCreateSpaceMutation } from "~frontend/gql/spaces";
import { slugify } from "~shared/slugify";
import { Button } from "~ui/button";
import { TextInput } from "~ui/forms/TextInput";
import { Modal } from "../Modal";

interface Props {
  teamId: string;
  onCloseRequest: () => void;
  onCreated: ({ spaceId }: { spaceId: string }) => void;
}

/* ManageSpaceModal since we'll extend this modal with edit space functionality */
export const ManageSpaceModal = ({ teamId, onCloseRequest, onCreated }: Props) => {
  const [createSpace] = useCreateSpaceMutation();
  const [name, setName] = useState("");

  useKey("Escape", () => onCloseRequest());
  useKey("Enter", () => onCreate(), {}, [name]);

  async function onCreate() {
    if (!name.trim()) {
      onCloseRequest();
      return;
    }

    const slug = slugify(name);

    const { data: spaceCreationResult } = await createSpace({ name: name, teamId, slug });

    const spaceId = spaceCreationResult?.space?.id;

    if (!spaceId) {
      onCloseRequest();
      return;
    }

    onCloseRequest();
    onCreated({ spaceId });
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
        <TextInput autoFocus placeholder="Enter space name" value={name} onChangeText={(value) => setName(value)} />
        <Button onClick={onCreate}>Create</Button>
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
