import { Dialog } from "@acapela/frontend/design/Dialog";
import { useBoolean } from "@acapela/frontend/hooks/useBoolean";
import { useCreateThreadMutation } from "@acapela/frontend/gql";
import { createNextIndex } from "@acapela/frontend/rooms/order";
import { Button } from "@acapela/ui/button";
import { Field } from "@acapela/ui/field";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

export const ThreadCreationButton: React.FC<{ roomId: string; lastThreadIndex?: string }> = ({
  roomId,
  lastThreadIndex,
}) => {
  const [isDialogOpened, { set: open, unset: close }] = useBoolean(false);

  return (
    <>
      <Dialog
        title={"Add agenda point"}
        isOpened={isDialogOpened}
        onClose={close}
        aria-labelledby="thread-creation-button"
      >
        <ThreadCreationForm roomId={roomId} lastThreadIndex={lastThreadIndex} onCreated={close} />
      </Dialog>
      <Button wide onClick={open} id="thread-creation-button">
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
