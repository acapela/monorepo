import React, { useState } from "react";
import { useInterval } from "react-use";
import styled from "styled-components";
import { CloseOutline, StopCircle } from "~ui/icons";
import { Popover } from "~ui/Popover";
import { VideoPreview } from "./VideoPreview";

interface RecorderControlsProps {
  handlerRef: HTMLElement | null;
  isRecording: boolean;
  onStop: () => void;
  onCancel: () => void;
  previewStream?: MediaStream | null;
  className?: string;
  cornered?: boolean;
  flipVideoPreview?: boolean;
}

function useElapsedTime(isRecording: boolean) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useInterval(() => {
    if (isRecording) {
      setElapsedSeconds(elapsedSeconds + 1);
    }
  }, 1000);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds - minutes * 60;
  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(seconds).padStart(2, "0");

  return `${minutesStr}:${secondsStr}`;
}

const PureRecorderControls = ({
  className,
  handlerRef,
  onStop,
  onCancel,
  isRecording,
  previewStream,
  cornered = false,
  flipVideoPreview = false,
}: RecorderControlsProps) => {
  const elapsedTime = useElapsedTime(isRecording);

  return (
    <Popover className={className} handlerRef={handlerRef} cornered={cornered}>
      <div className={className}>
        <VideoPreview stream={previewStream} flip={flipVideoPreview} />
        <UIControls>
          <UIElapsedTime>{elapsedTime}</UIElapsedTime>
          <UIStopButton onClick={() => onStop()}>
            <StopCircle />
          </UIStopButton>
          <UIVerticalSeparator />
          <UICloseButton onClick={() => onCancel()}>
            <CloseOutline />
          </UICloseButton>
        </UIControls>
      </div>
    </Popover>
  );
};

export const RecorderControls = styled(PureRecorderControls)`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${VideoPreview} {
    margin-bottom: 1rem;
  }
`;

const UIControls = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 0.5rem;
  border-radius: 0.625rem;
  user-select: none;
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 8%);

  button {
    display: inline-block;
    background: transparent;
    padding: 0;
  }
`;

const UIElapsedTime = styled.span`
  margin: 0 0.5rem;
  min-width: 40px;
  text-align: left;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: #292829;
`;

const UIStopButton = styled.button`
  margin: 0 0.5rem;
  svg {
    fill: #ea1537;
  }
`;

const UIVerticalSeparator = styled.div`
  display: inline-block;
  height: 1rem;
  width: 1px;
  background-color: #eae9ea;
`;

const UICloseButton = styled.button`
  margin: 0 0.5rem;
  svg {
    fill: #000;
  }
`;
