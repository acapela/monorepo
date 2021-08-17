import React from "react";
import styled from "styled-components";

import { messageComposerExtensions } from "~frontend/message/extensions";
import { AttachmentPreview } from "~frontend/ui/message/attachment/AttachmentPreview";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";
import { RichEditorNode } from "~richEditor/content/types";
import { Editor, RichEditor, RichEditorSubmitMode } from "~richEditor/RichEditor";
import { namedForwardRef } from "~shared/react/namedForwardRef";

import { EditorAttachmentInfo } from "./attachments";

interface Props {
  autofocusKey?: string;
  onSubmit?: () => void;
  content: RichEditorNode;
  onContentChange: (content: RichEditorNode) => void;
  attachments: EditorAttachmentInfo[];
  onFilesSelected: (files: File[]) => void;
  onAttachmentRemoveRequest: (attachmentId: string) => void;
  hideEditorSubmitButton?: boolean;
  additionalContent?: React.ReactNode;
  isDisabled?: boolean;
  onEditorReady?: (editor: Editor) => void;
}

export const MessageContentEditor = namedForwardRef<Editor, Props>(function MessageContentEditor(
  {
    autofocusKey,
    onSubmit,
    content,
    onContentChange,
    attachments,
    onFilesSelected,
    onAttachmentRemoveRequest,
    hideEditorSubmitButton,
    additionalContent = null,
    isDisabled,
    onEditorReady,
  },
  ref
) {
  function getSubmitButtonMode(): RichEditorSubmitMode {
    if (hideEditorSubmitButton) return "hide";

    const canSubmit = attachments.length > 0 || !isRichEditorContentEmpty(content);

    if (canSubmit) return "enable";

    return "disable";
  }

  return (
    <RichEditor
      ref={ref}
      extensions={messageComposerExtensions}
      value={content}
      onChange={onContentChange}
      onFilesSelected={onFilesSelected}
      onSubmit={onSubmit}
      placeholder="Type here to start contributing..."
      autofocusKey={autofocusKey}
      submitMode={getSubmitButtonMode()}
      isDisabled={isDisabled}
      additionalTopContent={additionalContent}
      onEditorReady={onEditorReady}
      additionalBottomContent={
        attachments.length > 0 && (
          <UIAttachmentsPreviews>
            {attachments.map((attachment) => {
              return (
                <AttachmentPreview
                  id={attachment.uuid}
                  key={attachment.uuid}
                  onRemoveRequest={() => onAttachmentRemoveRequest(attachment.uuid)}
                />
              );
            })}
          </UIAttachmentsPreviews>
        )
      }
    />
  );
});

const UIAttachmentsPreviews = styled.div<{}>`
  display: flex;
  gap: 12px;
`;
