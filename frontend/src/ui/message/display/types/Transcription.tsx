import React from "react";
import styled, { css } from "styled-components";
import { Transcription } from "~gql";
import { theme } from "~ui/theme";

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

export const MessageTranscription = styled(PureMessageTranscription)<{}>`
  margin-top: 1rem;
`;

const UIWord = styled.span<{ isActive: boolean }>`
  display: inline-block;
  cursor: default;
  padding: 2px 4px;
  border: 1px solid transparent;

  ${theme.borderRadius.label}

  &:hover {
    ${theme.colors.actions.tertiary.hover()}
  }

  ${({ isActive, theme }) =>
    isActive &&
    css`
      ${theme?.colors.actions.tertiary.active()}
    `}
`;
