import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useBoolean } from "~shared/hooks/useBoolean";
import { IconButton } from "~ui/buttons/IconButton";
import { IconCamera, IconMic, IconMicSlash, IconMonitor, IconVideoCamera } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { theme } from "~ui/theme";
import { addToast } from "~ui/toasts/data";

import { FullScreenCountdown } from "./FullScreenCountdown";
import { MediaSource } from "./MediaSource";
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

/*
Recorder components provide three ways of capturing media:
1. Screen = Microphone + Screen = getUserMedia({ audio: true }) + getDisplayMedia({ video: true })
2. Video = Camera + Microphone = getUserMedia({ audio: true, video: true })
3. Microphone = getUserMedia({ audio: true })

On Safari, we can't start recording without a user gesture, e. g. button click.

const recorder = new MediaRecorder(mediaStream)
recorder.start()
recorder.onstop = handleStop
recorder.ondataavailable = handleAvailableData 

handleAvailableData() will run after handleStop(), it means the stream data won't be available in handleStop().
To cancel the recording we remove the handler of recorder.ondataavailable
*/

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
    const { type } = mediaChunks.current[0];

    // MediaRecorder doesn't properly work on old Safari
    // more info: https://stackoverflow.com/questions/67682482/on-safari-14-0-2-mediarecorder-dataavailable-handler-captures-empty-blob
    if (!type) {
      addToast({ title: "Fail to record", type: "error" });
      resetRecorder();
      return;
    }

    const blob = new Blob(mediaChunks.current, { type });
    resetRecorder();

    const file = recordingBlobToFile(blob);
    onRecordingReady(file);
  };

  const cancelRecording = () => {
    if (mediaRecorder.current) {
      // ondataavailable() runs after onstop()
      // handler for ondataavailable() is finishRecording()
      // to prevent saving recording we reset onstop()
      mediaRecorder.current.onstop = () => null;
    }

    dismissCountdown();
    stopRecording();
    resetRecorder();
  };

  useEffect(() => {
    if (!window.MediaRecorder) {
      return setError(RecorderError.UnsupportedBrowser);
    }
  }, []);

  const startRecording = async () => {
    setError(null);

    if (!mediaSource.current) return;
    if (!mediaStream.current) return;

    // User can stop the stream using browser's own built-in 'Stop sharing' button.
    mediaStream.current.getVideoTracks().forEach((track) => (track.onended = stopRecording));
    mediaRecorder.current = new MediaRecorder(mediaStream.current);
    mediaRecorder.current.ondataavailable = ({ data }: BlobEvent) => {
      mediaChunks.current.push(data);
    };
    mediaRecorder.current.onstop = finishRecording;
    mediaRecorder.current.onerror = () => {
      setError(RecorderError.NoRecorder);
    };
    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const previewStream = mediaStream.current ? new MediaStream(mediaStream.current.getVideoTracks()) : null;

  const { get: getRecorderError, set: setRecorderError } = useRecorderErrors();
  const isUnsupportedBrowser = error === RecorderError.UnsupportedBrowser;

  /* Handle Video Source Picker */
  const startVideoRecording = async (source: MediaSource) => {
    mediaSource.current = source;

    try {
      if (mediaSource.current === MediaSource.Screen) {
        if (!window.navigator.mediaDevices.getDisplayMedia) {
          setError(RecorderError.ScreenCaptureUnsupported);
          return;
        }

        mediaStream.current = await window.navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        const audioStream = await window.navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioStream.getAudioTracks().forEach((audioTrack) => mediaStream.current?.addTrack(audioTrack));
      } else {
        mediaStream.current = await window.navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((error as any)?.name);
      return;
    }

    startCountdown();
    setTimeout(() => {
      dismissCountdown();
      if (mediaSource.current) {
        startRecording();
      }
    }, COUNTDOWN_IN_SECONS * 1000);
  };

  const onAudioButtonClick = async () => {
    mediaSource.current = MediaSource.Microphone;

    try {
      mediaStream.current = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((error as any)?.name);
      return;
    }

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
        <IconButton icon={<IconMicSlash />} isDisabled tooltip="Media recording is not supported by your browser" />
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
        <IconButton
          icon={<IconVideoCamera />}
          onClick={cancelRecording}
          isDisabled={isRecording || (!!getRecorderError(MediaSource.Screen) && !!getRecorderError(MediaSource.Camera))}
        >
          <IconVideoCamera />
        </IconButton>
      </PopoverMenuTrigger>
      <IconButton
        icon={<IconMic />}
        onClick={onAudioButtonClick}
        tooltip={isRecording ? undefined : "Start recording audio"}
        isDisabled={!!getRecorderError(MediaSource.Microphone)}
      >
        <IconMic />
      </IconButton>

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
  ${theme.spacing.horizontalActionsSection.asGap};
`;
