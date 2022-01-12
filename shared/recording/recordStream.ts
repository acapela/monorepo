import { AsyncReturnType } from "@aca/shared/types";

import { createDurationObservable } from "./createDurationObservable";

function recordingBlobToFile(blob: Blob): File {
  /* e.g.: audio/webm;codecs=opus */
  const [mimeType] = blob.type.split(";");
  const [type, extension] = mimeType.split("/");
  const timestamp = new Date().getTime();
  const name = `${type.toLowerCase()}-recording-${timestamp}.${extension}`;
  const file = new File([blob], name, { lastModified: timestamp, type: mimeType });

  return file;
}

export async function startRecordingStream(stream: MediaStream, onFinished?: () => void) {
  const mediaChunks: Blob[] = [];

  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.addEventListener("dataavailable", ({ data }) => {
    mediaChunks.push(data);
  });

  mediaRecorder.addEventListener("error", (event) => {
    console.error("Media recorder error", event);
  });

  mediaRecorder.addEventListener("stop", () => {
    duration.clear();
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    onFinished?.();
  });

  mediaRecorder.start(1000);

  const duration = createDurationObservable();

  async function finish() {
    mediaRecorder.stop();
    const [firstRecordingChunk] = mediaChunks;

    if (!firstRecordingChunk) return null;

    const { type } = firstRecordingChunk;
    const finalDataBlob = new Blob(mediaChunks, { type });

    const recordingFile = recordingBlobToFile(finalDataBlob);

    return recordingFile;
  }

  return {
    duration,
    finish,
  };
}

export type StreamRecording = AsyncReturnType<typeof startRecordingStream>;
