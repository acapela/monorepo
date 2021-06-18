import { ReactNode, RefObject, useRef } from "react";
import styled from "styled-components";
import { handleWithStopPropagation } from "~shared/events";
import { createLocalStorageValue } from "~shared/localStorage";
import { BodyPortal } from "~ui/BodyPortal";
import { PopoverPlacement } from "~ui/popovers/Popover";
import { PresenceAnimator, PresenceStyles } from "~ui/PresenceAnimator";
import { startMeasuringFps } from "~shared/performance";

export interface ModalAnchor {
  ref: RefObject<HTMLElement>;
  placement?: PopoverPlacement;
}
interface Props {
  children: ReactNode;
  onCloseRequest?: () => void;
  isTransparent?: boolean;
}

const BLUR_ANIMATION_FPS_TO_ENABLE_BLUR_THRESHOLD = 25;

const shouldUseBlurPreference = createLocalStorageValue<boolean>("use-blur-screen-cover", true);

export function ScreenCover({ children, onCloseRequest, isTransparent = true }: Props) {
  const shouldUseBlurAnimation = shouldUseBlurPreference.useValue();

  const currentFpsMeasurementRef = useRef<(() => number) | null>(null);

  function getPresenceStyles(): PresenceStyles {
    if (isTransparent) {
      return {};
    }

    const onlyBackgroundColorAnimation: PresenceStyles = { backgroundColor: ["#432A4500", "#432A4588"] };

    // We did not complete measuring yet. Assume machine is slow.
    if (!shouldUseBlurAnimation) {
      return onlyBackgroundColorAnimation;
    }

    return {
      backgroundColor: ["#432A4500", "#432A4588"],
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
