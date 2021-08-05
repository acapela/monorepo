import { useEffect, useState } from "react";
import styled from "styled-components";
import { createCleanupObject } from "~frontend/../../shared/cleanup";
import { createElementEvent } from "~frontend/../../shared/domEvents";
import { useBoolean } from "~frontend/../../shared/hooks/useBoolean";
import { useSharedRef } from "~frontend/../../shared/hooks/useSharedRef";
import { namedForwardRef } from "~frontend/../../shared/react/namedForwardRef";
import { theme } from "~frontend/../../ui/theme";
import { TranscriptData } from "~shared/types/transcript";
import { PlaybackControls } from "./PlaybackControls";
import { defaultAllowedPlaybackRates } from "./playbackRates";
import { usePlaybackState } from "./usePlaybackState";

interface Props {
  fileUrl: string;
  autoplay?: boolean;
  transcript?: TranscriptData;
}

export const VideoPlayer = namedForwardRef<HTMLVideoElement, Props>(function VideoPlayer(
  { fileUrl, transcript, autoplay }: Props,
  ref
) {
  const videoRef = useSharedRef<HTMLVideoElement | null>(null, [ref]);
  const { time, setTime, duration, setDuration, playbackRate, setPlaybackRate, isPlaying, play, pause } =
    usePlaybackState(videoRef);

  return (
    <UIHolder>
      <video ref={videoRef} src={fileUrl} controls={false}>
        Sorry, your browser doesn't support embedded videos.
      </video>
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
            if (videoRef.current) {
              videoRef.current.currentTime = time;
            }
          }}
        />
      </UIControlsHolder>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  position: relative;
  overflow: hidden;
  ${theme.borderRadius.card};
`;

const UIControlsHolder = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: ${theme.colors.layout.background()};
  padding: 24px;
`;
