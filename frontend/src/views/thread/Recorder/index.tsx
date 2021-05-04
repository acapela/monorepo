import styled from "styled-components";
import { AudioRecorder } from "./AudioRecorder";
import { VideoRecorder } from "./VideoRecorder";

interface RecorderProps {
  className?: string;
}

const PureRecorder = ({ className }: RecorderProps) => {
  const onRecorded = (blob: Blob) => {
    console.log("RECORDED", blob);
  };

  return (
    <div className={className}>
      <VideoRecorder />
      &nbsp;
      <AudioRecorder onRecorded={onRecorded} />
    </div>
  );
};

export const Recorder = styled(PureRecorder)`
  display: flex;
  flex-direction: row;
`;
