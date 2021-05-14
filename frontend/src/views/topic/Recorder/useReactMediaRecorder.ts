import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

export type ReactMediaRecorderRenderProps = {
  error: string;
  muteAudio: () => void;
  unMuteAudio: () => void;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  mediaBlobUrl: null | string;
  status: StatusMessages;
  isAudioMuted: boolean;
  previewStream: MediaStream | null;
  clearBlobUrl: () => void;
  getMediaStream: () => Promise<boolean>;
};

export type ReactMediaRecorderHookProps = {
  audio?: boolean | MediaTrackConstraints;
  video?: boolean | MediaTrackConstraints;
  screen?: boolean;
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
  audio = true,
  video = false,
  onStop = () => null,
  blobPropertyBag,
  screen = false,
  mediaRecorderOptions = null,
  acquireMediaOnDemand = false,
}: ReactMediaRecorderHookProps): ReactMediaRecorderRenderProps {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaChunks = useRef<Blob[]>([]);
  const mediaStream = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<StatusMessages>("idle");
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<keyof typeof RecorderErrors>("NONE");

  const getMediaStream = useCallback(async (): Promise<boolean> => {
    setStatus("acquiring_media");
    const requiredMedia: MediaStreamConstraints = {
      audio: typeof audio === "boolean" ? !!audio : audio,
      video: typeof video === "boolean" ? !!video : video,
    };
    try {
      if (screen) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!window.navigator.mediaDevices.getDisplayMedia) {
          setError("SCREEN_CAPTURE_UNSUPPORTED");

          return false;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const stream = (await window.navigator.mediaDevices.getDisplayMedia({
          video: video || true,
        })) as MediaStream;
        if (audio) {
          const audioStream = await window.navigator.mediaDevices.getUserMedia({
            audio,
          });

          audioStream.getAudioTracks().forEach((audioTrack) => stream.addTrack(audioTrack));
        }
        mediaStream.current = stream;
      } else {
        const stream = await window.navigator.mediaDevices.getUserMedia(requiredMedia);
        mediaStream.current = stream;
      }

      return true;
    } catch (error) {
      setError(error.name);
      return false;
    } finally {
      setStatus("idle");
    }
  }, [audio, video, screen]);

  useEffect(() => {
    if (!window.MediaRecorder) {
      return setError("UNSUPPORTED_BROWSER");
    }

    const checkConstraints = (mediaType: MediaTrackConstraints) => {
      const supportedMediaConstraints = navigator.mediaDevices.getSupportedConstraints();
      const unSupportedConstraints = Object.keys(mediaType).filter(
        (constraint) => !(supportedMediaConstraints as { [key: string]: MediaTrackSupportedConstraints })[constraint]
      );

      if (unSupportedConstraints.length > 0) {
        console.error(`The constraints ${unSupportedConstraints.join(",")} are not supported by this browser`);
      }
    };

    if (typeof audio === "object") {
      checkConstraints(audio);
    }
    if (typeof video === "object") {
      checkConstraints(video);
    }

    if (mediaRecorderOptions && mediaRecorderOptions.mimeType) {
      if (!MediaRecorder.isTypeSupported(mediaRecorderOptions.mimeType)) {
        console.error(`This browser does not support the MIME type you supplied`);
      }
    }

    if (!mediaStream.current && !acquireMediaOnDemand) {
      getMediaStream();
    }
  }, [audio, screen, video, getMediaStream, mediaRecorderOptions]);

  // Media Recorder Handlers

  const startRecording = async () => {
    setError("NONE");
    if (!mediaStream.current) {
      await getMediaStream();
    }
    if (mediaStream.current) {
      const isStreamEnded = mediaStream.current.getTracks().some((track) => track.readyState === "ended");
      if (isStreamEnded) {
        await getMediaStream();
      }
      // User can stop the stream using browser's own built-in 'Stop sharing' button.
      mediaStream.current.getVideoTracks().forEach((track) => (track.onended = stopRecording));
      mediaRecorder.current = new MediaRecorder(mediaStream.current);
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
    const blobProperty: BlobPropertyBag = Object.assign(
      { type: chunk.type },
      blobPropertyBag || (video ? { type: "video/mp4" } : { type: "audio/wav" })
    );
    const blob = new Blob(mediaChunks.current, blobProperty);
    const url = URL.createObjectURL(blob);
    setStatus("stopped");
    setMediaBlobUrl(url);
    onStop(url, blob);
  };

  const muteAudio = (mute: boolean) => {
    setIsAudioMuted(mute);
    if (mediaStream.current) {
      mediaStream.current.getAudioTracks().forEach((audioTrack) => (audioTrack.enabled = !mute));
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.pause();
    }
  };
  const resumeRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "paused") {
      mediaRecorder.current.resume();
    }
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
    muteAudio: () => muteAudio(true),
    unMuteAudio: () => muteAudio(false),
    getMediaStream,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    mediaBlobUrl,
    status,
    isAudioMuted,
    previewStream: mediaStream.current ? new MediaStream(mediaStream.current.getVideoTracks()) : null,
    clearBlobUrl: () => setMediaBlobUrl(null),
  };
}
