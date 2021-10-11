import { isEqual, noop, range } from "lodash";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useList } from "react-use";
import styled, { css } from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { routes } from "~frontend/router";
import { AttachmentPreview } from "~frontend/ui/message/attachment/AttachmentPreview";
import { EditorAttachmentInfo } from "~frontend/ui/message/composer/attachments";
import { UploadingAttachmentPreview } from "~frontend/ui/message/composer/UploadingAttachmentPreview";
import { useUploadAttachments } from "~frontend/ui/message/composer/useUploadAttachments";
import { isMac } from "~frontend/utils/platformDetection";
import { useLocalStorageState } from "~frontend/utils/useLocalStorageState";
import { getNodesFromContentByType } from "~richEditor/content/helper";
import { RichEditorNode } from "~richEditor/content/types";
import { useFileDroppedInContext } from "~richEditor/DropFileContext";
import { Editor, getEmptyRichContent } from "~richEditor/RichEditor";
import { useDocumentFilesPaste } from "~richEditor/useDocumentFilePaste";
import { useBoolean } from "~shared/hooks/useBoolean";
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
function useMessageContentExamplePlaceholder(): string {
  const db = useDb();
  const user = useAssertCurrentUser();

  const teamMembers = db.teamMember.find(
    (teamMember) => teamMember.user_id !== user.id && teamMember.user !== null
  ).all;

  const exampleRequestBodyWithTeamMemberNamesMentioned = useMemo(() => {
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

  return exampleRequestBodyWithTeamMemberNamesMentioned;
}

export const NewRequest = observer(function NewRequest() {
  const editorRef = useRef<Editor>(null);
  const db = useDb();
  const messageContentExample = useMessageContentExamplePlaceholder();
  const router = useRouter();
  const [isSubmitting, { set: markAsSubmittingInProgress }] = useBoolean(false);

  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>([]);
  const { uploadAttachments, uploadingAttachments } = useUploadAttachments({
    onUploadFinish: (attachment) => attachmentsList.push(attachment),
  });

  useFileDroppedInContext((files) => {
    uploadAttachments(files);
  });

  useDocumentFilesPaste((files) => {
    uploadAttachments(files);
  });

  // Submitting can be done from the editor or from the topic input box
  useShortcut(
    ["Meta", "Enter"],
    () => {
      submit();
      // Captures and prevents the event from getting to the editor
      return true;
    },
    { isEnabled: !isSubmitting }
  );

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

  const hasTypedMessageContent = useMemo(() => !isEqual(messageContent, getEmptyRichContent()), [messageContent]);

  const hasTypedInAnything = useMemo(
    () => topicName !== "" || hasTypedMessageContent,
    [topicName, hasTypedMessageContent]
  );

  const [isValid, nextStepPromptLabel] = useMemo(() => {
    const submitShortcut = isMac() ? "⌘+Enter" : "Ctrl+Enter";

    if (topicName.length === 0) {
      return [false, "Please add a topic name before creating request"];
    }
    const mentionNodes = getNodesFromContentByType(messageContent, "mention");
    if (mentionNodes.length < 1) {
      return [false, "You should mention at least one teammate before creating request"];
    }
    return [true, `Hit ${submitShortcut} to create request`];
  }, [topicName, messageContent]);

  // Cleanup contents after route has changed
  useEffect(() => {
    router.events.on("routeChangeComplete", function cleanup() {
      // Don't erase contents if changed page by accident
      if (isSubmitting) {
        return;
      }
      setTopicName("");
      setMessageContent(getEmptyRichContent());
      attachmentsList.clear();
    });

    return () => {
      router.events.off("routeChangeComplete", noop);
    };
  }, [isSubmitting, setTopicName, setMessageContent, attachmentsList, router.events]);

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

    markAsSubmittingInProgress();

    runInAction(() => {
      const topic = db.topic.create({ name: topicName, slug: getAvailableSlugForTopicName(topicName) });
      const message = db.message.create({ content: messageContent, topic_id: topic.id, type: "TEXT" });

      attachments.forEach((attachment) => {
        db.attachment.update(attachment.uuid, { message_id: message.id });
      });

      routes.topic.push({ topicSlug: topic.slug });
    });
  }

  return (
    <UIHolder isEmpty={!hasTypedInAnything}>
      <UITopicNameInput
        autoFocus
        disabled={isSubmitting}
        value={topicName}
        onChangeText={setTopicName}
        placeholder={"Add topic"}
        onKeyPress={onEnterPressed(focusEditor)}
      />
      <NewRequestRichEditor
        ref={editorRef}
        isDisabled={isSubmitting}
        value={messageContent}
        onChange={setMessageContent}
        placeholder={messageContentExample}
        onSubmit={submit}
      />

      {(uploadingAttachments.length > 0 || attachments.length > 0) && (
        <UIAttachmentsPreviews>
          {attachments.map((attachment) => (
            <AttachmentPreview
              id={attachment.uuid}
              key={attachment.uuid}
              onRemoveRequest={() => {
                attachmentsList.filter((existingAttachment) => {
                  return existingAttachment.uuid !== attachment.uuid;
                });
              }}
            />
          ))}
          {uploadingAttachments.map(({ percentage }, index) => (
            <UploadingAttachmentPreview percentage={percentage} key={index} />
          ))}
        </UIAttachmentsPreviews>
      )}
      {hasTypedMessageContent && !isSubmitting && <UINextStepPrompt>{nextStepPromptLabel}</UINextStepPrompt>}
      {isSubmitting && <UINextStepPrompt>Creating new request...</UINextStepPrompt>}
    </UIHolder>
  );
});

const UIHolder = styled.div<{ isEmpty: boolean }>`
  padding: 40px;
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

  margin-top: 24px; ;
`;

const UIAttachmentsPreviews = styled.div<{}>`
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 120px);
  grid-template-rows: repeat(auto-fill, 120px);
  gap: 12px;
`;
