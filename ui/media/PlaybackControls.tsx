import { AnimatePresence } from "framer-motion";
import { MouseEvent } from "react";
import styled from "styled-components";
import { handleWithStopPropagation } from "~shared/events";
import { PopPresenceAnimator } from "~ui/animations";
import { IconPause, IconPlay } from "~ui/icons";
import { theme } from "~ui/theme";
import { ValueRoller } from "./ValueRoller";
import { motion } from "framer-motion";

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

  function handleProgressBarMouseEvnet(event: MouseEvent) {
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
      <UIProgressBar onClick={handleWithStopPropagation(handleProgressBarMouseEvnet)}>
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
        <ValueRoller
          possibleValues={allowedPlaybackRates}
          activeValue={playbackRate}
          onValueChange={(playbackRate) => {
            onPlaybackRateChangeRequest?.(playbackRate);
          }}
        >
          {({ setNextValue, value }) => {
            return (
              <UIPlaybackRateButton
                onClick={handleWithStopPropagation(() => {
                  setNextValue();
                })}
                data-tooltip={`Change playback speed`}
              >
                {value}x
              </UIPlaybackRateButton>
            );
          }}
        </ValueRoller>
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

const UIPlaybackRateButton = styled.button`
  padding: 4px 12px;
  ${theme.font.body12.medium.inter.build()};
  ${theme.colors.actions.tertiary.all}
  ${theme.borderRadius.item};
  ${theme.transitions.hover()}
  min-width: 7ch;
  user-select: none;
  text-align: center;
  cursor: pointer;
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
