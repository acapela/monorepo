import { useState } from "react";

import { StreamRecording, startRecordingStream } from "./recordStream";

export type VideoRecordingType = "screen" | "camera";

async function getVideoStream(type: VideoRecordingType) {
  if (type === "screen") {
    const videoStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const audioStream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    audioStream.getAudioTracks().forEach((audioTrack) => videoStream.addTrack(audioTrack));

    return videoStream;
  }

  return navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
}

async function startRecordingVideo(type: VideoRecordingType, onFinished?: () => void) {
  const stream = await getVideoStream(type);

  return startRecordingStream(stream, onFinished);
}

export function useVideoRecording() {
  const [recording, setRecording] = useState<StreamRecording | null>(null);

  async function startRecording(type: VideoRecordingType) {
    const newRecording = await startRecordingVideo(type, () => {
      setRecording(null);
    });
    setRecording(newRecording);
  }

  return [recording, startRecording] as const;
}
