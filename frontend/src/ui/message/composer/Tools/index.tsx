import React from "react";
import styled from "styled-components";

import { theme } from "~ui/theme";

import { AudioRecordingButton } from "./AudioRecordingButton";

// Comment from @Heiki 18/Oct/2021
// Let's only display audio in the editor while video recording is buggy. We'll also integrate Loom eventually

interface RecorderProps {
  className?: string;
  onRecordingReady: (files: File) => void;
}

export const MessageTools = styled(({ className, onRecordingReady }: RecorderProps) => {
  return (
    <UIHolder className={className}>
      <AudioRecordingButton onRecordingReady={onRecordingReady} />
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex-direction: row;
  ${theme.spacing.horizontalActionsSection.asGap};
`;
