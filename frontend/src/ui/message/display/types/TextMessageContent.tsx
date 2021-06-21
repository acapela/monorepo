import { useEffect, useState } from "react";
import styled from "styled-components";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { TopicMessageBasicInfoFragment, TopicMessageDetailedInfoFragment } from "~gql";
import { EditorContent } from "~richEditor/RichEditor";
import { richEditorContentCss } from "~richEditor/Theme";

interface Props {
  message: TopicMessageDetailedInfoFragment;
  isInEditMode: boolean;
  onEditRequest(newContent: EditorContent): void;
  onExitEditModeRequest(): void;
}

function renderMessageContent(message: TopicMessageBasicInfoFragment) {
  try {
    const converter = new QuillDeltaToHtmlConverter(message.content, {});

    const htmlContent = converter.convert();

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>;
  } catch (error) {
    return <div>Failed to display message content</div>;
  }
}

export function MessageText({ message, isInEditMode, onExitEditModeRequest }: Props) {
  return <UIHolder>{renderMessageContent(message)}</UIHolder>;
}

const UIHolder = styled.div`
  ${richEditorContentCss};
`;
