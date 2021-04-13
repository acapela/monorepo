import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Dialog } from "~frontend/design/Dialog";
import { useCreateThreadMutation } from "~frontend/gql";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { createNextIndex } from "~frontend/rooms/order";
import { Button } from "~ui/button";
import { Field } from "~ui/field";

export const ThreadCreationButton: React.FC<{ roomId: string; lastThreadIndex?: string }> = ({
  roomId,
  lastThreadIndex,
}) => {
  const [isDialogOpened, { set: openDialog, unset: closeDialog }] = useBoolean(false);

  return (
    <>
      <Dialog
        title={"Add agenda point"}
        isOpened={isDialogOpened}
        onClose={closeDialog}
        aria-labelledby="thread-creation-button"
      >
        <ThreadCreationForm roomId={roomId} lastThreadIndex={lastThreadIndex} onCreated={closeDialog} />
      </Dialog>
      <Button wide onClick={openDialog} id="thread-creation-button">
        Add agenda point
      </Button>
    </>
  );
};

const UIThreadNameFieldWrapper = styled.div`
  margin-bottom: 1rem;
`;

interface Props {
  roomId: string;
  onCreated?: (threadId: string) => unknown;
  lastThreadIndex?: string;
}

interface FormData {
  name: string;
}

const ThreadCreationForm: React.FC<Props> = ({ onCreated, roomId, lastThreadIndex }) => {
  const [createThread, { loading }] = useCreateThreadMutation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({ defaultValues: { name: "" } });

  const onSubmit = handleSubmit(async (formData) => {
    const index = createNextIndex(lastThreadIndex);
    const { data } = await createThread({
      variables: {
        name: formData.name,
        index,
        roomId,
      },
    });

    if (!data?.thread) return;

    onCreated?.(data.thread.id);
  });

  // TODO: Show errors in UI (aca-258-handle-errors-on-the-fe)

  return (
    <form onSubmit={onSubmit}>
      <UIThreadNameFieldWrapper>
        <label htmlFor="thread-name">Name</label>
        <Field type="text" {...register("name")} placeholder="How do we get to mars?" />
      </UIThreadNameFieldWrapper>
      <Button type="submit" disabled={loading || isSubmitting} wide>
        Create
      </Button>
    </form>
  );
};
