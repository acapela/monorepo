import type { Editor } from "@tiptap/react";
import { AnimatePresence } from "framer-motion";
import { sampleSize } from "lodash";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useMemo, useRef } from "react";
import styled, { css } from "styled-components";

import { ClientDb, useDb } from "~frontend/clientdb";
import { usePersistedState } from "~frontend/hooks/useLocalStorageState";
import { MessageContentEditor } from "~frontend/message/composer/MessageContentComposer";
import { MessageTools } from "~frontend/message/composer/Tools";
import { useMessageEditorManager } from "~frontend/message/composer/useMessageEditorManager";
import { getNodesFromContentByType } from "~richEditor/content/helper";
import { useDocumentFilesPaste } from "~richEditor/useDocumentFilePaste";
import { getUniqueRequestMentionDataFromContent } from "~shared/editor/mentions";
import { useBoolean } from "~shared/hooks/useBoolean";
import { runUntracked } from "~shared/mobxUtils";
import { routes } from "~shared/routes";
import { slugify } from "~shared/slugify";
import { FadePresenceAnimator, PopPresenceAnimator } from "~ui/animations";
import { Button } from "~ui/buttons/Button";
import { FreeTextInput as TransparentTextInput } from "~ui/forms/FreeInputText";
import { onEnterPressed } from "~ui/forms/utils";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { theme } from "~ui/theme";

import { CreateRequestPrompt } from "./CreateRequestPrompt";

/**
 * Creates a placeholder with up to 2 random team members mentioned
 * The current user won't be included
 */
function useMessageContentExamplePlaceholder(): string {
  const db = useDb();

  const exampleRequestBodyWithTeamMemberNamesMentioned = useMemo(() => {
    const otherTeamMembers = db.user.query({ isMemberOfCurrentTeam: true, isCurrentUser: false }).all;

    if (!otherTeamMembers.length) {
      return `I would like you to...`;
    }

    const exampleUsers = sampleSize(otherTeamMembers, 2);

    const sampleMentionText = exampleUsers.map((user) => `@${user.name || "???"} `);

    return `${sampleMentionText.join(" ")} I would like you to...`;
  }, [db]);

  return exampleRequestBodyWithTeamMemberNamesMentioned;
}

async function getAvailableSlugForTopicName(db: ClientDb, topicName: string) {
  const optimisticSlug = await slugify(topicName);

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

export const NewRequest = observer(function NewRequest() {
  const editorRef = useRef<Editor>(null);
  const db = useDb();
  const messageContentExample = useMessageContentExamplePlaceholder();
  const router = useRouter();
  const [isSubmitting, { set: markAsSubmittingInProgress }] = useBoolean(false);

  const {
    content,
    setContent,
    attachments,
    removeAttachmentById,
    uploadingAttachments,
    uploadAttachments,
    focusEditor,
    hasAnyTextContent,
    clearPersistedContent,
  } = useMessageEditorManager({ editorRef, persistanceKey: "message-draft-for-new-request" });

  // const { isDragging: isDraggingFile } = useFileDroppedInContext((files) => {
  //   uploadAttachments(files);
  // });

  useDocumentFilesPaste((files) => {
    uploadAttachments(files);
  });

  // Submitting can be done from the editor or from the topic input box
  const sendShortcutDescription = useShortcut(["Meta", "Enter"], () => {
    if (isSubmitting) {
      return true;
    }

    submit();
    // Captures and prevents the event from getting to the editor
    return true;
  });

  const [topicName, setTopicName, clearTopicName] = usePersistedState<string>({
    key: "topic-name-draft-for-new-request",
    initialValue: "",
  });

  const hasTypedInAnything = useMemo(() => topicName !== "" || hasAnyTextContent, [topicName, hasAnyTextContent]);

  const [isValid, nextStepPromptLabel] = useMemo(() => {
    if (topicName.length === 0) {
      return [false, "Please add a topic name before creating request"];
    }
    const mentionNodes = getNodesFromContentByType(content, "mention");
    if (mentionNodes.length < 1) {
      return [false, "You should mention at least one teammate before creating request"];
    }
    return [true, `Hit ${sendShortcutDescription} to create request`];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicName, content]);

  async function submit() {
    if (!isValid) {
      return;
    }

    markAsSubmittingInProgress();

    const topicNameSlug = await getAvailableSlugForTopicName(db, topicName);

    runInAction(() => {
      const topic = db.topic.create({ name: topicName, slug: topicNameSlug });
      const newMessage = db.message.create({ content, topic_id: topic.id, type: "TEXT" });

      for (const { userId, type } of getUniqueRequestMentionDataFromContent(content)) {
        db.task.create({ message_id: newMessage.id, user_id: userId, type });
      }

      attachments.forEach((attachment) => {
        db.attachment.update(attachment.uuid, { message_id: newMessage.id });
      });

      router.push(routes.topic({ topicSlug: topic.slug }));
    });

    clearPersistedContent();
    clearTopicName();
  }

  return (
    <UIHolder>
      <UIContentHolder isEmpty={!hasTypedInAnything}>
        {!hasTypedInAnything && <UIFlyingCreateARequestLabel />}
        <UIEditableParts>
          <UITopicNameInput
            autoFocus
            disabled={isSubmitting}
            value={topicName}
            onChangeText={setTopicName}
            placeholder={"Add topic"}
            onKeyPress={onEnterPressed(focusEditor)}
          />
          <MessageContentEditor
            ref={editorRef}
            isDisabled={isSubmitting}
            placeholder={messageContentExample}
            content={content}
            onContentChange={setContent}
            attachments={attachments}
            onAttachmentRemoveRequest={removeAttachmentById}
            onFilesSelected={uploadAttachments}
            uploadingAttachments={uploadingAttachments}
          />

          <AnimatePresence>
            {hasAnyTextContent && !isSubmitting && <UINextStepPrompt>{nextStepPromptLabel}</UINextStepPrompt>}
            {isSubmitting && <UINextStepPrompt>Creating new request...</UINextStepPrompt>}
          </AnimatePresence>
        </UIEditableParts>
        {hasTypedInAnything && (
          <UIActions>
            <MessageTools onFilesPicked={uploadAttachments} />

            <Button
              isDisabled={!isValid && { reason: nextStepPromptLabel }}
              kind="primary"
              tooltip="Create Request"
              onClick={submit}
              shortcut={["Meta", "Enter"]}
            >
              Create Request
            </Button>
          </UIActions>
        )}
      </UIContentHolder>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  position: relative;
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const UIContentHolder = styled.div<{ isEmpty: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  ${theme.spacing.horizontalActionsSection.asGap};

  ${(props) => {
    if (props.isEmpty) {
      return css`
        width: 500px;
      `;
    }
    return css`
      width: 900px;
    `;
  }}
`;

const UIEditableParts = styled.div`
  width: 100%;
  min-height: 130px;
`;

const UIFlyingCreateARequestLabel = styled(CreateRequestPrompt)<{}>`
  position: absolute;
  /* Aligning prompt absolutely from very center of screen */
  left: -140px;
  top: -72px;

  @media only screen and (max-width: 900px) {
    display: none;
  }
`;

const UITopicNameInput = styled(TransparentTextInput)<{}>`
  ${theme.typo.pageTitle};
`;

const UINextStepPrompt = styled(FadePresenceAnimator)<{}>`
  ${theme.typo.label};
  ${theme.colors.text.opacity(0.4).asColor};
  margin-top: 20px;
`;

const UIActions = styled(PopPresenceAnimator)<{}>`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  ${theme.spacing.horizontalActionsSection.asGap}
`;
