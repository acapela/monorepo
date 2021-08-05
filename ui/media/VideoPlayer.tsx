import styled from "styled-components";
import { useSharedRef } from "~shared/hooks/useSharedRef";
import { namedForwardRef } from "~shared/react/namedForwardRef";
import { theme } from "~ui/theme";
import { TranscriptData } from "~shared/types/transcript";
import { PlaybackControls } from "./PlaybackControls";
import { defaultAllowedPlaybackRates } from "./playbackRates";
import { usePlaybackState } from "./usePlaybackState";
import { useRef } from "react";
import { useIsElementOrChildHovered } from "~shared/hooks/useIsElementOrChildHovered";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";
import { AnimatePresence } from "framer-motion";
import { PopPresenceAnimator } from "~ui/animations";

interface Props {
  fileUrl: string;
  autoplay?: boolean;
  transcript?: TranscriptData;
}

export const VideoPlayer = namedForwardRef<HTMLVideoElement, Props>(function VideoPlayer(
  { fileUrl, transcript, autoplay }: Props,
  ref
) {
  const holderRef = useRef<HTMLDivElement>(null);
  const videoRef = useSharedRef<HTMLVideoElement | null>(null, [ref]);
  const { time, duration, playbackRate, setPlaybackRate, isPlaying, play, pause, togglePlay, setTime } =
    usePlaybackState(videoRef);

  const isHovered = useIsElementOrChildHovered(holderRef);

  useShortcut("Space", togglePlay, { isEnabled: isHovered });

  const shouldShowControls = useDebouncedValue(isHovered || !isPlaying, { offDelay: 1000, onDelay: 100 });

  return (
    <UIHolder ref={holderRef}>
      <video ref={videoRef} src={fileUrl} controls={false}>
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
    </UIHolder>
  );
});

const UIHolder = styled.div`
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
