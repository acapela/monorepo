import React from "react";
import styled from "styled-components";
import { Transcription, Transcription_Status_Enum } from "~frontend/gql";

interface MessageTranscriptionProps {
  transcription: Pick<Transcription, "status" | "transcript">;
  className?: string;
}

const PureMessageTranscription = ({ transcription, className }: MessageTranscriptionProps) => {
  if (transcription.status === Transcription_Status_Enum.Completed) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return transcription.transcript.map((t: any) =>
      t.words.map((word: any) => <span key={word.start_time}>{word.text}</span>)
    );
  }

  return <div className={className}>{`Transcription ${transcription.status}`}</div>;
};

export const MessageTranscription = styled(PureMessageTranscription)``;
