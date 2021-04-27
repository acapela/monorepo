import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useCreateRoomMutation } from "~frontend/gql/rooms";
import { Button } from "~ui/button";
import { Field } from "~ui/field";
import { Dialog } from "~frontend/design/Dialog";
import { RoomBasicInfoFragment } from "~frontend/gql";

const UIRoomTitleFieldWrapper = styled.div`
  margin-bottom: 1rem;
`;

interface FormData {
  name: string;
}

interface Props {
  onCreated?: (room: RoomBasicInfoFragment) => void;
}

const RoomCreationForm: React.FC<Props> = ({ onCreated }) => {
  const {
    register,
    handleSubmit,

    formState: { isSubmitting },
  } = useForm<FormData>({ defaultValues: { name: "" } });

  const onSubmit = handleSubmit(async (formData) => {
    const { data } = await createRoom({ variables: { name: formData.name } });

    if (!data?.room) {
      return;
    }
    onCreated?.(data.room);
  });

  // TODO: Show errors in UI (aca-258-handle-errors-on-the-fe)

  const [createRoom, { loading }] = useCreateRoomMutation();
  return (
    <form onSubmit={onSubmit}>
      <UIRoomTitleFieldWrapper>
        <label htmlFor="room-name">Title</label>
        <Field {...register("name", { required: true })} placeholder="How do we get to mars?" />
      </UIRoomTitleFieldWrapper>
      <Button type="submit" disabled={loading || isSubmitting} wide>
        Create
      </Button>
    </form>
  );
};

export const RoomCreationButton: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { push } = useRouter();

  const open = () => setDialogOpen(true);
  const close = () => setDialogOpen(false);

  const handleRoomCreation = (room: RoomBasicInfoFragment) => {
    push(`/rooms/${room.id}`);
  };

  return (
    <>
      <Dialog
        title={"Create a new acapela"}
        isOpened={dialogOpen}
        onClose={close}
        aria-labelledby="acapela-creation-button"
      >
        <RoomCreationForm onCreated={handleRoomCreation} />
      </Dialog>
      <Button wide onClick={open} id="acapela-creation-button">
        Create New Acapela
      </Button>
    </>
  );
};
