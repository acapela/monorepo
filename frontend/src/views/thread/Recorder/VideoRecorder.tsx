import styled from "styled-components";
import { VideoOutline } from "~ui/icons";
import { RecordButton } from "./RecordButton";

interface VideoRecorderProps {
  className?: string;
}

const PureVideoRecorder = ({ className }: VideoRecorderProps) => {
  return (
    <RecordButton className={className}>
      <VideoOutline />
    </RecordButton>
  );
};

export const VideoRecorder = styled(PureVideoRecorder)``;
