import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { MicOutline } from "~ui/icons";
import { MediaDebugger } from "./MediaDebugger";
import { RecordButton } from "./RecordButton";
import { RecorderPopover } from "./RecorderPopover";
import { useReactMediaRecorder } from "./useReactMediaRecorder";

interface AudioRecorderProps {
  onRecorded: (blob: Blob) => void;
  className?: string;
}

const PureAudioRecorder = ({ className, onRecorded }: AudioRecorderProps) => {
  const [isPopoverVisible, { set: showPopover, unset: hidePopover }] = useBoolean(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const { status, error, startRecording, stopRecording, getMediaStream, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
    acquireMediaOnDemand: true,
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
      getMediaStream().then(() => {
        showPopover();
      });
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
      <MediaDebugger status={status} error={error} mediaBlobUrl={mediaBlobUrl} />
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
