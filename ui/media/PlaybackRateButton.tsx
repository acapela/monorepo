import styled from "styled-components";
import { getNextItemInArray } from "~shared/array";
import { handleWithStopPropagation } from "~shared/events";
import { theme } from "~ui/theme";

interface Props {
  playbackRate?: number;
  onPlaybackRateChangeRequest?: (playbackRate: number) => void;
  allowedPlaybackRates: number[];
}

export function PlaybackRateButton({ playbackRate = 1, onPlaybackRateChangeRequest, allowedPlaybackRates }: Props) {
  return (
    <UIPlaybackRateButton
      onClick={handleWithStopPropagation(() => {
        const nextRate = getNextItemInArray(allowedPlaybackRates, playbackRate);
        onPlaybackRateChangeRequest?.(nextRate);
      })}
      data-tooltip={`Change playback speed`}
    >
      {playbackRate}x
    </UIPlaybackRateButton>
  );
}

const UIPlaybackRateButton = styled.button`
  padding: 4px 12px;
  ${theme.font.body12.medium.inter.build()};
  ${theme.colors.actions.tertiary.all}
  ${theme.borderRadius.item};
  ${theme.transitions.hover()}
  /* We don't want width of this button to flicker when changing between "1x" or "1.5x" (<- they have different width) */
  min-width: 7ch;
  user-select: none;
  text-align: center;
  cursor: pointer;
`;
