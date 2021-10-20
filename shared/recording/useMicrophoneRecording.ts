import { useState } from "react";

import { StreamRecording, startRecordingStream } from "./recordStream";

async function getAudioStream() {
  return navigator.mediaDevices.getUserMedia({ audio: true });
}

async function startRecordingAudio(onFinished?: () => void) {
  const audioStream = await getAudioStream();

  return startRecordingStream(audioStream, onFinished);
}

export function useMicrophoneRecording() {
  const [recording, setRecording] = useState<StreamRecording | null>(null);

  async function startRecording() {
    if (recording) return;

    const newRecording = await startRecordingAudio(() => {
      setRecording(null);
    });
    setRecording(newRecording);
  }

  return [recording, startRecording] as const;
}
