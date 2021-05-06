import styled from "styled-components";
import { AudioRecorder } from "./AudioRecorder";
import { VideoRecorder } from "./VideoRecorder";

interface RecorderProps {
  className?: string;
  onRecordingReady: (files: File) => void;
}

function capitalize(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}

function recordingBlobToFile(blob: Blob): File {
  const [type, extension] = blob.type.split("/");
  const timestamp = new Date().getTime();
  const name = `${capitalize(type)}Recording-${timestamp}.${extension}`;
  const file = new File([blob], name, { lastModified: timestamp, type: blob.type });

  return file;
}

const PureRecorder = ({ className, onRecordingReady }: RecorderProps) => {
  const onRecorded = (blob: Blob) => {
    const file = recordingBlobToFile(blob);

    onRecordingReady(file);
  };

  return (
    <div className={className}>
      <VideoRecorder onRecorded={onRecorded} />
      <AudioRecorder onRecorded={onRecorded} />
    </div>
  );
};

export const Recorder = styled(PureRecorder)`
  display: flex;
  flex-direction: row;
`;
