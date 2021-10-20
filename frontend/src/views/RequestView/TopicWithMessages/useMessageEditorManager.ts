import { isEqual } from "lodash";
import { RefObject, useMemo } from "react";
import { useList } from "react-use";

import { usePersistedState } from "~frontend/hooks/useLocalStorageState";
import { EditorAttachmentInfo } from "~frontend/ui/message/composer/attachments";
import { useUploadAttachments } from "~frontend/ui/message/composer/useUploadAttachments";
import { RichEditorNode } from "~richEditor/content/types";
import { Editor, getEmptyRichContent } from "~richEditor/RichEditor";

interface UseMessageEditorManagerInput {
  editorRef: RefObject<Editor>;
  persistanceKey?: string;
}

export function useMessageEditorManager({ editorRef, persistanceKey }: UseMessageEditorManagerInput) {
  const [attachments, attachmentsList] = useList<EditorAttachmentInfo>([]);
  const { uploadAttachments, uploadingAttachments } = useUploadAttachments({
    onUploadFinish: (attachment) => attachmentsList.push(attachment),
  });

  const [content, setContent] = usePersistedState<RichEditorNode>({
    key: persistanceKey,
    initialValue: getEmptyRichContent(),
  });

  const hasTypedMessageContent = useMemo(() => !isEqual(content, getEmptyRichContent()), [content]);

  function focusEditor() {
    editorRef.current?.chain().focus("end").run();
  }

  function removeAttachmentById(attachmentId: string) {
    attachmentsList.filter((existingAttachment) => {
      return existingAttachment.uuid !== attachmentId;
    });
  }

  return {
    attachments,
    uploadAttachments,
    uploadingAttachments,
    content,
    setContent,
    removeAttachmentById,
    focusEditor,
    attachmentsList,
  };
}
