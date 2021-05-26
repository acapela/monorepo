import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Dialog } from "~frontend/ui/Dialog";
import { useCreateTopicMutation } from "~frontend/gql/topics";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { createNextIndex } from "~frontend/rooms/order";
import { Button } from "~ui/button";
import { Field } from "~ui/field";
import { slugify } from "~shared/slugify";
import { TopicDetailedInfoFragment } from "~frontend/gql/generated";
import { routes } from "~frontend/../routes";

interface TopicCreationButtonProps {
  roomId: string;
  lastTopicIndex?: string;
}

export const TopicCreationButton = ({ roomId, lastTopicIndex }: TopicCreationButtonProps) => {
  const [isDialogOpened, { set: openDialog, unset: closeDialog }] = useBoolean(false);

  function handleCreated(topic: TopicDetailedInfoFragment) {
    closeDialog();
    routes.spaceRoomTopic.push({ topicId: topic.id, spaceId: topic.room.space_id, roomId: topic.room.id });
  }

  return (
    <>
      <Dialog
        title={"Add new topic"}
        isOpened={isDialogOpened}
        onClose={closeDialog}
        aria-labelledby="topic-creation-button"
      >
        <TopicCreationForm roomId={roomId} lastTopicIndex={lastTopicIndex} onCreated={handleCreated} />
      </Dialog>
      <Button wide onClick={openDialog} id="topic-creation-button">
        Add new topic
      </Button>
    </>
  );
};

const UITopicNameFieldWrapper = styled.div`
  margin-bottom: 1rem;
`;

interface TopicCreationFormProps {
  roomId: string;
  onCreated?: (topic: TopicDetailedInfoFragment) => void;
  lastTopicIndex?: string;
}

interface FormData {
  name: string;
}

const TopicCreationForm = ({ onCreated, roomId, lastTopicIndex }: TopicCreationFormProps) => {
  const [createTopic, { loading }] = useCreateTopicMutation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({ defaultValues: { name: "" } });

  const onSubmit = handleSubmit(async (formData) => {
    const index = createNextIndex(lastTopicIndex);
    const slug = slugify(formData.name);
    const { data } = await createTopic({
      name: formData.name,
      slug,
      index,
      roomId,
    });

    if (!data?.topic) return;

    onCreated?.(data.topic);
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
