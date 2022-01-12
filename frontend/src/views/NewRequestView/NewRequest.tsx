import type { Editor } from "@tiptap/react";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react";
import router from "next/router";
import React, { useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";

import { PageLayoutAnimator, layoutAnimations } from "@aca/frontend/animations/layout";
import { useDb } from "@aca/frontend/clientdb";
import { TopicEntity } from "@aca/frontend/clientdb/topic";
import { usePersistedState } from "@aca/frontend/hooks/usePersistedState";
import { MessageContentEditor } from "@aca/frontend/message/composer/MessageContentComposer";
import { MessageTools } from "@aca/frontend/message/composer/Tools";
import { useMessageEditorManager } from "@aca/frontend/message/composer/useMessageEditorManager";
import { getDoesMessageContentIncludeDecisionRequests } from "@aca/frontend/message/decisions";
import {
  FirstCompletionEnoughToggle,
  isRequestTypeCompletableBySingleUser,
  useSingleRequestTypeForManyUsers,
} from "@aca/frontend/tasks/single-completion";
import { TaskDueDateSetter } from "@aca/frontend/tasks/TaskDueDateSetter";
import { createNewRequest } from "@aca/frontend/topics/createRequest";
import { PriorityPicker } from "@aca/frontend/topics/PriorityPicker";
import { Priority_Enum } from "@aca/gql";
import { getNodesFromContentByType } from "@aca/richEditor/content/helper";
import { useConst } from "@aca/shared/hooks/useConst";
import { getUUID } from "@aca/shared/uuid";
import { FadePresenceAnimator, POP_ANIMATION_CONFIG } from "@aca/ui/animations";
import { Button } from "@aca/ui/buttons/Button";
import { FreeTextInput as TransparentTextInput } from "@aca/ui/forms/FreeInputText";
import { onEnterPressed } from "@aca/ui/forms/utils";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";
import { theme } from "@aca/ui/theme";

import { DecisionEditor, INITIAL_DECISION_OPTIONS } from "../RequestView/TopicWithMessages/Decision/DecisionEditor";
import { CreateRequestPrompt } from "./CreateRequestPrompt";
import { useMessageContentExamplePlaceholder } from "./useMessageContentExamplePlaceholder";

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
  const [tasksDueDate, setTasksDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<null | Priority_Enum>(null);
  const [decisionOptions, setDecisionOptions] = useState(INITIAL_DECISION_OPTIONS);

  const newTopicId = useConst(getUUID);

  const {
    content,
    setContent,
    attachmentsDrafts,
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

  const shouldShowDecision = useMemo(() => getDoesMessageContentIncludeDecisionRequests(content), [content]);

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

  const [isFirstCompletionEnough, setIsFirstCompletionEnough] = useState(false);

  const singleRequestTypeForManyUsers = useSingleRequestTypeForManyUsers(content);

  async function submit() {
    if (!canSubmit) {
      return;
    }

    const { topic } = await createNewRequest({
      db: db.linker,
      tasksDueDate: tasksDueDate ?? undefined,
      priority,
      content,
      attachmentsDrafts,
      decisionOptionsDrafts: decisionOptions,
      id: newTopicId,
      name: topicName,
      isFirstCompletionEnough,
    });

    router.push(topic.href);

    clearPersistedContent();
    clearTopicName();

    onTopicCreated?.(topic);
  }

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
              attachmentDrafts={attachmentsDrafts}
              onAttachmentRemoveRequest={removeAttachmentById}
              onFilesSelected={uploadAttachments}
              uploadingAttachments={uploadingAttachments}
              additionalContent={
                shouldShowDecision ? (
                  <DecisionEditor options={decisionOptions} onOptionsChange={setDecisionOptions} />
                ) : null
              }
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
                  {isRequestTypeCompletableBySingleUser(singleRequestTypeForManyUsers) && (
                    <FadePresenceAnimator>
                      <FirstCompletionEnoughToggle
                        requestType={singleRequestTypeForManyUsers}
                        isSet={isFirstCompletionEnough}
                        onChange={(value) => setIsFirstCompletionEnough(value)}
                      />
                    </FadePresenceAnimator>
                  )}
                </>
              )}
            </AnimatePresence>
          </UIAdditionalActions>

          <UIBottom>
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
          </UIBottom>
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
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`;

const UIBottom = styled.div<{}>`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-self: flex-end;
`;

const UIComposerHolder = styled(PageLayoutAnimator)`
  min-height: 0;
  overflow-y: auto;
`;
