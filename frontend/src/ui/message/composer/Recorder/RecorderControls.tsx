import React, { RefObject, useState } from "react";
import { useInterval } from "react-use";
import styled from "styled-components";

import { BodyPortal } from "~ui/BodyPortal";
import { Button } from "~ui/buttons/Button";
import { Popover } from "~ui/popovers/Popover";
import { HStack } from "~ui/Stack";
import { theme } from "~ui/theme";

import { VideoPreview } from "./VideoPreview";

interface RecorderControlsProps {
  handlerRef: RefObject<HTMLElement>;
  onStop: () => void;
  onCancel: () => void;
  previewStream?: MediaStream | null;
  className?: string;
  flipVideoPreview?: boolean;
  showInCorner?: boolean;
}

function useElapsedTime() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useInterval(() => {
    setElapsedSeconds(elapsedSeconds + 1);
  }, 1000);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds - minutes * 60;
  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(seconds).padStart(2, "0");

  return `${minutesStr}:${secondsStr}`;
}

export const RecorderControls = styled<RecorderControlsProps>(
  ({ className, handlerRef, onStop, onCancel, previewStream, flipVideoPreview = false, showInCorner }) => {
    const elapsedTime = useElapsedTime();

    const controlsNode = (
      <UIHolder className={className}>
        {previewStream && <VideoPreview stream={previewStream} flip={flipVideoPreview} />}
        <UIControls gap={8} alignItems="center">
          <UIElapsedTime>{elapsedTime}</UIElapsedTime>

          <Button kind="transparent" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button onClick={() => onStop()}>Submit</Button>
        </UIControls>
      </UIHolder>
    );

    if (!showInCorner) {
      return (
        <Popover className={className} anchorRef={handlerRef} placement="top">
          {controlsNode}
        </Popover>
      );
    }

    return (
      <BodyPortal>
        <UICornerOfScreen>{controlsNode}</UICornerOfScreen>
      </BodyPortal>
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
  padding: 8px;

  background: ${theme.colors.layout.backgroundAccent};
  ${theme.radius.panel}
  ${theme.shadow.modal}
`;

const UIElapsedTime = styled.span<{}>`
  margin: 0 8px;
  min-width: 48px;
  text-align: left;
`;

const UICornerOfScreen = styled.div<{}>`
  position: fixed;
  bottom: 32px;
  left: 32px;
`;
