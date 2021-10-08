import { range } from "lodash";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useCallback, useMemo, useRef } from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { useLocalStorageState } from "~frontend/utils/useLocalStorageState";
import { RichEditorNode } from "~richEditor/content/types";
import { Editor, getEmptyRichContent } from "~richEditor/RichEditor";
import { runUntracked } from "~shared/mobxUtils";
import { slugify } from "~shared/slugify";
import { FreeTextInput as TransparentTextInput } from "~ui/forms/FreeInputText";

import { NewRequestRichEditor } from "./NewRequestRichEditor";

function usePlaceholder(): string {
  const db = useDb();
  const user = useAssertCurrentUser();

  const teamMembers = db.teamMember.find(
    (teamMember) => teamMember.user_id !== user.id && teamMember.user !== null
  ).all;

  return useMemo(() => {
    function getMemberMentions() {
      let displayNames = "";

      const unusedMemberIndexes = range(teamMembers.length);

      for (let i = 0; i < 2 && i < teamMembers.length; i++) {
        const randomIndex = Math.floor(Math.random() * unusedMemberIndexes.length);

        const teamMemberIndex = unusedMemberIndexes.splice(randomIndex, 1)[0];

        const randomTeamMember = teamMembers[teamMemberIndex];
        displayNames += `@${randomTeamMember.user.name} `;
      }

      return displayNames;
    }
    return `${getMemberMentions()} I would like you to...`;
  }, [teamMembers]);
}

export const NewRequest = observer(function NewRequest() {
  const editorRef = useRef<Editor>(null);
  const db = useDb();
  const placeholder = usePlaceholder();

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

  function getAvailableSlugForTopicName(topicName: string) {
    const optimisticSlug = slugify(topicName);

    return runUntracked(() => {
      if (!db.topic.findByUniqueIndex("slug", optimisticSlug)) {
        return optimisticSlug;
      }
      let suffixIndex = 2;

      while (db.topic.findByUniqueIndex("slug", `${optimisticSlug}-${suffixIndex}`)) {
        suffixIndex++;
      }

      return `${optimisticSlug}-${suffixIndex}`;
    });
  }

  function submit() {
    runInAction(() => {
      const topic = db.topic.create({ name: topicName, slug: getAvailableSlugForTopicName(topicName) });
      db.message.create({ content, topic_id: topic.id, type: "TEXT" });
      setTopicName("");
      setContent(getEmptyRichContent());
    });
  }

  return (
    <UIHolder>
      <UITopicNameInput value={topicName} onChangeText={handleSubmitTopicName} placeholder={"Add topic"} />
      <NewRequestRichEditor value={content} onChange={setContent} placeholder={placeholder} />
      <button onClick={submit}>Submit</button>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  width: 600px;
`;

const UITopicNameInput = styled(TransparentTextInput)<{}>`
  font-weight: 700;
  font-family: "Inter", sans-serif;

  font-size: 24px;
`;
