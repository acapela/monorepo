import type { Editor } from "@tiptap/react";
import { isEqual, noop, range } from "lodash";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef } from "react";
import { useList } from "react-use";
import styled, { css } from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { useLocalStorageState } from "~frontend/hooks/useLocalStorageState";
import { AttachmentPreview } from "~frontend/ui/message/attachment/AttachmentPreview";
import { EditorAttachmentInfo } from "~frontend/ui/message/composer/attachments";
import { UploadingAttachmentPreview } from "~frontend/ui/message/composer/UploadingAttachmentPreview";
import { useUploadAttachments } from "~frontend/ui/message/composer/useUploadAttachments";
import { getNodesFromContentByType } from "~richEditor/content/helper";
import { RichEditorNode } from "~richEditor/content/types";
import { useFileDroppedInContext } from "~richEditor/DropFileContext";
import { FileInput } from "~richEditor/FileInput";
import { getEmptyRichContent } from "~richEditor/RichEditor";
import { useDocumentFilesPaste } from "~richEditor/useDocumentFilePaste";
import { getUniqueMentionDataFromContent } from "~shared/editor/mentions";
import { useBoolean } from "~shared/hooks/useBoolean";
import { runUntracked } from "~shared/mobxUtils";
import { routes } from "~shared/routes";
import { slugify } from "~shared/slugify";
import { Button } from "~ui/buttons/Button";
import { FreeTextInput as TransparentTextInput } from "~ui/forms/FreeInputText";
import { onEnterPressed } from "~ui/forms/utils";
import { IconFolder } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";

import { CreateRequestPrompt } from "./CreateRequestPrompt";
import { NewRequestRichEditor } from "./NewRequestRichEditor";

/**
 * Creates a placeholder with up to 2 random team members mentioned
 * The current user won't be included
 */
function useMessageContentExamplePlaceholder(): string {
  const db = useDb();
  const user = useAssertCurrentUser();

  const teamMembers = db.teamMember.query(
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
        displayNames += `@${randomTeamMember.user?.name || "???"} `;
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
  const sendShortcutDescription = useShortcut(["Meta", "Enter"], () => {
    if (isSubmitting) {
      return true;
    }

    submit();
    // Captures and prevents the event from getting to the editor
    return true;
  });

  const [topicName, setTopicName] = useLocalStorageState<string>({
    key: "topic-name-draft-for-new-request",
    initialValue: "",
  });

  const [messageContent, setMessageContent] = useLocalStorageState<RichEditorNode>({
    key: "message-draft-for-new-request",
    initialValue: getEmptyRichContent(),
  });

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
    return [true, `Hit ${sendShortcutDescription} to create request`];
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const newMessage = db.message.create({ content: messageContent, topic_id: topic.id, type: "TEXT" });

      for (const { userId, type } of getUniqueMentionDataFromContent(messageContent)) {
        db.task.create({ message_id: newMessage.id, user_id: userId, type });
      }

      attachments.forEach((attachment) => {
        db.attachment.update(attachment.uuid, { message_id: newMessage.id });
      });

      router.push(routes.topic({ topicSlug: topic.slug }));
    });
  }

  return (
    <UIHolder>
      <UIContentHolder isEmpty={!hasTypedInAnything}>
        {!hasTypedInAnything && <UIFlyingCreateARequestLabel />}
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
      </UIContentHolder>
      <UIFooter>
        <FileInput onFileSelected={(file) => uploadAttachments([file])}>
          <Button kind="secondary" icon={<IconFolder />} iconAtStart>
            Add File
          </Button>
        </FileInput>
      </UIFooter>
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

const UIFooter = styled.div<{}>`
  position: absolute;
  bottom: 0;

  padding: 16px;

  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  border-color: rgba(0, 0, 0, 0.05);
  border-style: solid;
  border-top-width: 1px;
`;
