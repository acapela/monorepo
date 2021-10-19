import React from "react";
import styled from "styled-components";

import { pickUserFiles } from "~frontend/../../shared/files";
import { IconButton } from "~frontend/../../ui/buttons/IconButton";
import { IconFile, IconPaperclip } from "~frontend/../../ui/icons";
import { theme } from "~ui/theme";

import { AudioRecordingButton } from "./AudioRecordingButton";

// Comment from @Heiki 18/Oct/2021
// Let's only display audio in the editor while video recording is buggy. We'll also integrate Loom eventually

interface RecorderProps {
  className?: string;
  onRecordingReady: (files: File) => void;
  onFilesPicked: (files: File[]) => void;
}

export const MessageTools = styled(({ className, onRecordingReady, onFilesPicked }: RecorderProps) => {
  return (
    <UIHolder className={className}>
      <AudioRecordingButton onRecordingReady={onRecordingReady} />
      <IconButton
        tooltip="Upload files..."
        icon={<IconPaperclip />}
        onClick={async () => {
          const files = await pickUserFiles();

          console.log({ files });

          if (!files?.length) return;

          onFilesPicked(files);
        }}
      />
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex-direction: row;
  ${theme.spacing.horizontalActionsSection.asGap};
`;
