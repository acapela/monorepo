import React from "react";
import styled from "styled-components";

import { pickUserFiles } from "~shared/files";
import { IconButton } from "~ui/buttons/IconButton";
import { IconPaperclip } from "~ui/icons";
import { useIsPhone } from "~ui/responsive";
import { theme } from "~ui/theme";

import { AudioRecordingButton } from "./AudioRecordingButton";

// Comment from @Heiki 18/Oct/2021
// Let's only display audio in the editor while video recording is buggy. We'll also integrate Loom eventually

interface RecorderProps {
  className?: string;
  onRecordingReady?: (files: File) => void;
  onFilesPicked?: (files: File[]) => void;
}

export const MessageTools = styled(({ className, onRecordingReady, onFilesPicked }: RecorderProps) => {
  const isPhone = useIsPhone();
  return (
    <UIHolder className={className}>
      {!isPhone && onRecordingReady && <AudioRecordingButton onRecordingReady={onRecordingReady} />}
      {onFilesPicked && (
        <IconButton
          tooltip="Upload files..."
          icon={<IconPaperclip />}
          onClick={async () => {
            const files = await pickUserFiles();

            if (!files?.length) return;

            onFilesPicked(files);
          }}
        />
      )}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex-direction: row;
  ${theme.spacing.horizontalActionsSection.asGap};
`;
