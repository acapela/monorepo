import React, { useCallback, useRef } from "react";
import styled from "styled-components";

import { Editor, getEmptyRichContent } from "~frontend/../../richEditor/RichEditor";
import { useLocalStorageState } from "~frontend/utils/useLocalStorageState";
import { RichEditorNode } from "~richEditor/content/types";
import { FreeTextInput } from "~ui/forms/FreeInputText";

import { NewRequestRichEditor } from "../editor/newRequestEditor";

export function NewRequest() {
  const editorRef = useRef<Editor>(null);

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
    setTopicName(submittedTopicName.trim());
  }

  return (
    <UIHolder>
      <UITopicNameInput value={topicName} onChangeText={handleSubmitTopicName} placeholder={"Add topic"} />
      <NewRequestRichEditor value={content} onChange={setContent} placeholder="Hello!" />
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  width: 600px;
`;

const UITopicNameInput = styled(FreeTextInput)<{}>`
  font-weight: 700;
  font-family: "Inter", sans-serif;

  font-size: 24px;
`;
