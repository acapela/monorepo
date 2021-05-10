import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { VideoOutline } from "~ui/icons";
import { FullScreenCountdown } from "./FullScreenCountdown";
import { RecordButton } from "./RecordButton";
import { RecorderControls } from "./RecorderControls";
import { useReactMediaRecorder } from "./useReactMediaRecorder";
import { VideoSource, VideoSourcePicker } from "./VideoSourcePicker";

interface VideoRecorderProps {
  onRecorded: (blob: Blob) => void;
  className?: string;
}

const PureVideoRecorder = ({ className, onRecorded }: VideoRecorderProps) => {
  const [areControlsVisible, { set: showControls, unset: hideControls }] = useBoolean(false);
  const [isDismissed, { set: dismissRecording, unset: clearDismissedStatus }] = useBoolean(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const { status, startRecording, stopRecording, previewStream, getMediaStream } = useReactMediaRecorder({
    video: videoSource === VideoSource.CAMERA,
    screen: videoSource === VideoSource.SCREEN,
    audio: !!videoSource,
    acquireMediaOnDemand: true,
    onStop: (_url: string, blob: Blob) => setBlob(blob),
  });
  const [handlerRef, setHandlerRef] = useState<HTMLElement | null>(null);
  const [isSourcePickerVisible, { toggle: toggleSourcePicker }] = useBoolean(false);
  const [isCountdownActive, { set: startCountdown, unset: dismissCountdown }] = useBoolean(false);

  const doStartRecording = () => {
    dismissCountdown();
    setBlob(null);
    showControls();
    startRecording();
  };

  const onStartRecording = async (source: VideoSource) => {
    toggleSourcePicker();
    setVideoSource(source);
  };

  useEffect(() => {
    if (!videoSource) {
      return;
    }

    clearDismissedStatus();

    getMediaStream().then(() => {
      if (videoSource === VideoSource.CAMERA) {
        startCountdown();
      }

      if (videoSource === VideoSource.SCREEN) {
        startCountdown();
      }
    });
  }, [videoSource]);

  const onCancel = () => {
    dismissCountdown();
    dismissRecording();
    setVideoSource(null);
    stopRecording();
    hideControls();
  };

  const onStopRecording = () => {
    setVideoSource(null);
    stopRecording();
    hideControls();
  };

  useEffect(() => {
    if (!isDismissed && blob) {
      onRecorded(blob);

      // In case recording is forcefully stopped
      setVideoSource(null);
      hideControls();
    }
  }, [isDismissed, blob]);

  return (
    <div className={className}>
      <RecordButton onClick={toggleSourcePicker} ref={setHandlerRef}>
        <VideoOutline />
      </RecordButton>
      {isSourcePickerVisible && <VideoSourcePicker handlerRef={handlerRef} onStartRecording={onStartRecording} />}
      {isCountdownActive && <FullScreenCountdown seconds={3} onFinished={doStartRecording} onCancelled={onCancel} />}
      {areControlsVisible && (
        <RecorderControls
          isRecording={status === "recording"}
          handlerRef={handlerRef}
          onStop={onStopRecording}
          onCancel={onCancel}
          previewStream={previewStream}
          flipVideoPreview={videoSource === VideoSource.CAMERA}
          cornered
        />
      )}
    </div>
  );
};

export const VideoRecorder = styled(PureVideoRecorder)``;
