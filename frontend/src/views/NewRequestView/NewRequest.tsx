import { isEqual, range } from "lodash";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useCallback, useMemo, useRef } from "react";
import styled, { css } from "styled-components";

import { routes } from "~frontend/../router";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { useLocalStorageState } from "~frontend/utils/useLocalStorageState";
import { getNodesFromContentByType } from "~richEditor/content/helper";
import { RichEditorNode } from "~richEditor/content/types";
import { Editor, getEmptyRichContent } from "~richEditor/RichEditor";
import { runUntracked } from "~shared/mobxUtils";
import { slugify } from "~shared/slugify";
import { FreeTextInput as TransparentTextInput } from "~ui/forms/FreeInputText";
import { onEnterPressed } from "~ui/forms/utils";
import { useShortcut } from "~ui/keyboard/useShortcut";

import { NewRequestRichEditor } from "./NewRequestRichEditor";

/**
 * Creates a placeholder with up to 2 random team members mentioned
 * The current user won't be included
 */
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

  useShortcut(["Meta", "Enter"], () => {
    submit();
    // Captures and prevents the event from getting to the editor
    return true;
  });

  const [topicName, setTopicName] = useLocalStorageState<string>({
    key: "topic-name-draft-for-new-request",
    getInitialValue: () => "",
    checkShouldStore: (value: string) => {
      return value !== null && value.trim() !== "";
    },
  });

  const checkShouldStore = useCallback(() => Boolean(editorRef.current && !editorRef.current.isEmpty), []);

  const [messageContent, setMessageContent] = useLocalStorageState<RichEditorNode>({
    key: "message-draft-for-new-request",
    getInitialValue: getEmptyRichContent,
    checkShouldStore,
  });

  function handleSubmitTopicName(submittedTopicName: string) {
    setTopicName(submittedTopicName);
  }

  const hasTypedMessageContent = useMemo(() => !isEqual(messageContent, getEmptyRichContent()), [messageContent]);

  const hasTypedInAnything = useMemo(
    () => topicName !== "" || hasTypedMessageContent,
    [topicName, hasTypedMessageContent]
  );

  const [isValid, nextStepPromptLabel] = useMemo(() => {
    if (topicName.length === 0) {
      return [false, "Please add a topic name before creating request"];
    }
    const mentionNodes = getNodesFromContentByType(messageContent, "mention");
    if (mentionNodes.length < 1) {
      return [false, "You should mention at least one teammate before creating request"];
    }
    return [true, "Hit ⌘+Enter to create request"];
  }, [topicName, messageContent]);

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

  function focusEditor() {
    editorRef.current?.chain().focus("start");
  }

  function submit() {
    if (!isValid) {
      return;
    }
    runInAction(() => {
      const topic = db.topic.create({ name: topicName, slug: getAvailableSlugForTopicName(topicName) });
      db.message.create({ content: messageContent, topic_id: topic.id, type: "TEXT" });

      setTopicName("");
      setMessageContent(getEmptyRichContent());

      routes.topic.push({ topicSlug: topic.slug });
    });
  }

  return (
    <UIHolder isEmpty={!hasTypedInAnything}>
      <UITopicNameInput
        autoFocus
        value={topicName}
        onChangeText={handleSubmitTopicName}
        placeholder={"Add topic"}
        onKeyPress={onEnterPressed(focusEditor)}
      />
      <NewRequestRichEditor
        ref={editorRef}
        value={messageContent}
        onChange={setMessageContent}
        placeholder={placeholder}
        onSubmit={submit}
      />
      {hasTypedMessageContent && <UINextStepPrompt>{nextStepPromptLabel}</UINextStepPrompt>}
    </UIHolder>
  );
});

const UIHolder = styled.div<{ isEmpty: boolean }>`
  ${(props) => {
    if (props.isEmpty) {
      return css`
        width: 300px;
      `;
    }
    return css`
      width: 560px;
      min-height: 150px;
    `;
  }}
`;

const UITopicNameInput = styled(TransparentTextInput)<{}>`
  font-weight: 700;
  font-family: "Inter", sans-serif;

  font-size: 24px;
`;

const UINextStepPrompt = styled.div<{}>`
  /* From framer */
  font-weight: 400;
  font-style: normal;
  font-family: "Inter", sans-serif;
  color: rgba(0, 0, 0, 0.4);
  font-size: 11px;
  letter-spacing: 0px;
  line-height: 1.5;
  text-align: left;
  /* From framer */

  margin-top: 20px; ;
`;
