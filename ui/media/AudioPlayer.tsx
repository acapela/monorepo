import styled from "styled-components";

import { useSharedRef } from "@aca/shared/hooks/useSharedRef";
import { namedForwardRef } from "@aca/shared/react/namedForwardRef";
import { TranscriptData } from "@aca/shared/types/transcript";

import { PlaybackControls } from "./PlaybackControls";
import { defaultAllowedPlaybackRates } from "./playbackRates";
import { Transcript } from "./Transcript";
import { usePlaybackState } from "./usePlaybackState";

interface Props {
  fileUrl: string;
  autoplay?: boolean;
  transcript?: TranscriptData;
}

export const AudioPlayer = namedForwardRef<HTMLAudioElement, Props>(function AudioPlayer(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { fileUrl, transcript, autoplay }: Props,
  ref
) {
  const audioRef = useSharedRef<HTMLAudioElement | null>(null, [ref]);
  const { time, duration, playbackRate, setPlaybackRate, isPlaying, play, pause, setTime } = usePlaybackState(audioRef);

  return (
    <UIHolder>
      <audio ref={audioRef} src={fileUrl} controls preload="metadata">
        Sorry, your browser doesn't support embedded audios.
      </audio>
      <UIControlsHolder>
        <PlaybackControls
          isPlaying={isPlaying}
          onPlayRequest={play}
          onPauseRequest={pause}
          duration={duration}
          time={time}
          playbackRate={playbackRate}
          onPlaybackRateChangeRequest={setPlaybackRate}
          allowedPlaybackRates={defaultAllowedPlaybackRates}
          onTimeChangeRequest={setTime}
        />
      </UIControlsHolder>
      {transcript && <Transcript transcript={transcript} time={time} onTimeChangeRequest={setTime} />}
    </UIHolder>
  );
});

const UIHolder = styled.div`
  audio {
    display: none;
  }

  ${Transcript} {
    margin-top: 16px;
  }
`;

const UIControlsHolder = styled.div``;
