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
  const [areControlsVisible, { set: showControls, unset: hideControls }] = useBoolean(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const { status, startRecording, stopRecording, getMediaStream } = useReactMediaRecorder({
    audio: true,
    acquireMediaOnDemand: true,
    onStop: (_url: string, blob: Blob) => setBlob(blob),
  });
  const [handlerRef, setHandlerRef] = useState<HTMLElement | null>(null);

  const onCancel = () => {
    setIsDismissed(true);
    hideControls();
  };

  const onStopRecording = () => {
    setIsDismissed(false);
    hideControls();
  };

  const onRecordButtonClick = () => {
    if (areControlsVisible) {
      onCancel();
    } else {
      getMediaStream().then(() => {
        showControls();
      });
    }
  };

  useEffect(() => {
    if (areControlsVisible) {
      setBlob(null);
      startRecording();
    } else {
      stopRecording();
    }
  }, [areControlsVisible]);

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
      {areControlsVisible && (
        <RecorderControls
          isRecording={status === "recording"}
          handlerRef={handlerRef}
          onStop={onStopRecording}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};

export const AudioRecorder = styled(PureAudioRecorder)`
  position: relative;
`;
