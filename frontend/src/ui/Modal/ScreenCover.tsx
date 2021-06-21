import { ReactNode, RefObject, useRef } from "react";
import styled from "styled-components";
import { handleWithStopPropagation } from "~shared/events";
import { createLocalStorageValueManager } from "~shared/localStorage";
import { BodyPortal } from "~ui/BodyPortal";
import { PopoverPlacement } from "~ui/popovers/Popover";
import { PresenceAnimator, PresenceStyles } from "~ui/PresenceAnimator";
import { startMeasuringFps, EndFpsMeasurement } from "~shared/performance";
import { setColorOpacity } from "~shared/colors";
import { MODAL_BACKGROUND_COLOR } from "~ui/colors";

export interface ModalAnchor {
  ref: RefObject<HTMLElement>;
  placement?: PopoverPlacement;
}
interface Props {
  children: ReactNode;
  onCloseRequest?: () => void;
  isTransparent?: boolean;
}

/**
 * Blur animation is pretty heavy and might be laggy on slower machines.
 *
 * We'll measure FPS during the animation and if it's too low, we'll disable it and remember this setting in localStorage.
 */
const BLUR_ANIMATION_FPS_TO_ENABLE_BLUR_THRESHOLD = 25;

const BACKGROUND_BLUR_SIZE_PX = 8;

const shouldUseBlurPreference = createLocalStorageValueManager<boolean>("use-blur-screen-cover", true);

export function ScreenCover({ children, onCloseRequest, isTransparent = true }: Props) {
  const shouldUseBlurAnimation = shouldUseBlurPreference.useValue();

  const currentFpsMeasurementRef = useRef<EndFpsMeasurement | null>(null);

  function getPresenceStyles(): PresenceStyles {
    if (isTransparent) {
      return {};
    }

    const onlyBackgroundColorAnimation: PresenceStyles = {
      backgroundColor: [setColorOpacity(MODAL_BACKGROUND_COLOR, 0), setColorOpacity(MODAL_BACKGROUND_COLOR, 0.7)],
    };

    if (!shouldUseBlurAnimation) {
      return onlyBackgroundColorAnimation;
    }

    return {
      ...onlyBackgroundColorAnimation,
      backdropFilter: ["blur(0px)", `blur(${BACKGROUND_BLUR_SIZE_PX}px)`],
    };
  }

  function handleStartMeasuringAnimation() {
    currentFpsMeasurementRef.current = startMeasuringFps();
  }

  function handleAnimationEnd() {
    if (!currentFpsMeasurementRef.current) return;

    const fpsDuringTransition = currentFpsMeasurementRef.current();

    if (fpsDuringTransition < BLUR_ANIMATION_FPS_TO_ENABLE_BLUR_THRESHOLD) {
      // If animation was laggy, never again animate with blur.
      shouldUseBlurPreference.set(false);
    }
  }

  return (
    <BodyPortal>
      <UIBodyCover
        presenceStyles={getPresenceStyles()}
        onClick={handleWithStopPropagation(onCloseRequest)}
        enableBlur={isTransparent}
        onAnimationStart={handleStartMeasuringAnimation}
        onAnimationComplete={handleAnimationEnd}
      >
        {children}
      </UIBodyCover>
    </BodyPortal>
  );
}

const UIBodyCover = styled(PresenceAnimator)<{ enableBlur: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: backdrop-filter, filter, transform, background-color;
`;
