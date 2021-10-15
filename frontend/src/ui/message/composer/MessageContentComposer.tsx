import React from "react";
import styled, { StylesPart } from "styled-components";

import { messageComposerExtensions } from "~frontend/message/extensions";
import { AttachmentPreview } from "~frontend/ui/message/attachment/AttachmentPreview";
import { RichEditorNode } from "~richEditor/content/types";
import { Editor, RichEditor } from "~richEditor/RichEditor";
import { namedForwardRef } from "~shared/react/namedForwardRef";

import { EditorAttachmentInfo, EditorUploadingAttachmentInfo } from "./attachments";
import { UploadingAttachmentPreview } from "./UploadingAttachmentPreview";

interface Props {
  autofocusKey?: string;
  onSubmit?: () => void;
  content: RichEditorNode;
  onContentChange: (content: RichEditorNode) => void;
  uploadingAttachments?: EditorUploadingAttachmentInfo[];
  attachments: EditorAttachmentInfo[];
  onFilesSelected: (files: File[]) => void;
  onAttachmentRemoveRequest: (attachmentId: string) => void;
  additionalContent?: React.ReactNode;
  isDisabled?: boolean;
  onEditorReady?: (editor: Editor) => void;
  customEditFieldStyles?: StylesPart;
}

export const MessageContentEditor = namedForwardRef<Editor, Props>(function MessageContentEditor(
  {
    autofocusKey,
    onSubmit,
    content,
    onContentChange,
    uploadingAttachments = [],
    attachments,
    onFilesSelected,
    onAttachmentRemoveRequest,
    additionalContent = null,
    isDisabled,
    onEditorReady,
    customEditFieldStyles,
  },
  ref
) {
  return (
    <RichEditor
      ref={ref}
      extensions={messageComposerExtensions}
      value={content}
      onChange={onContentChange}
      onFilesSelected={onFilesSelected}
      onSubmit={onSubmit}
      placeholder="Your feedback on this topic…"
      autofocusKey={autofocusKey}
      isDisabled={isDisabled}
      additionalTopContent={additionalContent}
      onEditorReady={onEditorReady}
      customEditFieldStyles={customEditFieldStyles}
      additionalBottomContent={
        (uploadingAttachments.length > 0 || attachments.length > 0) && (
          <UIAttachmentsPreviews>
            {attachments.map((attachment) => (
              <AttachmentPreview
                id={attachment.uuid}
                key={attachment.uuid}
                onRemoveRequest={() => onAttachmentRemoveRequest(attachment.uuid)}
              />
            ))}
            {uploadingAttachments.map(({ percentage }, index) => (
              <UploadingAttachmentPreview percentage={percentage} key={index} />
            ))}
          </UIAttachmentsPreviews>
        )
      }
    />
  );
});

const UIAttachmentsPreviews = styled.div<{}>`
  display: grid;
  grid-template-columns: repeat(auto-fill, 120px);
  grid-template-rows: repeat(auto-fill, 120px);
  gap: 12px;
`;
