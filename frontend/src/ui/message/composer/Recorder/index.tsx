import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

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
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<RecorderError | null>(null);

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current?.state !== "inactive") {
      mediaRecorder.current?.stop();
    }

    mediaStream.current?.getTracks().forEach((track) => track.stop());
  };

  const resetRecorder = () => {
    mediaSource.current = null;
    mediaChunks.current = [];
    setIsRecording(false);
  };

  const finishRecording = () => {
    const blob = new Blob(mediaChunks.current, { type: mediaChunks.current[0].type });
    resetRecorder();

    const file = recordingBlobToFile(blob);
    onRecordingReady(file);
  };

  const cancelRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.onstop = (() => null)
    }

    dismissCountdown();
    stopRecording();
    resetRecorder();
  };

  const getMediaStream = async (): Promise<boolean> => {
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
      mediaStream.current.getVideoTracks().forEach((track) => (track.onended = stopRecording));
      mediaRecorder.current = new MediaRecorder(mediaStream.current, {
        mimeType:
          mediaSource.current === MediaSource.Camera || mediaSource.current === MediaSource.Screen
            ? "video/webm;codecs=opus"
            : "audio/webm;codecs=opus",
      });
      mediaRecorder.current.ondataavailable = ({ data }: BlobEvent) => {
        mediaChunks.current.push(data);
      };
      mediaRecorder.current.onstop = finishRecording;
      mediaRecorder.current.onerror = () => {
        setError(RecorderError.NoRecorder);
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    }
  };

  const previewStream = mediaStream.current ? new MediaStream(mediaStream.current.getVideoTracks()) : null;

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
      setTimeout(() => {
        dismissCountdown();
        if (mediaSource.current) {
          startRecording();
        }
      }, COUNTDOWN_IN_SECONS * 1000);
    }
  };

  const onAudioButtonClick = async () => {
    mediaSource.current = MediaSource.Microphone;

    const isRecordingEnabled = await getMediaStream();
    if (!isRecordingEnabled) return;

    startRecording();
  };

  useEffect(() => {
    if (mediaSource.current && error) {
      /* This state is recoverable, no need to block the UI */
      if (mediaSource.current === MediaSource.Screen && error === RecorderError.PermissionDenied) {
        return;
      }

      setRecorderError(mediaSource.current, error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

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
          disabled={isRecording || (!!getRecorderError(MediaSource.Screen) && !!getRecorderError(MediaSource.Camera))}
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
          onStop={stopRecording}
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
