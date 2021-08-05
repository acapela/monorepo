import { AnimatePresence } from "framer-motion";
import { MouseEvent } from "react";
import styled, { css } from "styled-components";
import { handleWithStopPropagation } from "~shared/events";
import { PopPresenceAnimator } from "~ui/animations";
import { IconPause, IconPlay } from "~ui/icons";
import { theme } from "~ui/theme";

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
          <UIProgressBarProgressIndicator progress={progress} />
        </UIProgressInner>
      </UIProgressBar>
      <UIProgressTextLabel>{renderProgressTime(time, duration)}</UIProgressTextLabel>
      {allowedPlaybackRates && (
        <UIPlaybackRateButtons>
          {allowedPlaybackRates.map((allowedPlaybackRate) => {
            return (
              <UIPlaybackRateButton
                isActive={allowedPlaybackRate === playbackRate}
                key={allowedPlaybackRate}
                onClick={handleWithStopPropagation(() => {
                  onPlaybackRateChangeRequest?.(allowedPlaybackRate);
                })}
                data-tooltip={`Set playback speed to ${allowedPlaybackRate}x`}
              >
                {allowedPlaybackRate}x
              </UIPlaybackRateButton>
            );
          })}
        </UIPlaybackRateButtons>
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

const UIProgressBarProgressIndicator = styled.div<{ progress: number }>`
  height: 3px;
  ${theme.borderRadius.circle};
  background-color: ${theme.colors.actions.primary.regular()};
  position: absolute;
  width: ${(props) => props.progress * 100}%;
`;

const UIProgressTextLabel = styled.div`
  white-space: nowrap;
  ${theme.font.body12.inter.semibold.build()};
  user-select: none;
`;

const UIPlaybackRateButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UIPlaybackRateButton = styled.button<{ isActive: boolean }>`
  padding: 4px 12px;
  ${theme.font.body12.semibold.inter.build()};
  ${theme.colors.actions.tertiary.all}
  ${theme.borderRadius.item};
  ${theme.transitions.hover()}

  ${(props) => {
    if (props.isActive)
      return css`
        ${theme.colors.actions.primary.all}
      `;
  }}
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
