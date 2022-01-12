import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { MouseEvent } from "react";
import styled from "styled-components";

import { handleWithStopPropagation } from "@aca/shared/events";
import { formatMsTimeToPlaybackTime } from "@aca/shared/time";
import { PopPresenceAnimator } from "@aca/ui/animations";
import { IconPause, IconPlay } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

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
    event.stopPropagation();

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
      <UIProgressBar onClick={handleProgressBarMouseEvent}>
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
  ${theme.colors.action.primary.interactive};
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${theme.radius.circle}
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
  background-color: ${theme.colors.layout.background.border};
  ${theme.radius.circle}
  min-width: 160px;
  position: relative;
  flex-grow: 1;
`;

const UIProgressBarProgressIndicator = styled(motion.div)`
  height: 3px;
  ${theme.radius.circle};
  ${theme.colors.action.primary.asBg};
  position: absolute;
`;

const UIProgressTextLabel = styled.div`
  white-space: nowrap;
  ${theme.typo.label};
  user-select: none;
`;

function renderProgressTime(time: number, duration: number) {
  return `${formatMsTimeToPlaybackTime(time)} / ${formatMsTimeToPlaybackTime(duration)}`;
}
