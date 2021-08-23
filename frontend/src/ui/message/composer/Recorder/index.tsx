import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import styled from "styled-components";

import { createTimeout } from "~frontend/../../shared/time";
import { useBoolean } from "~shared/hooks/useBoolean";
import { IconCamera, IconMic, IconMicSlash, IconMonitor, IconVideoCamera } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

import { FullScreenCountdown } from "./FullScreenCountdown";
import { MediaSource } from "./MediaSource";
import { RecordButton } from "./RecordButton";
import { RecorderControls } from "./RecorderControls";
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
  const [isCountdownStarted, { set: startCountdown, unset: dismissCountdown }] = useBoolean(false);
  const popoverHandlerRef = useRef<HTMLDivElement>(null);

  const mediaSource = useRef<MediaSource | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaChunks = useRef<Blob[]>([]);
  const mediaStream = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<RecorderStatus>(RecorderStatus.Idle);
  const [error, setError] = useState<RecorderError | null>(null);

  const resetRecorder = () => {
    mediaRecorder.current?.stop();
    mediaStream.current?.getTracks().forEach((track) => track.stop());
    mediaChunks.current = [];
  };

  const finishRecording = useCallback(() => {
    if (!mediaRecorder.current) return;

    if (mediaRecorder.current.state === "inactive") return;

    mediaSource.current = null;

    const [chunk] = mediaChunks.current;
    const blob = new Blob(mediaChunks.current, { type: chunk.type });
    setStatus(RecorderStatus.Stopped);
    const file = recordingBlobToFile(blob);
    onRecordingReady(file);

    setStatus(RecorderStatus.Stopping);
    resetRecorder();
  }, [onRecordingReady]);

  const cancelRecording = () => {
    dismissCountdown();
    resetRecorder();
  };

  const getMediaStream = async (): Promise<boolean> => {
    setStatus(RecorderStatus.AcquiringMedia);

    const constraints: MediaStreamConstraints = {
      audio: true,
      video: mediaSource.current === MediaSource.Camera,
    };

    try {
      const audioStream = await window.navigator.mediaDevices.getUserMedia(constraints);

      if (mediaSource.current === MediaSource.Screen) {
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
      setError(error?.name);

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

  const startRecording = async () => {
    setError(null);

    if (!mediaSource.current) return;

    if (mediaStream.current) {
      // User can stop the stream using browser's own built-in 'Stop sharing' button.
      mediaStream.current.getVideoTracks().forEach((track) => (track.onended = finishRecording));
      mediaRecorder.current = new MediaRecorder(mediaStream.current, {
        mimeType:
          mediaSource.current === MediaSource.Camera || mediaSource.current === MediaSource.Screen
            ? "video/webm;codecs=opus"
            : "audio/webm;codecs=opus",
      });
      mediaRecorder.current.ondataavailable = onRecordingActive;
      mediaRecorder.current.onstop = finishRecording;
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

  const previewStream = mediaStream.current ? new MediaStream(mediaStream.current.getVideoTracks()) : null;

  const isRecording = !!mediaSource.current && status === "recording";
  const { get: getRecorderError, set: setRecorderError } = useRecorderErrors();
  const isUnsupportedBrowser = error === RecorderError.UnsupportedBrowser;

  /* Handle Video Source Picker */
  const startVideoRecording = async (source: MediaSource) => {
    mediaSource.current = source;

    const isRecordingEnabled = await getMediaStream();
    if (!isRecordingEnabled) return;

    if (source === MediaSource.Microphone) {
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

  const onAudioButtonClick = () => {
    cancelRecording();
    if (mediaSource.current !== MediaSource.Microphone && !isRecording) {
      mediaSource.current = MediaSource.Microphone;
      startRecording();
    }
  };

  useEffect(() => {
    if (mediaSource.current && error) {
      /* This state is recoverable, no need to block the UI */
      if (mediaSource.current === MediaSource.Screen && error === RecorderError.PermissionDenied) {
        return;
      }

      setRecorderError(mediaSource.current, error);
    }
  }, [error, setRecorderError]);

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
          onClick={cancelRecording}
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
        {isCountdownStarted && <FullScreenCountdown seconds={COUNTDOWN_IN_SECONS} onCancelled={cancelRecording} />}
      </AnimatePresence>

      {isRecording && (
        <RecorderControls
          handlerRef={popoverHandlerRef}
          onStop={finishRecording}
          onCancel={cancelRecording}
          previewStream={mediaSource.current === MediaSource.Microphone ? null : previewStream}
          flipVideoPreview={mediaSource.current === MediaSource.Camera}
          showInCorner={mediaSource.current !== MediaSource.Microphone}
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
