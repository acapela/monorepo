import { ReactNode, useRef } from "react";
import styled from "styled-components";

interface Props {
  onFileSelected?: (file: File) => void;
  children: ReactNode;
}

export function FileInput({ children, onFileSelected }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePickFile() {
    fileInputRef.current?.click();
  }

  return (
    <UIHolder onClick={handlePickFile}>
      {children}
      <UIFileInput
        ref={fileInputRef}
        type="file"
        value={""}
        onChange={(event) => {
          const file = event.target.files?.item(0);

          if (!file) return;

          onFileSelected?.(file);
        }}
      />
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>``;

const UIFileInput = styled.input<{}>`
  display: none;
`;
