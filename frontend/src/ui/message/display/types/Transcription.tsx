import React from "react";
import styled, { css } from "styled-components";
import { HIGHLIGHT_COLOR } from "~ui/theme/colors/base";
import { Transcription } from "~gql";
import { borderRadius } from "~ui/baseStyles";

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
  onSeek: (time: number) => void;
  actualMediaTime: number;
  className?: string;
}

const PureMessageTranscription = ({ transcription, actualMediaTime, onSeek, className }: MessageTranscriptionProps) => {
  if (transcription.status === "completed") {
    return (
      <div className={className}>
        {!transcription.transcript.length && <span>We couldn't transcribe this message, retry?</span>}
        {transcription.transcript.map((t: Transcript) =>
          t.words.map((word) => (
            <UIWord
              key={word.start_time}
              onClick={() => onSeek(word.start_time)}
              isActive={word.start_time <= actualMediaTime && actualMediaTime < word.end_time}
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

const UIWord = styled.span<{ isActive: boolean }>`
  display: inline-block;
  cursor: default;
  padding: 0.1rem 0.3rem;
  border: 1px solid transparent;
  ${borderRadius.label}

  &:hover {
    border-color: #e94057;
    background-color: #fff;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      border-color: ${HIGHLIGHT_COLOR};
      background-color: #fff;
    `}
`;
