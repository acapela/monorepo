import { ReactNode, RefObject, useRef } from "react";
import styled from "styled-components";
import { handleWithStopPropagation } from "~shared/events";
import { createLocalStorageValue } from "~shared/localStorage";
import { BodyPortal } from "~ui/BodyPortal";
import { PopoverPlacement } from "~ui/popovers/Popover";
import { PresenceAnimator, PresenceStyles } from "~ui/PresenceAnimator";
import { startMeasuringFps, EndFpsMeasurement } from "~shared/performance";

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

const shouldUseBlurPreference = createLocalStorageValue<boolean>("use-blur-screen-cover", true);

export function ScreenCover({ children, onCloseRequest, isTransparent = true }: Props) {
  const shouldUseBlurAnimation = shouldUseBlurPreference.useValue();

  const currentFpsMeasurementRef = useRef<EndFpsMeasurement | null>(null);

  function getPresenceStyles(): PresenceStyles {
    if (isTransparent) {
      return {};
    }

    const onlyBackgroundColorAnimation: PresenceStyles = { backgroundColor: ["#432A4500", "#432A4588"] };

    if (!shouldUseBlurAnimation) {
      return onlyBackgroundColorAnimation;
    }

    return {
      ...onlyBackgroundColorAnimation,
      backdropFilter: ["blur(0px)", "blur(8px)"],
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
  /* will-change: backdrop-filter, filter, transform, background-color; */
`;
