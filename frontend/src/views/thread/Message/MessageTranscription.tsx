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
    return (
      <div className={className}>
        {!transcription.transcript.length && <span>We couldn't transcribe this recording :(</span>}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {transcription.transcript.map((t: any) =>
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          t.words.map((word: any) => <span key={word.start_time}>{word.text}</span>)
        )}
      </div>
    );
  }

  return <div className={className}>{`Transcription ${transcription.status}`}</div>;
};

export const MessageTranscription = styled(PureMessageTranscription)``;
