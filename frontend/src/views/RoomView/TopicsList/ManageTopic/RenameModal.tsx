import React, { useCallback, useEffect, useState } from "react";
import { TextInput } from "~ui/forms/TextInput";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { Modal } from "~frontend/ui/Modal";
import { VStack } from "~ui/Stack";
import { Button } from "~ui/button";
import { useEditTopicMutation } from "~frontend/gql/topics";
import { SecondaryText } from "~ui/typo";
import { DANGER_COLOR } from "~ui/colors";

interface Props {
  onClose: () => void;
  topic: TopicDetailedInfoFragment;
}

const validate = (name: string) => {
  if (!name.trim()) {
    return `Name can't be empty`;
  }
};

export const RenameModal = ({ onClose, topic }: Props) => {
  const [name, setName] = useState(topic?.name ?? "");
  const [editTopic] = useEditTopicMutation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [name]);

  const handleSubmit = useCallback(async () => {
    const error = validate(name);
    if (error) {
      setError(error);
      return;
    }

    try {
      await editTopic({ topicId: topic.id, name });
      onClose();
    } catch (err) {
      setError("Oops, something went wrong");
    }
  }, [name]);
  return (
    <Modal
      head={{
        title: "Rename topic",
      }}
      onCloseRequest={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <VStack style={{ width: "100%" }} alignItems="center" gap={40}>
          <VStack style={{ width: "100%" }} gap={4}>
            <TextInput autoFocus placeholder="Enter topic name" value={name} onChangeText={(value) => setName(value)} />
            {error && <SecondaryText style={{ paddingLeft: "16px", color: DANGER_COLOR }}>{error}</SecondaryText>}
          </VStack>
          <Button>Rename</Button>
        </VStack>
      </form>
    </Modal>
  );
};
