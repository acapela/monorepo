import type { Editor } from "@tiptap/react";
import { AnimatePresence, motion } from "framer-motion";
import { sampleSize } from "lodash";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import router from "next/router";
import React, { useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";

import { PageLayoutAnimator, layoutAnimations } from "~frontend/animations/layout";
import { ClientDb, useDb } from "~frontend/clientdb";
import { TopicEntity } from "~frontend/clientdb/topic";
import { usePersistedState } from "~frontend/hooks/usePersistedState";
import { useUpdateMessageTasks } from "~frontend/hooks/useUpdateMessageTasks";
import { MessageContentEditor } from "~frontend/message/composer/MessageContentComposer";
import { MessageTools } from "~frontend/message/composer/Tools";
import { useMessageEditorManager } from "~frontend/message/composer/useMessageEditorManager";
import { TaskDueDateSetter } from "~frontend/tasks/TaskDueDateSetter";
import { PriorityPicker } from "~frontend/topics/PriorityPicker";
import { Priority_Enum } from "~gql";
import { getNodesFromContentByType } from "~richEditor/content/helper";
import { useConst } from "~shared/hooks/useConst";
import { runUntracked } from "~shared/mobxUtils";
import { getTopicNameFromContent } from "~shared/routes/topicSlug";
import { slugify } from "~shared/slugify";
import { getUUID } from "~shared/uuid";
import { FadePresenceAnimator, POP_ANIMATION_CONFIG } from "~ui/animations";
import { Button } from "~ui/buttons/Button";
import { FreeTextInput as TransparentTextInput } from "~ui/forms/FreeInputText";
import { onEnterPressed } from "~ui/forms/utils";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { theme } from "~ui/theme";

import { DecisionEditor, useDecisionController } from "../RequestView/TopicWithMessages/Decision/DecisionEditor";
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
      return `@Name Could you give me feedback on this Figma file?`;
    }

    const exampleUsers = sampleSize(otherTeamMembers, 2);

    const sampleMentionText = exampleUsers.map((user) => `@${user.name || "???"} `);

    return `${sampleMentionText.join(" ")} Could you give me feedback on this Figma file?`;
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

export interface NewRequestProps {
  topicToDuplicate?: TopicEntity;
  onTopicCreated?: (newTopic: TopicEntity) => void;
  alwaysExpanded?: boolean;
}

type CreatingRequestStage = "empty" | "has-any-content" | "valid";

