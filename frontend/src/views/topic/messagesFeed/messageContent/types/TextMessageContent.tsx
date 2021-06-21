import { useState } from "react";
import styled from "styled-components";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { TopicMessageBasicInfoFragment, TopicMessageDetailedInfoFragment } from "~gql";
import { RichEditor, EditorContent } from "~richEditor/RichEditor";
import { Button } from "~ui/buttons/Button";
import { TransparentButton } from "~ui/buttons/TransparentButton";
import { HStack } from "~ui/Stack";
import { richEditorContentCss } from "~richEditor/Theme";
import { useEqualEffect } from "~shared/hooks/useEqualEffect";
import { useShortcut } from "~frontend/../../ui/keyboard/useShortcut";

interface Props {
  message: TopicMessageDetailedInfoFragment;
  isInEditMode: boolean;
  onEditRequest(newContent: EditorContent): void;
  onEditCancelRequest(): void;
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

export function MessageText({ message, isInEditMode, onEditRequest, onEditCancelRequest }: Props) {
  // We want to allow editing the text before we'll submit changes to save it. Therefore let's keep 'dynamic' aka dirty
  // version of content as a local state.
  const [dirtyContent, setDirtyContent] = useState<EditorContent>(message.content);

  useEqualEffect(() => {
    // If in edit mode - never change the content even if it changed. It would erase current user edits.
    if (isInEditMode) {
      return;
    }

    setDirtyContent(message.content);
  }, [message.content]);

  useShortcut("Escape", () => {
    if (isInEditMode) {
      onEditCancelRequest();
    }
  });

  if (!isInEditMode) {
    return <UIHolder>{renderMessageContent(message)}</UIHolder>;
  }

  // TODO: Editor display logic should probably not be part of MessageText.

  return (
    <>
      <RichEditor value={dirtyContent} onChange={setDirtyContent} />
      <UIButtons gap={8} justifyContent="end">
        <TransparentButton onClick={onEditCancelRequest}>Cancel</TransparentButton>
        <Button
          onClick={() => {
            onEditRequest(dirtyContent);
          }}
        >
          Save
        </Button>
      </UIButtons>
    </>
  );
}

const UIHolder = styled.div`
  ${richEditorContentCss};
`;

const UIButtons = styled(HStack)`
  margin-top: 8px;
`;
