import React, { useState } from "react";
import { usePopper } from "react-popper";
import { useHarmonicIntervalFn } from "react-use";
import styled from "styled-components";
import { CloseOutline, StopCircle } from "~ui/icons";

interface RecorderPopoverProps {
  handlerRef: HTMLElement | null;
  isRecording: boolean;
  onStop: () => void;
  onClose: () => void;
  className?: string;
}

function useElapsedTime(isRecording: boolean) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useHarmonicIntervalFn(() => {
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

const PureRecorderPopover = ({ className, handlerRef, onStop, onClose, isRecording }: RecorderPopoverProps) => {
  const [popperElement, setPopperElement] = useState<HTMLElement | null>();
  const { styles, attributes } = usePopper(handlerRef, popperElement, { placement: "top" });

  const elapsedTime = useElapsedTime(isRecording);

  return (
    <div className={className} ref={setPopperElement} style={styles.popper} {...attributes.popper}>
      <UIElapsedTime>{elapsedTime}</UIElapsedTime>
      <UIStopButton onClick={() => onStop()}>
        <StopCircle />
      </UIStopButton>
      <UIVerticalSeparator />
      <UICloseButton onClick={() => onClose()}>
        <CloseOutline />
      </UICloseButton>
    </div>
  );
};

export const RecorderPopover = styled(PureRecorderPopover)`
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
