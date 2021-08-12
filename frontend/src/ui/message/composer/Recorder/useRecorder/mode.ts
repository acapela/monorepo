import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

export type RecordingMode = "audio" | "screen" | "camera";

export function convertRecordingTypeToMediaConstraint(type: RecordingMode): MediaStreamConstraints {
  return {
    audio: true,
    video: {},
  };
}

export const getCanRecordInMode = (mediaType: RecordingMode) => {
  if (typeof navigator === "undefined") return false;

  const supportedMediaConstraints = navigator.mediaDevices.getSupportedConstraints();
  const unSupportedConstraints = Object.keys(mediaType).filter(
    (constraint) => !(supportedMediaConstraints as { [key: string]: MediaTrackSupportedConstraints })[constraint]
  );

  if (unSupportedConstraints.length > 0) {
    console.error(`The constraints ${unSupportedConstraints.join(",")} are not supported by this browser`);
  }
};

const getMediaStreamForMode = async (): Promise<boolean> => {
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
};
