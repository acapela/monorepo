import { runInAction } from "mobx";
import React, { useCallback, useRef } from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { useLocalStorageState } from "~frontend/utils/useLocalStorageState";
import { RichEditorNode } from "~richEditor/content/types";
import { Editor, getEmptyRichContent } from "~richEditor/RichEditor";
import { FreeTextInput as TransparentTextInput } from "~ui/forms/FreeInputText";

import { NewRequestRichEditor } from "./NewRequestRichEditor";

export function NewRequest() {
  const editorRef = useRef<Editor>(null);
  const db = useDb();

  const [topicName, setTopicName] = useLocalStorageState<string>({
    key: "topic-name-draft-for-new-request",
    getInitialValue: () => "",
    checkShouldStore: (value: string) => {
      return value !== null && value.trim() !== "";
    },
  });

  const checkShouldStore = useCallback(() => Boolean(editorRef.current && !editorRef.current.isEmpty), []);

  const [content, setContent] = useLocalStorageState<RichEditorNode>({
    key: "message-draft-for-new-request",
    getInitialValue: getEmptyRichContent,
    checkShouldStore,
  });

  function handleSubmitTopicName(submittedTopicName: string) {
    setTopicName(submittedTopicName);
  }

  function submit() {
    runInAction(() => {
      const topic = db.topic.create({ name: topicName, slug: `slug-${topicName}` });

      // TODO: @Adam, here's the race condition to fix!
      setTimeout(() => {
        db.message.create({ content, topic_id: topic.id, type: "TEXT" });
      }, 1500);
    });
    setTopicName("");
    setContent(getEmptyRichContent());
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
