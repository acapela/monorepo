import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import styled from "styled-components";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { AudioRecorder } from "./AudioRecorder";
import { TranscodingIndicator } from "./TranscodingIndicator";
import { VideoRecorder } from "./VideoRecorder";

interface RecorderProps {
  className?: string;
  onRecordingReady: (files: File) => void;
}

function recordingBlobToFile(blob: Blob): File {
  const [type, extension] = blob.type.split("/");
  const timestamp = new Date().getTime();
  const name = `${type.toLowerCase()}-recording-${timestamp}.${extension}`;
  const file = new File([blob], name, { lastModified: timestamp, type: blob.type });

  return file;
}

async function transcode(file: File): Promise<File> {
  const [fileType] = file.type.split("/");
  const targetFormat = fileType === "audio" ? "mp3" : "mp4";
  const tempFileName = `temp1.${targetFormat}`;

  const ffmpeg = createFFmpeg({ log: false });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", file.name, await fetchFile(file));
  await ffmpeg.run("-i", file.name, tempFileName);
  const data = ffmpeg.FS("readFile", tempFileName);
  const transcodedBlob = new Blob([data.buffer], { type: `${fileType}/${targetFormat}` });

  return recordingBlobToFile(transcodedBlob);
}

const PureRecorder = ({ className, onRecordingReady }: RecorderProps) => {
  const [isTranscoding, { set: showTranscodingIndicator, unset: hideTranscodingIndicator }] = useBoolean(false);

  const onRecorded = async (blob: Blob) => {
    let file = recordingBlobToFile(blob);

    showTranscodingIndicator();
    file = await transcode(file);
    hideTranscodingIndicator();

    onRecordingReady(file);
  };

  return (
    <div className={className}>
      <VideoRecorder onRecorded={onRecorded} />
      <AudioRecorder onRecorded={onRecorded} />
      {isTranscoding && <TranscodingIndicator />}
    </div>
  );
};

export const Recorder = styled(PureRecorder)`
  display: flex;
  flex-direction: row;
`;
