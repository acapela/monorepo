import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Dialog } from "~frontend/ui/Dialog";
import { useCreateTopicMutation } from "~frontend/gql/topics";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { createNextIndex } from "~frontend/rooms/order";
import { Button } from "~ui/button";
import { Field } from "~ui/field";

export const TopicCreationButton: React.FC<{ roomId: string; lastTopicIndex?: string }> = ({
  roomId,
  lastTopicIndex,
}) => {
  const [isDialogOpened, { set: openDialog, unset: closeDialog }] = useBoolean(false);

  return (
    <>
      <Dialog
        title={"Add agenda point"}
        isOpened={isDialogOpened}
        onClose={closeDialog}
        aria-labelledby="topic-creation-button"
      >
        <TopicCreationForm roomId={roomId} lastTopicIndex={lastTopicIndex} onCreated={closeDialog} />
      </Dialog>
      <Button wide onClick={openDialog} id="topic-creation-button">
        Add topic
      </Button>
    </>
  );
};

const UITopicNameFieldWrapper = styled.div`
  margin-bottom: 1rem;
`;

interface Props {
  roomId: string;
  onCreated?: (topicId: string) => unknown;
  lastTopicIndex?: string;
}

interface FormData {
  name: string;
}

const TopicCreationForm: React.FC<Props> = ({ onCreated, roomId, lastTopicIndex }) => {
  const [createTopic, { loading }] = useCreateTopicMutation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({ defaultValues: { name: "" } });

  const onSubmit = handleSubmit(async (formData) => {
    const index = createNextIndex(lastTopicIndex);
    const { data } = await createTopic({
      name: formData.name,
      index,
      roomId,
    });

    if (!data?.topic) return;

    onCreated?.(data.topic.id);
  });

  // TODO: Show errors in UI (aca-258-handle-errors-on-the-fe)

  return (
    <form onSubmit={onSubmit}>
      <UITopicNameFieldWrapper>
        <label htmlFor="topic-name">Name</label>
        <Field type="text" {...register("name")} placeholder="How do we get to mars?" />
      </UITopicNameFieldWrapper>
      <Button type="submit" disabled={loading || isSubmitting} wide>
        Create
      </Button>
    </form>
  );
};
