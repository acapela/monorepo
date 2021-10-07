import { runInAction } from "mobx";
import React from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { useLocalStorageState } from "~frontend/hooks/useLocalStorageState";
import { RichEditorNode } from "~richEditor/content/types";
import { getEmptyRichContent } from "~richEditor/RichEditor";
import { FreeTextInput as TransparentTextInput } from "~ui/forms/FreeInputText";

import { NewRequestRichEditor } from "./NewRequestRichEditor";

export function NewRequest() {
  const db = useDb();

  const [topicName, setTopicName] = useLocalStorageState<string>({
    key: "topic-name-draft-for-new-request",
    initialValue: "",
  });

  const [content, setContent] = useLocalStorageState<RichEditorNode>({
    key: "message-draft-for-new-request",
    initialValue: getEmptyRichContent(),
  });

  function handleSubmitTopicName(submittedTopicName: string) {
    setTopicName(submittedTopicName);
  }

  function submit() {
    // TODO: Fix! Mentions are not quite working correctly.
    runInAction(() => {
      const topic = db.topic.create({ name: topicName, slug: `slug-${topicName}` });
      db.message.create({ content, topic_id: topic.id, type: "TEXT" });
    });
  }

  return (
    <UIHolder>
      <UITopicNameInput value={topicName} onChangeText={handleSubmitTopicName} placeholder={"Add topic"} />
      <NewRequestRichEditor value={content} onChange={setContent} placeholder="Hello!" />
      <button onClick={submit}>Submit</button>
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  width: 600px;
`;

const UITopicNameInput = styled(TransparentTextInput)<{}>`
  font-weight: 700;
  font-family: "Inter", sans-serif;

  font-size: 24px;
`;
