import { JSONContent } from "@tiptap/core";
import { RefObject, useMemo } from "react";
import { useList } from "react-use";

import { usePersistedState } from "~frontend/hooks/usePersistedState";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";
import { RichEditorNode } from "~richEditor/content/types";
import { Editor, getEmptyRichContent } from "~richEditor/RichEditor";

import { EditorAttachmentInfo } from "./attachments";
import { useUploadAttachments } from "./useUploadAttachments";

interface UseMessageEditorManagerInput {
  editorRef: RefObject<Editor>;
  initialValue?: JSONContent;
  persistanceKey?: string;
}

export function useMessageEditorManager({
  editorRef,
  persistanceKey,
  initialValue = getEmptyRichContent(),
}: UseMessageEditorManagerInput) {
  const [attachmentsDrafts, attachmentsList] = useList<EditorAttachmentInfo>([]);
  const { uploadAttachments, uploadingAttachments } = useUploadAttachments({
    onUploadFinish: (attachment) => attachmentsList.push(attachment),
  });

  const [content, setContent, clearPersistedContent] = usePersistedState<RichEditorNode>({
    key: persistanceKey,
    initialValue,
  });

  const hasAnyTextContent = useMemo(() => !isRichEditorContentEmpty(content), [content]);

  const isEmptyWithNoAttachments = !hasAnyTextContent && attachmentsDrafts.length === 0;

  function focusEditor() {
    editorRef.current?.chain().focus("end").run();
  }

  function removeAttachmentById(attachmentId: string) {
    attachmentsList.filter((existingAttachment) => {
      return existingAttachment.uuid !== attachmentId;
    });
  }

  return {
    clearPersistedContent,
    isEmptyWithNoAttachments,
    hasAnyTextContent,
    attachmentsDrafts,
    uploadAttachments,
    uploadingAttachments,
    content,
    setContent,
    removeAttachmentById,
    focusEditor,
    attachmentsList,
  };
}
