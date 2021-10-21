import styled from "styled-components";

import { styledObserver } from "~shared/component";
import { TranscriptData } from "~shared/types/transcript";
import { theme } from "~ui/theme";

import { TranscriptSpeakerPart } from "./TranscriptSpeakerPart";

interface Props {
  transcript: TranscriptData;
  time: number;
  onTimeChangeRequest: (time: number) => void;
  className?: string;
}

export const Transcript = styledObserver(function Transcript({
  transcript,
  time,
  onTimeChangeRequest,
  className,
}: Props) {
  return (
    <UIHolder className={className}>
      {transcript.map((speakerPart) => {
        const key = `${speakerPart.start_time}`;
        return (
          <TranscriptSpeakerPart key={key} part={speakerPart} time={time} onTimeChangeRequest={onTimeChangeRequest} />
        );
      })}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  ${theme.typo.label};
`;
