import React, { useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import styled from "styled-components";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { MicOutline } from "~ui/icons";
import { RecordButton } from "./RecordButton";
import { RecorderPopover } from "./RecorderPopover";

interface AudioRecorderProps {
  onRecorded: (blob: Blob) => void;
  className?: string;
}

const PureAudioRecorder = ({ className, onRecorded }: AudioRecorderProps) => {
  const [isPopoverVisible, { set: showPopover, unset: hidePopover }] = useBoolean(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const { status, error, startRecording, stopRecording } = useReactMediaRecorder({
    audio: isPopoverVisible,
    onStop: (_url: string, blob: Blob) => setBlob(blob),
  });
  const [handlerRef, setHandlerRef] = useState<HTMLElement | null>(null);

  const onPopoverClose = () => {
    setIsDismissed(true);
    hidePopover();
  };

  const onStopRecording = () => {
    setIsDismissed(false);
    hidePopover();
  };

  const onRecordButtonClick = () => {
    if (isPopoverVisible) {
      onPopoverClose();
    } else {
      showPopover();
    }
  };

  useEffect(() => {
    if (isPopoverVisible) {
      setBlob(null);
      startRecording();
    } else {
      stopRecording();
    }
  }, [isPopoverVisible]);

  useEffect(() => {
    if (!isDismissed && blob) {
      onRecorded(blob);
    }
  }, [isDismissed, blob]);

  return (
    <div className={className}>
      <RecordButton onClick={onRecordButtonClick} ref={setHandlerRef}>
        <MicOutline />
      </RecordButton>
      <span>Status: {status}</span> | {error && <span>Error: {error}</span>}
      {isPopoverVisible && (
        <RecorderPopover
          isRecording={status === "recording"}
          handlerRef={handlerRef}
          onStop={onStopRecording}
          onClose={onPopoverClose}
        />
      )}
    </div>
  );
};

export const AudioRecorder = styled(PureAudioRecorder)`
  position: relative;
`;
