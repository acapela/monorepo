import { useEffect, useState } from "react";
import styled from "styled-components";
import { createCleanupObject } from "~frontend/../../shared/cleanup";
import { createElementEvent } from "~frontend/../../shared/domEvents";
import { useBoolean } from "~frontend/../../shared/hooks/useBoolean";
import { useSharedRef } from "~frontend/../../shared/hooks/useSharedRef";
import { namedForwardRef } from "~frontend/../../shared/react/namedForwardRef";
import { TranscriptData } from "~shared/types/transcript";
import { PlaybackControls } from "./PlaybackControls";
import { defaultAllowedPlaybackRates } from "./playbackRates";
import { usePlaybackState } from "./usePlaybackState";

interface Props {
  fileUrl: string;
  autoplay?: boolean;
  transcript?: TranscriptData;
}

export const AudioPlayer = namedForwardRef<HTMLAudioElement, Props>(function AudioPlayer(
  { fileUrl, transcript, autoplay }: Props,
  ref
) {
  const audioRef = useSharedRef<HTMLAudioElement | null>(null, [ref]);
  const { time, setTime, duration, setDuration, playbackRate, setPlaybackRate, isPlaying, play, pause, progress } =
    usePlaybackState(audioRef);

  console.log({ duration, time, progress });

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
          onTimeChangeRequest={(time) => {
            if (audioRef.current) {
              audioRef.current.currentTime = time;
            }
          }}
        />
      </UIControlsHolder>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  audio {
    display: none;
  }
`;

const UIControlsHolder = styled.div``;
