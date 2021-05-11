import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { MicOutline } from "~ui/icons";
import { RecordButton } from "./RecordButton";
import { RecorderControls } from "./RecorderControls";
import { useReactMediaRecorder } from "./useReactMediaRecorder";

interface AudioRecorderProps {
  onRecorded: (blob: Blob) => void;
  className?: string;
}

const PureAudioRecorder = ({ className, onRecorded }: AudioRecorderProps) => {
  const [isDismissed, { set: dismissRecording, unset: clearDismissedStatus }] = useBoolean(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const { status, startRecording, stopRecording, getMediaStream } = useReactMediaRecorder({
    audio: true,
    acquireMediaOnDemand: true,
    onStop: (_url: string, blob: Blob) => setBlob(blob),
  });
  const isRecording = status === "recording";
  const [handlerRef, setHandlerRef] = useState<HTMLElement | null>(null);

  const onCancel = () => {
    dismissRecording();
    stopRecording();
  };

  const onStopRecording = () => {
    clearDismissedStatus();
    stopRecording();
  };

  const onRecordButtonClick = async () => {
    if (isRecording) {
      onCancel();
    } else {
      setBlob(null);
      await getMediaStream();
      startRecording();
    }
  };

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
      {isRecording && <RecorderControls handlerRef={handlerRef} onStop={onStopRecording} onCancel={onCancel} />}
    </div>
  );
};

export const AudioRecorder = styled(PureAudioRecorder)`
  position: relative;
`;
