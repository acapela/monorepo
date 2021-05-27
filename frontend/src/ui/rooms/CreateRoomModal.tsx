import { useState } from "react";
import { useKey } from "react-use";
import styled from "styled-components";
import { useCreateRoomMutation } from "~frontend/gql/rooms";
import { slugify } from "~shared/slugify";
import { Button } from "~ui/button";
import { TextInput } from "~ui/forms/TextInput";
import { Modal } from "../Modal";

interface Props {
  spaceId: string;
  onCloseRequest: () => void;
  onCreated: ({ spaceId, roomId }: { spaceId: string; roomId: string }) => void;
}

export const CreateRoomModal = ({ spaceId, onCloseRequest, onCreated }: Props) => {
  const [createRoom] = useCreateRoomMutation();
  const [name, setName] = useState("");

  useKey("Escape", () => onCloseRequest());
  useKey("Enter", () => onCreate(), {}, [name]);

  async function onCreate() {
    if (!name.trim()) {
      onCloseRequest();
      return;
    }

    const slug = slugify(name);

    const { data: createRoomResult } = await createRoom({ name, spaceId, slug });

    const roomId = createRoomResult?.room?.id;

    if (!roomId) {
      onCloseRequest();
      return;
    }

    onCloseRequest();
    onCreated({ spaceId, roomId });
  }

  return (
    <Modal
      head={{
        title: "Create new room",
        description: "",
      }}
      onCloseRequest={onCloseRequest}
    >
      <UIContentWrapper>
        <TextInput autoFocus placeholder="Enter room name" value={name} onChangeText={(value) => setName(value)} />
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
