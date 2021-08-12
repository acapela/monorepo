import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { RecordingMode } from "./mode";

export type { RecordingMode } from "./mode";

interface RecorderHookResult {
  recordingInProgress: RecordingInProgressState | null;
  startRecording: (settings: RecordingSettings) => void;
  error: string | null;
  isSupported: boolean;
  getCanRecordInMode(type: RecordingMode): boolean;
}

export type ReactMediaRecorderHookProps = {
  audio?: boolean | MediaTrackConstraints;
  video?: boolean | MediaTrackConstraints;
  screen?: boolean;
  onStop?: (blobUrl: string, blob: Blob) => void;
  mediaRecorderOptions?: MediaRecorderOptions | null;
  acquireMediaOnDemand?: boolean;
};

interface RecorderHookInput {
  isEnabled?: boolean;
}

/**
 * Fork of the react-media-recorder library
 * Allows requesting media permissions on demand
 * @link https://www.npmjs.com/package/react-media-recorder
 */
export function useReactMediaRecorder({ isEnabled = true }: RecorderHookInput): RecorderHookResult {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaChunks = useRef<Blob[]>([]);
  const mediaStream = useRef<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<keyof typeof RecorderErrors>("NONE");

  const [recordingInProgress, setRecordingInProgress] = useState<RecordingInProgressState | null>(null);

  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (!window.MediaRecorder) {
      return;
    }

    setIsSupported(true);
  }, []);

  // Media Recorder Handlers

  return {
    error: RecorderErrors[error],
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
