import React, { RefObject, useState } from "react";
import { useInterval } from "react-use";
import styled from "styled-components";
import { IconCrossCircle, IconStopCircle } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";
import { VideoPreview } from "./VideoPreview";

interface RecorderControlsProps {
  handlerRef: RefObject<HTMLElement>;
  onStop: () => void;
  onCancel: () => void;
  previewStream?: MediaStream | null;
  className?: string;
  flipVideoPreview?: boolean;
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
  ({ className, handlerRef, onStop, onCancel, previewStream, flipVideoPreview = false }: RecorderControlsProps) => {
    const elapsedTime = useElapsedTime();

    console.log({ handlerRef });

    return (
      <Popover className={className} anchorRef={handlerRef} placement="top">
        <UIHolder className={className}>
          {previewStream && <VideoPreview stream={previewStream} flip={flipVideoPreview} />}
          <UIControls>
            <UIElapsedTime>{elapsedTime}</UIElapsedTime>
            <UIStopButton onClick={() => onStop()}>
              <IconStopCircle />
            </UIStopButton>
            <UIVerticalSeparator />
            <UICloseButton onClick={() => onCancel()}>
              <IconCrossCircle />
            </UICloseButton>
          </UIControls>
        </UIHolder>
      </Popover>
    );
  }
)``;

const UIHolder = styled.div`
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
  background: #f8f8f8;
  padding: 0.5rem;
  border-radius: 0.625rem;
  user-select: none;

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
