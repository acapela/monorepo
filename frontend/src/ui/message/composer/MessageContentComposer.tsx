import React from "react";
import styled from "styled-components";
import { AttachmentPreview } from "~frontend/ui/message/attachment/AttachmentPreview";
import { ATTACHMENT_PREVIEW_HEIGHT_PX } from "~frontend/ui/message/attachment/MessageAttachmentDisplayer";
import { RichEditor, RichEditorSubmitMode } from "~richEditor/RichEditor";
import { RichEditorContent } from "~richEditor/content/types";
import { EditorAttachmentInfo } from "./attachments";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";

interface Props {
  autofocusKey?: string;
  onSubmit?: () => void;
  content: RichEditorContent;
  onContentChange: (content: RichEditorContent) => void;
  attachments: EditorAttachmentInfo[];
  onFilesSelected: (files: File[]) => void;
  onAttachmentRemoveRequest: (attachmentId: string) => void;
  hideEditorSubmitButton?: boolean;
  additionalContent?: React.ReactNode;
  disableFileDrop?: boolean;
}

export const MessageContentEditor = ({
  autofocusKey,
  onSubmit,
  content,
  onContentChange,
  attachments,
  onFilesSelected,
  onAttachmentRemoveRequest,
  hideEditorSubmitButton,
  additionalContent = null,
  disableFileDrop,
}: Props) => {
  function getSubmitButtonMode(): RichEditorSubmitMode {
    if (hideEditorSubmitButton) return "hide";

    const canSubmit = attachments.length > 0 || !isRichEditorContentEmpty(content);

    if (canSubmit) return "enable";

    return "disable";
  }

  return (
    <RichEditor
      value={content}
      onChange={onContentChange}
      onFilesSelected={onFilesSelected}
      onSubmit={onSubmit}
      placeholder="Type here to start contributing..."
      autofocusKey={autofocusKey}
      submitMode={getSubmitButtonMode()}
      disableFileDrop={disableFileDrop}
      additionalTopContent={additionalContent}
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
};

const UIAttachmentsPreviews = styled.div`
  height: ${ATTACHMENT_PREVIEW_HEIGHT_PX}px;
  display: flex;
`;
