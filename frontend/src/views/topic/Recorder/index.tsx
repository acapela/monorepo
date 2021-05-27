import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { IconMic, IconMicSlash, IconVideoCamera } from "~ui/icons";
import { FullScreenCountdown } from "./FullScreenCountdown";
import { MediaSource } from "./MediaSource";
import { RecordButton } from "./RecordButton";
import { RecorderControls } from "./RecorderControls";
import { useReactMediaRecorder } from "./useReactMediaRecorder";
import { useRecorderErrors } from "./useRecorderErrors";
import { VideoSourcePicker } from "./VideoSourcePicker";

interface RecorderProps {
  className?: string;
  onRecordingReady: (files: File) => void;
}

function recordingBlobToFile(blob: Blob): File {
  /* e.g.: audio/webm;codecs=opus */
  const [mimeType] = blob.type.split(";");
  const [type, extension] = mimeType.split("/");
  const timestamp = new Date().getTime();
  const name = `${type.toLowerCase()}-recording-${timestamp}.${extension}`;
  const file = new File([blob], name, { lastModified: timestamp, type: mimeType });

  return file;
}

const PureRecorder = ({ className, onRecordingReady }: RecorderProps) => {
  const [isDismissed, { set: dismissRecording, unset: clearDismissedStatus }] = useBoolean(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [mediaSource, setMediaSource] = useState<MediaSource | null>(null);
  const [isVideoSourcePickerVisible, { unset: hideVideoSourcePicker, toggle: toggleVideoSourcePicker }] = useBoolean(
    false
  );
  const [isCountdownStarted, { set: startCountdown, unset: dismissCountdown }] = useBoolean(false);
  const popoverHandlerRef = useRef<HTMLDivElement>(null);
  const { status, startRecording, stopRecording, previewStream, getMediaStream, error } = useReactMediaRecorder({
    video: mediaSource === MediaSource.CAMERA,
    screen: mediaSource === MediaSource.SCREEN,
    audio: !!mediaSource,
    acquireMediaOnDemand: true,
    onStop: (_url: string, blob: Blob) => setBlob(blob),
  });
  const isRecording = !!mediaSource && status === "recording";
  const { get: getRecorderError, set: setRecorderError } = useRecorderErrors();
  const isUnsupportedBrowser = error === "unsupported_browser";

  const doStartRecording = () => {
    dismissCountdown();
    startRecording();
  };

  const doCancelRecording = () => {
    dismissCountdown();
    dismissRecording();
    setMediaSource(null);
  };

  const doStopRecording = () => {
    setMediaSource(null);
  };

  /* Handle Video Source Picker */
  const startVideoRecording = async (source: MediaSource) => {
    toggleVideoSourcePicker();
    setMediaSource(source);
  };

  const onVideoButtonClick = () => {
    if (isRecording) {
      doCancelRecording();
    }

    toggleVideoSourcePicker();
  };

  const onAudioButtonClick = () => {
    hideVideoSourcePicker();

    if (mediaSource === MediaSource.MICROPHONE && isRecording) {
      return doCancelRecording();
    }

    doCancelRecording();
    setMediaSource(MediaSource.MICROPHONE);
  };

  const onRecorded = async (blob: Blob) => {
    const file = recordingBlobToFile(blob);

    onRecordingReady(file);
  };

  useEffect(() => {
    if (!mediaSource) {
      return stopRecording();
    }

    clearDismissedStatus();
    setBlob(null);

    getMediaStream().then((success) => {
      if (!success) {
        /* This state is recoverable, possible to retry */
        if (mediaSource === MediaSource.SCREEN) {
          setMediaSource(null);
        }

        return;
      }

      if (mediaSource === MediaSource.MICROPHONE) {
        doStartRecording();
      } else {
        startCountdown();
      }
    });
  }, [mediaSource]);

  useEffect(() => {
    if (!isDismissed && blob) {
      onRecorded(blob);

      /* Reset the state for hot reloading in dev mode */
      setBlob(null);

      /* In case recording is forcefully stopped */
      setMediaSource(null);
    }
  }, [isDismissed, blob]);

  useEffect(() => {
    if (mediaSource && error) {
      /* This state is recoverable, no need to block the UI */
      if (mediaSource === MediaSource.SCREEN && error === "permission_denied") {
        return;
      }

      setRecorderError(mediaSource, error);
    }
  }, [mediaSource, error]);

  if (isUnsupportedBrowser) {
    return (
      <div className={className}>
        <RecordButton disabled title="Media recording is not supported by your browser">
          <IconMicSlash />
        </RecordButton>
      </div>
    );
  }

  return (
    <div className={className} ref={popoverHandlerRef}>
      <RecordButton
        onClick={onVideoButtonClick}
        tooltipLabel="Record video"
        disabled={!!getRecorderError(MediaSource.SCREEN) && !!getRecorderError(MediaSource.CAMERA)}
      >
        <IconVideoCamera />
      </RecordButton>
      <RecordButton
        onClick={onAudioButtonClick}
        tooltipLabel="Record audio"
        disabled={!!getRecorderError(MediaSource.MICROPHONE)}
        title={getRecorderError(MediaSource.MICROPHONE) ?? ""}
      >
        <IconMic />
      </RecordButton>
      {isVideoSourcePickerVisible && (
        <VideoSourcePicker
          handlerRef={popoverHandlerRef}
          onStartRecording={startVideoRecording}
          screenCaptureError={getRecorderError(MediaSource.SCREEN) ?? ""}
          cameraCaptureError={getRecorderError(MediaSource.CAMERA) ?? ""}
        />
      )}
      {isCountdownStarted && (
        <FullScreenCountdown seconds={3} onFinished={doStartRecording} onCancelled={doCancelRecording} />
      )}
      {isRecording && (
        <RecorderControls
          handlerRef={popoverHandlerRef}
          onStop={doStopRecording}
          onCancel={doCancelRecording}
          previewStream={mediaSource === MediaSource.MICROPHONE ? null : previewStream}
          flipVideoPreview={mediaSource === MediaSource.CAMERA}
          // cornered={mediaSource !== MediaSource.MICROPHONE}
        />
      )}
    </div>
  );
};

export const Recorder = styled(PureRecorder)`
  display: flex;
  flex-direction: row;

  ${RecordButton} {
    margin-right: 1rem;
  }
`;
