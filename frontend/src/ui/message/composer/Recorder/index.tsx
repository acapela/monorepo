import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { createTimeout } from "~frontend/../../shared/time";
import { useBoolean } from "~shared/hooks/useBoolean";
import { IconCamera, IconMic, IconMicSlash, IconMonitor, IconVideoCamera } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

import { FullScreenCountdown } from "./FullScreenCountdown";
import { MediaSource } from "./MediaSource";
import { RecordButton } from "./RecordButton";
import { RecorderControls } from "./RecorderControls";
import { useReactMediaRecorder } from "./useReactMediaRecorder";
import { useRecorderErrors } from "./useRecorderErrors";

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

export enum RecorderStatus {
  PermissionDenied = "permission_denied",
  Idle = "idle",
  AcquiringMedia = "acquiring_media",
  Recording = "recording",
  Stopping = "stopping",
  Stopped = "stopped",
}

export enum RecorderError {
  PermissionDenied = "permission_denied",
  NoRecorder = "recorder_error",
  ScreenCaptureUnsupported = "screen_capture_unsupported",
  UnsupportedBrowser = "unsupported_browser",
}

const COUNTDOWN_IN_SECONS = 3;

const PureRecorder = ({ className, onRecordingReady }: RecorderProps) => {
  const [isDismissed, { set: dismissRecording, unset: clearDismissedStatus }] = useBoolean(false);
  const [blob, setBlob] = useState<Blob | null>(null);

  const [isCountdownStarted, { set: startCountdown, unset: dismissCountdown }] = useBoolean(false);
  const popoverHandlerRef = useRef<HTMLDivElement>(null);

  const onStop = (_url: string, blob: Blob) => setBlob(blob);

  const [mediaSource, setMediaSource] = useState<MediaSource | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaChunks = useRef<Blob[]>([]);
  const mediaStream = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<RecorderStatus>(RecorderStatus.Idle);
  const [error, setError] = useState<RecorderError | null>(null);

  const getMediaStream = async (): Promise<boolean> => {
    setStatus(RecorderStatus.AcquiringMedia);

    const requiredMedia: MediaStreamConstraints = {
      audio: true,
      video: mediaSource === MediaSource.Camera,
    };

    try {
      const audioStream = await window.navigator.mediaDevices.getUserMedia(requiredMedia);

      if (mediaSource === MediaSource.Screen) {
        if (!window.navigator.mediaDevices.getDisplayMedia) {
          setError(RecorderError.ScreenCaptureUnsupported);
          return false;
        }

        const stream = (await window.navigator.mediaDevices.getDisplayMedia({
          video: false,
        })) as MediaStream;

        audioStream.getAudioTracks().forEach((audioTrack) => stream.addTrack(audioTrack));
        mediaStream.current = stream;
      } else {
        mediaStream.current = audioStream;
      }

      return true;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((error as any)?.name);
      return false;
    } finally {
      setStatus(RecorderStatus.Idle);
    }
  };

  useEffect(() => {
    if (!window.MediaRecorder) {
      return setError(RecorderError.UnsupportedBrowser);
    }
  }, []);

  // Media Recorder Handlers

  const startRecording = async () => {
    setError(null);

    if (!mediaSource) return;

    if (mediaStream.current) {
      // User can stop the stream using browser's own built-in 'Stop sharing' button.
      mediaStream.current.getVideoTracks().forEach((track) => (track.onended = stopRecording));
      mediaRecorder.current = new MediaRecorder(mediaStream.current, {
        mimeType:
          mediaSource === MediaSource.Camera || mediaSource === MediaSource.Screen
            ? "video/webm;codecs=opus"
            : "audio/webm;codecs=opus",
      });
      mediaRecorder.current.ondataavailable = onRecordingActive;
      mediaRecorder.current.onstop = onRecordingStop;
      mediaRecorder.current.onerror = () => {
        setError(RecorderError.NoRecorder);
        setStatus(RecorderStatus.Idle);
      };
      mediaRecorder.current.start();
      setStatus(RecorderStatus.Recording);
    }
  };

  const onRecordingActive = ({ data }: BlobEvent) => {
    mediaChunks.current.push(data);
  };

  const onRecordingStop = () => {
    const [chunk] = mediaChunks.current;
    const blob = new Blob(mediaChunks.current, { type: chunk.type });
    const url = URL.createObjectURL(blob);
    setStatus(RecorderStatus.Stopped);
    onStop(url, blob);
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      if (mediaRecorder.current.state !== "inactive") {
        setStatus(RecorderStatus.Stopping);
        mediaRecorder.current.stop();
        mediaStream.current?.getTracks().forEach((track) => track.stop());
        mediaChunks.current = [];
      }
    }
  };

  const previewStream = mediaStream.current ? new MediaStream(mediaStream.current.getVideoTracks()) : null;

  const isRecording = !!mediaSource && status === "recording";
  const { get: getRecorderError, set: setRecorderError } = useRecorderErrors();
  const isUnsupportedBrowser = error === RecorderError.UnsupportedBrowser;

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
    setMediaSource(source);

    const isRecordingEnabled = await getMediaStream();
    if (!isRecordingEnabled) {
      if (mediaSource === MediaSource.Screen) {
        setMediaSource(null);
      }

      return;
    }

    if (mediaSource === MediaSource.Microphone) {
      dismissCountdown();
      startRecording();
    } else {
      startCountdown();
      createTimeout(() => {
        dismissCountdown();
        startRecording();
      }, COUNTDOWN_IN_SECONS * 1000);
    }
  };

  const onVideoButtonClick = () => {
    if (isRecording) {
      doCancelRecording();
    }
  };

  const onAudioButtonClick = () => {
    if (mediaSource === MediaSource.Microphone && isRecording) {
      return doCancelRecording();
    }

    doCancelRecording();
    setMediaSource(MediaSource.Microphone);
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
  }, [clearDismissedStatus, mediaSource, stopRecording]);

  useEffect(() => {
    if (!isDismissed && blob) {
      onRecorded(blob);

      /* Reset the state for hot reloading in dev mode */
      setBlob(null);

      /* In case recording is forcefully stopped */
      setMediaSource(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDismissed, blob]);

  useEffect(() => {
    if (mediaSource && error) {
      /* This state is recoverable, no need to block the UI */
      if (mediaSource === MediaSource.Screen && error === RecorderError.PermissionDenied) {
        return;
      }

      setRecorderError(mediaSource, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <PopoverMenuTrigger
        tooltip="Record video..."
        options={[
          {
            label: "Record screen",
            icon: <IconMonitor />,
            onSelect: () => startVideoRecording(MediaSource.Screen),
          },
          {
            label: "Record with camera",
            icon: <IconCamera />,
            onSelect: () => startVideoRecording(MediaSource.Camera),
          },
        ]}
      >
        <RecordButton
          onClick={onVideoButtonClick}
          disabled={!!getRecorderError(MediaSource.Screen) && !!getRecorderError(MediaSource.Camera)}
        >
          <IconVideoCamera />
        </RecordButton>
      </PopoverMenuTrigger>
      <RecordButton
        onClick={onAudioButtonClick}
        tooltipLabel={isRecording ? undefined : "Start recording audio"}
        disabled={!!getRecorderError(MediaSource.Microphone)}
        title={getRecorderError(MediaSource.Microphone) ?? ""}
      >
        <IconMic />
      </RecordButton>

      <AnimatePresence>
        {isCountdownStarted && <FullScreenCountdown seconds={COUNTDOWN_IN_SECONS} onCancelled={doCancelRecording} />}
      </AnimatePresence>

      {isRecording && (
        <RecorderControls
          handlerRef={popoverHandlerRef}
          onStop={doStopRecording}
          onCancel={doCancelRecording}
          previewStream={mediaSource === MediaSource.Microphone ? null : previewStream}
          flipVideoPreview={mediaSource === MediaSource.Camera}
          showInCorner={mediaSource !== MediaSource.Microphone}
        />
      )}
    </div>
  );
};

export const Recorder = styled(PureRecorder)<{}>`
  display: flex;
  flex-direction: row;

  ${RecordButton} {
    margin-right: 1rem;
  }
`;
