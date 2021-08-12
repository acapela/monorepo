import { AnimatePresence } from "framer-motion";
import { MouseEvent } from "react";
import styled from "styled-components";
import { handleWithStopPropagation } from "~shared/events";
import { PopPresenceAnimator } from "~ui/animations";
import { IconPause, IconPlay } from "~ui/icons";
import { theme } from "~ui/theme";
import { motion } from "framer-motion";
import { PlaybackRateButton } from "./PlaybackRateButton";

interface Props {
  isPlaying: boolean;
  onPlayRequest?: () => void;
  onPauseRequest?: () => void;
  playbackRate?: number;
  onPlaybackRateChangeRequest?: (playbackRate: number) => void;
  allowedPlaybackRates?: number[];
  duration: number;
  time: number;
  onTimeChangeRequest?: (time: number) => void;
}

export function PlaybackControls({
  isPlaying,
  onPlayRequest,
  onPauseRequest,
  playbackRate = 1,
  onPlaybackRateChangeRequest,
  allowedPlaybackRates,
  duration,
  time,
  onTimeChangeRequest,
}: Props) {
  const progress = time / duration;

  function handleProgressBarMouseEvent(event: MouseEvent) {
    const target = event.target as HTMLDivElement;
    const barRect = target.getBoundingClientRect();

    const width = barRect.width;
    const xOffset = event.pageX - barRect.left;
    const progress = xOffset / width;

    const newTime = duration * progress;

    onTimeChangeRequest?.(newTime);
  }

  return (
    <UIHolder>
      <AnimatePresence exitBeforeEnter>
        <UITogglePlayButton
          /**
           * This button has mount and un-mount animation as we kinda animate from play to pause icon with fade and slight scale animation.
           * As this is the same component, however - we have to explicitly say react it should re-mount it instead of updating it, thus the key
           */
          key={`${isPlaying}`}
          onClick={handleWithStopPropagation(() => {
            if (isPlaying) onPauseRequest?.();
            if (!isPlaying) onPlayRequest?.();
          })}
        >
          {isPlaying && <IconPause />}
          {!isPlaying && <IconPlay />}
        </UITogglePlayButton>
      </AnimatePresence>
      <UIProgressBar onClick={handleWithStopPropagation(handleProgressBarMouseEvent)}>
        <UIProgressInner>
          <UIProgressBarProgressIndicator
            animate={{ width: `${progress * 100}%` }}
            initial={{ width: `${progress * 100}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          />
        </UIProgressInner>
      </UIProgressBar>
      <UIProgressTextLabel>{renderProgressTime(time, duration)}</UIProgressTextLabel>

      {allowedPlaybackRates && (
        <PlaybackRateButton
          onPlaybackRateChangeRequest={onPlaybackRateChangeRequest}
          playbackRate={playbackRate}
          allowedPlaybackRates={allowedPlaybackRates}
        />
      )}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const UITogglePlayButton = styled(PopPresenceAnimator)`
  ${theme.colors.actions.primary.all};
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${theme.borderRadius.circle}
  font-size: 20px;
  min-width: 32px;
  cursor: pointer;
`;

const UIProgressBar = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  flex-grow: 1;
  cursor: pointer;
`;

const UIProgressInner = styled.div`
  height: 3px;
  background-color: ${theme.colors.layout.strongLine()};
  ${theme.borderRadius.circle}
  min-width: 160px;
  position: relative;
  flex-grow: 1;
`;

const UIProgressBarProgressIndicator = styled(motion.div)`
  height: 3px;
  ${theme.borderRadius.circle};
  background-color: ${theme.colors.actions.primary.regular()};
  position: absolute;
`;

const UIProgressTextLabel = styled.div`
  white-space: nowrap;
  ${theme.font.body12.inter.semibold.build()};
  user-select: none;
`;

function convertTimeToMinutesTime(time: number) {
  if (!Number.isFinite(time)) {
    return "--:--";
  }
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const paddedSeconds = `${seconds}`.padStart(2, "0");

  return `${minutes}:${paddedSeconds}`;
}

function renderProgressTime(time: number, duration: number) {
  return `${convertTimeToMinutesTime(time)} / ${convertTimeToMinutesTime(duration)}`;
}
