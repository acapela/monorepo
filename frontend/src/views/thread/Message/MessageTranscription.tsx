import React from "react";
import styled from "styled-components";

interface MessageTranscriptionProps {
  transcription: string;
  className?: string;
}

const PureMessageTranscription = ({ transcription, className }: MessageTranscriptionProps) => {
  return <div className={className}>{transcription}</div>;
};

export const MessageTranscription = styled(PureMessageTranscription)``;
