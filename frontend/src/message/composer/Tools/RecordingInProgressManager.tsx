import React from "react";
import styled from "styled-components";

import { styledObserver } from "~shared/component";
import { StreamRecording } from "~shared/recording/recordStream";
import { Button } from "~ui/buttons/Button";
import { HStack } from "~ui/Stack";
import { theme } from "~ui/theme";

import { VideoPreview } from "./VideoPreview";

interface RecorderControlsProps {
  recording: StreamRecording;
  onFinished: (file: File | null) => void;
  className?: string;
}

function formatDurationToElapsedTime(elapsedSeconds: number) {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds - minutes * 60;
  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(seconds).padStart(2, "0");

  return `${minutesStr}:${secondsStr}`;
}

export const RecordingInProgressManager = styledObserver<RecorderControlsProps>(
  ({ className, recording, onFinished }) => {
    return (
      <UIHolder className={className}>
        <UIControls gap={8} alignItems="center">
          <UIElapsedTime>{formatDurationToElapsedTime(recording.duration.time)}</UIElapsedTime>

          <Button
            kind="transparent"
            onClick={async () => {
              await recording.finish();

              onFinished(null);
            }}
          >
            Cancel
          </Button>
          <Button
            kind="primary"
            onClick={async () => {
              const resultFile = await recording.finish();

              onFinished(resultFile);
            }}
          >
            Submit
          </Button>
        </UIControls>
      </UIHolder>
    );
  }
)``;

const UIHolder = styled.div<{}>`
  ${VideoPreview} {
    margin-bottom: 16px;
  }

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UIControls = styled(HStack)<{}>`
  user-select: none;
  ${theme.box.popover};

  ${theme.colors.panels.secondaryPopover.asBgWithReadableText};
  ${theme.radius.panel};
  ${theme.shadow.modal};
  ${theme.spacing.actions.asGap};
`;

const UIElapsedTime = styled.span<{}>`
  min-width: 48px;
`;
