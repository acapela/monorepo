import { useState } from "react";
import { useKey } from "react-use";
import styled from "styled-components";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { useCreateTopicMutation } from "~frontend/gql/topics";
import { createNextIndex } from "~frontend/rooms/order";
import { Modal } from "~frontend/ui/Modal";
import { slugify } from "~shared/slugify";
import { Button } from "~ui/button";
import { TextInput } from "~ui/forms/TextInput";

interface Props {
  roomId: string;
  onCloseRequest: () => void;
  onCreated: (topic: TopicDetailedInfoFragment) => void;
  lastTopicIndex?: string;
}

export const AddTopicModal = ({ roomId, lastTopicIndex, onCloseRequest, onCreated }: Props) => {
  const [createTopic] = useCreateTopicMutation();
  const [name, setName] = useState("");

  useKey("Escape", () => onCloseRequest());
  useKey("Enter", () => onCreate(), {}, [name]);

  async function onCreate() {
    if (!name.trim()) {
      onCloseRequest();
      return;
    }

    const index = createNextIndex(lastTopicIndex);
    const slug = slugify(name);

    const { data: createTopicResult } = await createTopic({
      name,
      slug,
      index,
      roomId,
    });

    const topic = createTopicResult?.topic;

    if (!topic) {
      onCloseRequest();
      return;
    }

    onCloseRequest();
    onCreated(topic);
  }

  return (
    <Modal
      head={{
        title: "Add topic",
        description: "",
      }}
      onCloseRequest={onCloseRequest}
    >
      <UIContentWrapper>
        <TextInput autoFocus placeholder="Enter topic name" value={name} onChangeText={(value) => setName(value)} />
        <Button onClick={onCreate}>Add</Button>
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
