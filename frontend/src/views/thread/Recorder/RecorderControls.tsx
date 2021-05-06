import React, { CSSProperties, useState } from "react";
import { usePopper } from "react-popper";
import { useInterval } from "react-use";
import styled from "styled-components";
import { CloseOutline, StopCircle } from "~ui/icons";
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
  const [popperElement, setPopperElement] = useState<HTMLElement | null>();
  const { styles, attributes } = usePopper(handlerRef, popperElement, {
    placement: "top",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 5],
        },
      },
    ],
  });

  const popperStyles: CSSProperties = cornered ? { position: "fixed", left: "40px", bottom: "30px" } : styles.popper;

  const elapsedTime = useElapsedTime(isRecording);

  return (
    <div className={className} ref={setPopperElement} style={popperStyles} {...attributes.popper}>
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
  );
};

export const RecorderControls = styled(PureRecorderControls)`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;

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
  box-shadow: 0px 0.5rem 1rem rgb(0 0 0 / 8%);

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
