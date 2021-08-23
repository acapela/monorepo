import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

import { MediaSource } from "./MediaSource";

export type ReactMediaRecorderRenderProps = {
  error: string;
  startRecording: () => void;
  stopRecording: () => void;
  status: StatusMessages;
  previewStream: MediaStream | null;
  getMediaStream: () => Promise<boolean>;
  mediaSource: MediaSource | null;
  setMediaSource: (source: MediaSource | null) => void;
};

export type ReactMediaRecorderHookProps = {
  onStop?: (blobUrl: string, blob: Blob) => void;
  blobPropertyBag?: BlobPropertyBag;
  mediaRecorderOptions?: MediaRecorderOptions | null;
  acquireMediaOnDemand?: boolean;
};
export type ReactMediaRecorderProps = ReactMediaRecorderHookProps & {
  render: (props: ReactMediaRecorderRenderProps) => ReactElement;
};

export type StatusMessages =
  | "media_aborted"
  | "permission_denied"
  | "no_specified_media_found"
  | "media_in_use"
  | "invalid_media_constraints"
  | "no_constraints"
  | "recorder_error"
  | "idle"
  | "acquiring_media"
  | "delayed_start"
  | "recording"
  | "stopping"
  | "stopped";

export enum RecorderErrors {
  AbortError = "media_aborted",
  NotAllowedError = "permission_denied",
  NotFoundError = "no_specified_media_found",
  NotReadableError = "media_in_use",
  OverconstrainedError = "invalid_media_constraints",
  TypeError = "no_constraints",
  NONE = "",
  NO_RECORDER = "recorder_error",
  SCREEN_CAPTURE_UNSUPPORTED = "screen_capture_unsupported",
  UNSUPPORTED_BROWSER = "unsupported_browser",
}

/**
 * Fork of the react-media-recorder library
 * Allows requesting media permissions on demand
 * @link https://www.npmjs.com/package/react-media-recorder
 */
export function useReactMediaRecorder({
  onStop = () => null,
  blobPropertyBag = {},
  mediaRecorderOptions = null,
  acquireMediaOnDemand = false,
}: ReactMediaRecorderHookProps): ReactMediaRecorderRenderProps {
  const [mediaSource, setMediaSource] = useState<MediaSource | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaChunks = useRef<Blob[]>([]);
  const mediaStream = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<StatusMessages>("idle");
  const [error, setError] = useState<keyof typeof RecorderErrors>("NONE");

  const getMediaStream = useCallback(async (): Promise<boolean> => {
    setStatus("acquiring_media");

    const requiredMedia: MediaStreamConstraints = {
      audio: true,
      video: mediaSource === MediaSource.CAMERA,
    };

    try {
      const audioStream = await window.navigator.mediaDevices.getUserMedia(requiredMedia);

      if (mediaSource === MediaSource.SCREEN) {
        if (!window.navigator.mediaDevices.getDisplayMedia) {
          setError("SCREEN_CAPTURE_UNSUPPORTED");
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
      setStatus("idle");
    }
  }, [mediaSource]);

  useEffect(() => {
    if (!window.MediaRecorder) {
      return setError("UNSUPPORTED_BROWSER");
    }

    if (mediaRecorderOptions && mediaRecorderOptions.mimeType) {
      if (!MediaRecorder.isTypeSupported(mediaRecorderOptions.mimeType)) {
        console.error(`This browser does not support the MIME type you supplied`);
      }
    }
  }, [acquireMediaOnDemand, mediaRecorderOptions, mediaSource]);

  // Media Recorder Handlers

  const startRecording = async () => {
    setError("NONE");

    if (!mediaSource) return;

    if (mediaStream.current) {
      // User can stop the stream using browser's own built-in 'Stop sharing' button.
      mediaStream.current.getVideoTracks().forEach((track) => (track.onended = stopRecording));
      mediaRecorder.current = new MediaRecorder(mediaStream.current, {
        mimeType:
          mediaSource === MediaSource.CAMERA || mediaSource === MediaSource.SCREEN
            ? "video/webm;codecs=opus"
            : "audio/webm;codecs=opus",
      });
      mediaRecorder.current.ondataavailable = onRecordingActive;
      mediaRecorder.current.onstop = onRecordingStop;
      mediaRecorder.current.onerror = () => {
        setError("NO_RECORDER");
        setStatus("idle");
      };
      mediaRecorder.current.start();
      setStatus("recording");
    }
  };

  const onRecordingActive = ({ data }: BlobEvent) => {
    mediaChunks.current.push(data);
  };

  const onRecordingStop = () => {
    const [chunk] = mediaChunks.current;
    const blobProperty: BlobPropertyBag = Object.assign({ type: chunk.type }, blobPropertyBag);
    const blob = new Blob(mediaChunks.current, blobProperty);
    const url = URL.createObjectURL(blob);
    setStatus("stopped");
    onStop(url, blob);
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      if (mediaRecorder.current.state !== "inactive") {
        setStatus("stopping");
        mediaRecorder.current.stop();
        mediaStream.current?.getTracks().forEach((track) => track.stop());
        mediaChunks.current = [];
      }
    }
  };

  return {
    error: RecorderErrors[error],
    getMediaStream,
    startRecording,
    stopRecording,
    status,
    previewStream: mediaStream.current ? new MediaStream(mediaStream.current.getVideoTracks()) : null,
    mediaSource,
    setMediaSource,
  };
}
