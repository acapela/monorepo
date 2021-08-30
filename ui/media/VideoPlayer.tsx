import { AnimatePresence } from "framer-motion";
import { useRef } from "react";
import styled from "styled-components";

import { useBoundingBox } from "~shared/hooks/useBoundingBox";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";
import { useIsElementOrChildHovered } from "~shared/hooks/useIsElementOrChildHovered";
import { useSharedRef } from "~shared/hooks/useSharedRef";
import { namedForwardRef } from "~shared/react/namedForwardRef";
import { TranscriptData } from "~shared/types/transcript";
import { PopPresenceAnimator } from "~ui/animations";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { theme } from "~ui/theme";

import { PlaybackControls } from "./PlaybackControls";
import { defaultAllowedPlaybackRates } from "./playbackRates";
import { Transcript } from "./Transcript";
import { usePlaybackState } from "./usePlaybackState";

interface Props {
  fileUrl: string;
  autoplay?: boolean;
  transcript?: TranscriptData;
}

export const VideoPlayer = namedForwardRef<HTMLVideoElement, Props>(function VideoPlayer(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { fileUrl, transcript, autoplay }: Props,
  ref
) {
  const holderRef = useRef<HTMLDivElement>(null);
  const holderBoundingBox = useBoundingBox(holderRef);
  const videoRef = useSharedRef<HTMLVideoElement | null>(null, [ref]);
  const { time, duration, playbackRate, setPlaybackRate, isPlaying, play, pause, togglePlay, setTime } =
    usePlaybackState(videoRef);

  const isHovered = useIsElementOrChildHovered(holderRef);

  useShortcut("Space", togglePlay, { isEnabled: isHovered });

  const shouldShowControls = useDebouncedValue(isHovered || !isPlaying, { offDelay: 1000, onDelay: 100 });

  const videoHeight = holderBoundingBox.height;

  return (
    <UIHolder ref={holderRef}>
      <UIVideoHolder>
        <video height={videoHeight} ref={videoRef} src={fileUrl} controls={false}>
          Sorry, your browser doesn't support embedded videos.
        </video>
        <AnimatePresence>
          {shouldShowControls && (
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
          )}
        </AnimatePresence>
      </UIVideoHolder>
      {transcript && <Transcript transcript={transcript} time={time} onTimeChangeRequest={setTime} />}
    </UIHolder>
  );
});

const UIHolder = styled.div``;

const UIVideoHolder = styled.div`
  height: 100%;
  position: relative;
  overflow: hidden;
  ${theme.borderRadius.card};
`;

const UIControlsHolder = styled(PopPresenceAnimator)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: ${theme.colors.layout.background()};
  padding: 24px;
`;
