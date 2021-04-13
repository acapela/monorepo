import { useEffect, useState } from "react";
import styled from "styled-components";

interface Props {
  currentContent: string;
  isInEditMode: boolean;
  onEditRequest(newContent: string): void;
}

export function MessageText({ currentContent, isInEditMode, onEditRequest }: Props) {
  // We want to allow editing the text before we'll submit changes to save it. Therefore let's keep 'dynamic' aka dirty
  // version of content as a local state.
  const [dirtyContent, setDirtyContent] = useState(currentContent);

  useEffect(() => {
    setDirtyContent(currentContent);
  }, [currentContent]);

  if (!isInEditMode) {
    return <UIHolder>{dirtyContent}</UIHolder>;
  }

  return (
    <UIEditTextarea
      onBlur={() => {
        onEditRequest(dirtyContent);
      }}
      autoFocus
      value={dirtyContent}
      onChange={(event) => setDirtyContent(event.target.value)}
    />
  );
}

const UIHolder = styled.div``;

const UIEditTextarea = styled.textarea`
  border: none;
  width: 100%;
  background-color: #00000005;
  border-radius: 5px;
  padding: 0.5rem;
  outline: none;
`;
