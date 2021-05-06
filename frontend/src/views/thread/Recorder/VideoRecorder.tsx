import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { VideoOutline } from "~ui/icons";
import { MediaDebugger } from "./MediaDebugger";
import { RecordButton } from "./RecordButton";
import { RecorderControls } from "./RecorderControls";
import { FullScreenCountdown } from "./FullScreenCountdown";
import { useReactMediaRecorder } from "./useReactMediaRecorder";
import { VideoSource, VideoSourcePicker } from "./VideoSourcePicker";

interface VideoRecorderProps {
  onRecorded: (blob: Blob) => void;
  className?: string;
}

const PureVideoRecorder = ({ className, onRecorded }: VideoRecorderProps) => {
  const [areControlsVisible, { set: showControls, unset: hideControls }] = useBoolean(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const {
    status,
    error,
    startRecording,
    stopRecording,
    previewStream,
    mediaBlobUrl,
    getMediaStream,
  } = useReactMediaRecorder({
    video: videoSource === VideoSource.CAMERA,
    screen: videoSource === VideoSource.SCREEN,
    audio: !!videoSource,
    acquireMediaOnDemand: true,
    onStop: (_url: string, blob: Blob) => setBlob(blob),
  });
  const [handlerRef, setHandlerRef] = useState<HTMLElement | null>(null);
  const [isSourcePickerVisible, { toggle: toggleSourcePicker }] = useBoolean(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  const doStartRecording = () => {
    setIsCountdownActive(false);
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

    getMediaStream().then(() => {
      if (videoSource === VideoSource.CAMERA) {
        setIsCountdownActive(true);
      }

      if (videoSource === VideoSource.SCREEN) {
        setIsCountdownActive(true);
      }
    });
  }, [videoSource]);

  const onCancel = () => {
    setIsCountdownActive(false);
    setIsDismissed(true);
    setVideoSource(null);
    stopRecording();
    hideControls();
  };

  const onStopRecording = () => {
    setIsDismissed(false);
    setVideoSource(null);
    stopRecording();
    hideControls();
  };

  useEffect(() => {
    if (!isDismissed && blob) {
      onRecorded(blob);
    }
  }, [isDismissed, blob]);

  return (
    <div className={className}>
      <RecordButton onClick={toggleSourcePicker} ref={setHandlerRef}>
        <VideoOutline />
      </RecordButton>
      <MediaDebugger status={status} error={error} mediaBlobUrl={mediaBlobUrl} />
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
