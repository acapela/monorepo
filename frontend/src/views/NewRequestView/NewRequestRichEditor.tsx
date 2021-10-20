import { Editor, JSONContent } from "@tiptap/react";
import { noop } from "lodash";
import React from "react";
import styled from "styled-components";

import { getEmptyRichContent } from "~frontend/../../richEditor/RichEditor";
import { EditorAttachmentInfo } from "~frontend/message/composer/attachments";
import { MessageContentEditor } from "~frontend/message/composer/MessageContentComposer";
import { RichEditorNode } from "~richEditor/content/types";
import { namedForwardRef } from "~shared/react/namedForwardRef";

export interface Props {
  value: RichEditorNode;
  onChange?: (value: RichEditorNode) => void;
  placeholder?: string;
  isDisabled?: boolean;
  attachments: EditorAttachmentInfo[];
}

export const NewRequestRichEditor = namedForwardRef<Editor, Props>(function RichEditor(
  { value = getEmptyRichContent(), onChange, placeholder = "Write something...", isDisabled, attachments },
  ref
) {
  return (
    <UIHolder>
      <MessageContentEditor
        ref={ref}
        placeholder={placeholder}
        // readonly={isDisabled}
        content={value}
        onContentChange={onChange}
        attachments={[]}
        onAttachmentRemoveRequest={noop}
        onFilesSelected={noop}
      />
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  width: 100%;
  min-width: 500px;
`;
