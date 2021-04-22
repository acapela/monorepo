import { useEffect, useState } from "react";
import styled from "styled-components";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { ThreadMessageBasicInfoFragment } from "~frontend/gql";
import { RichEditor, EditorContent } from "~richEditor/RichEditor";

interface Props {
  message: ThreadMessageBasicInfoFragment;
  isInEditMode: boolean;
  onEditRequest(newContent: EditorContent): void;
}

function renderMessageContent(message: ThreadMessageBasicInfoFragment) {
  const converter = new QuillDeltaToHtmlConverter(message.content, {});

  const htmlContent = converter.convert();

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>;
}

export function MessageText({ message, isInEditMode, onEditRequest }: Props) {
  // We want to allow editing the text before we'll submit changes to save it. Therefore let's keep 'dynamic' aka dirty
  // version of content as a local state.
  const [dirtyContent, setDirtyContent] = useState<EditorContent>(message.content);

  useEffect(() => {
    setDirtyContent(message.content);
  }, [message.content]);

  if (!isInEditMode) {
    return <UIHolder>{renderMessageContent(message)}</UIHolder>;
  }

  return (
    <>
      <RichEditor value={dirtyContent} onChange={setDirtyContent} />
      <button
        onClick={() => {
          onEditRequest(dirtyContent);
        }}
      >
        Save
      </button>
    </>
  );
}

const UIHolder = styled.div`
  line-height: 1.25;

  ol {
    list-style-type: decimal;
  }

  ul {
    list-style-type: disc;
  }

  ul,
  ol {
    list-style-position: inside;
  }

  li {
    ::marker {
      margin-right: 0.25rem;
    }
    ul,
    ol {
      padding-left: 1rem;
    }
  }

  blockquote {
    border-left: 2px solid #888;
    padding: 0.5rem 0 0.5rem 0.5rem;
  }

  strong {
    font-weight: bold;
  }
`;
