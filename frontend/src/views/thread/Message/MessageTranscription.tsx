import React from "react";
import styled, { css } from "styled-components";
import { Transcription, Transcription_Status_Enum } from "~frontend/gql";

export interface Word {
  text: string;
  start_time: number;
  end_time: number;
}

interface Transcript {
  words: Word[];
  speaker?: string;
  start_time: number;
  end_time: number;
}

interface MessageTranscriptionProps {
  transcription: Pick<Transcription, "status" | "transcript">;
  onWordClicked: (time: number) => void;
  actualMediaTime: number;
  className?: string;
}

const PureMessageTranscription = ({
  transcription,
  actualMediaTime,
  onWordClicked,
  className,
}: MessageTranscriptionProps) => {
  if (transcription.status === Transcription_Status_Enum.Completed) {
    return (
      <div className={className}>
        {!transcription.transcript.length && <span>We couldn't transcribe this message, retry?</span>}
        {transcription.transcript.map((t: Transcript) =>
          t.words.map((word) => (
            <UIWord
              key={word.start_time}
              onClick={() => onWordClicked(word.start_time)}
              active={word.start_time <= actualMediaTime && actualMediaTime < word.end_time}
            >
              {word.text.trim()}
            </UIWord>
          ))
        )}
      </div>
    );
  }

  return <div className={className}>{`Transcription ${transcription.status}`}</div>;
};

export const MessageTranscription = styled(PureMessageTranscription)`
  margin-top: 1rem;
`;

const UIWord = styled.span<{ active: boolean }>`
  display: inline-block;
  cursor: default;
  padding: 0.1rem 0.3rem;
  border: 1px solid transparent;
  border-radius: 0.4rem;

  &:hover {
    border-color: #e94057;
    background-color: #fff;
  }

  ${({ active }) =>
    active &&
    css`
      border-color: #f27121;
      background-color: #fff;
    `}
`;
