import React, { RefObject, useState } from "react";
import { useInterval } from "react-use";
import styled from "styled-components";
import { Button } from "~ui/buttons/Button";
import { TransparentButton } from "~ui/buttons/TransparentButton";
import { HStack } from "~ui/Stack";
import { borderRadius, shadow } from "~ui/baseStyles";
import { BodyPortal } from "~ui/BodyPortal";
import { Popover } from "~ui/popovers/Popover";
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

export const RecorderControls = styled(
  ({
    className,
    handlerRef,
    onStop,
    onCancel,
    previewStream,
    flipVideoPreview = false,
    showInCorner,
  }: RecorderControlsProps) => {
    const elapsedTime = useElapsedTime();

    const controlsNode = (
      <UIHolder className={className}>
        {previewStream && <VideoPreview stream={previewStream} flip={flipVideoPreview} />}
        <UIControls gap={8} alignItems="center">
          <UIElapsedTime>{elapsedTime}</UIElapsedTime>

          <TransparentButton onClick={() => onCancel()}>Cancel</TransparentButton>
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

const UIHolder = styled.div`
  ${VideoPreview} {
    margin-bottom: 1rem;
  }
`;

const UIControls = styled(HStack)`
  background: #f8f8f8;
  padding: 0.5rem;
  ${borderRadius.modal}
  user-select: none;
  ${shadow.modal}
`;

const UIElapsedTime = styled.span`
  margin: 0 0.5rem;
  min-width: 48px;
  text-align: left;
  font-weight: 400;
  line-height: 1.125rem;
  color: #292829;
`;

const UICornerOfScreen = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 2rem;
`;