export const NewRequest = observer(function NewRequest({
  topicToDuplicate,
  onTopicCreated,
  alwaysExpanded = false,
}: NewRequestProps) {
  const editorRef = useRef<Editor>(null);
  const db = useDb();
  const messageContentExample = useMessageContentExamplePlaceholder();
  const updateMessageTasks = useUpdateMessageTasks();
  const [tasksDueDate, setTasksDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<null | Priority_Enum>(null);

  const newTopicId = useConst(getUUID);

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
  } = useMessageEditorManager({
    editorRef,
    persistanceKey: `message-draft-for-new-request-${topicToDuplicate?.id}`,
    initialValue: topicToDuplicate?.messages.first?.content,
  });

  // Submitting can be done from the editor or from the topic input box
  useShortcut(["Mod", "Enter"], () => {
    submit();
    // Captures and prevents the event from getting to the editor
    return true;
  });

  const [topicName, setTopicName, clearTopicName] = usePersistedState<string>({
    key: `topic-name-draft-for-new-request-${topicToDuplicate?.id}`,
    initialValue: topicToDuplicate?.name ?? "",
  });

  const stage = useMemo<CreatingRequestStage>(() => {
    if (!topicName.trim().length && !hasAnyTextContent) {
      return "empty";
    }

    const mentionNodes = getNodesFromContentByType(content, "mention");

    if (!mentionNodes.length) {
      return "has-any-content";
    }

    return "valid";
  }, [topicName, hasAnyTextContent, content]);

  const canSubmit = stage === "valid";

  const isUIExpanded = alwaysExpanded || stage !== "empty";

  function getHint() {
    if (stage === "has-any-content") {
      return `Mention team members using @Name to make your request more actionable.`;
    }
    if (stage === "valid") {
      if (!tasksDueDate) {
        return `You can optionally set due date to indicate when you need input from others.`;
      }
    }
  }

  const stageHint = getHint();

  async function submit() {
    if (!canSubmit) {
      return;
    }

    // If no title is provided - we'll auto generate it from content
    let finalTitle = topicName;

    if (!finalTitle.trim().length) {
      finalTitle = getTopicNameFromContent(content) ?? "New topic";
    }

    const topicNameSlug = await getAvailableSlugForTopicName(db, finalTitle);

    runInAction(() => {
      const topic = db.topic.create({ id: newTopicId, name: finalTitle, slug: topicNameSlug, priority });
      const newMessage = db.message.create({ content, topic_id: topic.id, type: "TEXT" });

      updateMessageTasks(newMessage);

      if (tasksDueDate) {
        newMessage.setTasksDueDate(tasksDueDate);
      }

      attachments.forEach((attachment) => {
        db.attachment.update(attachment.uuid, { message_id: newMessage.id });
      });

      createDecision(newMessage.id);

      onTopicCreated?.(topic);

      router.push(topic.href);
    });
    clearPersistedContent();
    clearTopicName();
  }

  const [shouldShowDecision, { controller, submit: createDecision }] = useDecisionController({ content });

  return (
    <UIHolder>
      <UIContentHolder isExpanded={isUIExpanded}>
        <div>
          {!alwaysExpanded && (
            <UIFlyingCreateARequestLabel
              layout="position"
              layoutId="UIFlyingCreateARequestLabel"
              animate={{
                opacity: isUIExpanded ? 0 : 1,
                x: isUIExpanded ? -50 : 0,
                y: isUIExpanded ? -50 : 0,
              }}
              transition={POP_ANIMATION_CONFIG}
            />
          )}
        </div>

        <UIEditableParts isExpanded={isUIExpanded}>
          <PageLayoutAnimator layoutId={layoutAnimations.newTopic.title(newTopicId)}>
            <UITopicNameInput
              value={topicName}
              onChangeText={setTopicName}
              placeholder={"Add Title (optional)"}
              onKeyPress={onEnterPressed(focusEditor)}
            />
          </PageLayoutAnimator>

          <UIComposerHolder layoutId={layoutAnimations.newTopic.message(newTopicId)}>
            <MessageContentEditor
              ref={editorRef}
              placeholder={messageContentExample}
              content={content}
              onContentChange={setContent}
              attachments={attachments}
              onAttachmentRemoveRequest={removeAttachmentById}
              onFilesSelected={uploadAttachments}
              uploadingAttachments={uploadingAttachments}
              additionalContent={shouldShowDecision ? <DecisionEditor controller={controller} /> : null}
              capturePastedFiles
              autofocusKey="new-request"
            />
          </UIComposerHolder>

          <AnimatePresence exitBeforeEnter>
            <UINextStepPrompt
              // Next step label can be empty so make sure we use some key
              key={stageHint?.toString() || "no-step"}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: isUIExpanded ? 1 : 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Avoid height flicker if there is no next prompt by adding nbsp */}
              {stageHint}&nbsp;
            </UINextStepPrompt>
          </AnimatePresence>
        </UIEditableParts>
        <UIActions
          animate={{ opacity: isUIExpanded ? 1 : 0 }}
          initial={{ opacity: 0 }}
          layoutId={layoutAnimations.newTopic.messageTools(newTopicId)}
        >
          <UIAdditionalActions>
            <AnimatePresence>
              {stage === "valid" && (
                <>
                  <FadePresenceAnimator>
                    <TaskDueDateSetter dueDate={tasksDueDate} onChange={setTasksDueDate} size="regular" />
                  </FadePresenceAnimator>
                  <FadePresenceAnimator>
                    <PriorityPicker priority={priority} onChange={setPriority} />
                  </FadePresenceAnimator>
                </>
              )}
            </AnimatePresence>
          </UIAdditionalActions>
          <MessageTools onFilesPicked={uploadAttachments} />

          <Button
            isDisabled={!canSubmit}
            kind="primary"
            tooltip="Send request"
            onClick={submit}
            shortcut={["Mod", "Enter"]}
          >
            Send request
          </Button>
        </UIActions>
      </UIContentHolder>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  position: relative;
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 0;
`;

const UIContentHolder = styled.div<{ isExpanded: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  will-change: transform;
  min-height: 0;
  max-width: 900px;
  width: 100%;
  ${theme.spacing.actionsSection.asGap};

  ${(props) => {
    if (!props.isExpanded) {
      return css`
        max-width: 500px;
      `;
    }
    return css`
      max-width: 900px;
    `;
  }}
`;

const UIEditableParts = styled.div<{ isExpanded: boolean }>`
  width: 100%;
  ${theme.common.flexDiv}

  ${theme.spacing.actionsSection.asGap}
`;

const UIFlyingCreateARequestLabel = styled(CreateRequestPrompt)<{}>`
  position: absolute;
  /* Aligning prompt absolutely from very center of screen */
  left: -140px;
  top: -10px;

  @media only screen and (max-width: 900px) {
    display: none;
  }
`;

const UITopicNameInput = styled(TransparentTextInput)<{}>`
  ${theme.typo.secondaryTitle};
  padding: 0;
`;

const UINextStepPrompt = styled(motion.div)<{}>`
  ${theme.typo.label};
  ${theme.colors.text.opacity(0.4).asColor};
  margin-top: 20px;
`;

const UIActions = styled(PageLayoutAnimator)<{}>`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  will-change: transform, opacity;

  ${theme.spacing.actionsSection.asGap}
`;

const UIAdditionalActions = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const UIComposerHolder = styled(PageLayoutAnimator)`
  min-height: 0;
  overflow-y: auto;
`;
