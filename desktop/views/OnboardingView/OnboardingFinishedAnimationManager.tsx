import { memoize } from "lodash";
import React from "react";
import { createGlobalStyle, css, keyframes } from "styled-components";

import { setColorOpacity } from "@aca/shared/colors";
import { wait } from "@aca/shared/time";
import { theme } from "@aca/ui/theme";
import { readThemeValueWithProps } from "@aca/ui/theme/utils/readThemeValueWithProps";

export function OnboardingFinishedAnimationManager() {
  return <Styles />;
}

const animationDuration = 3500;

const createFadeAnimation = memoize(function createFadeAnimation(backgroundColor: string) {
  const animation = keyframes`
  0% {
    background-color: ${backgroundColor};
    opacity: 0;
    transform: scale(1.1);
    filter: blur(10px);
  }

  100% {
    background-color: ${setColorOpacity(backgroundColor, 0)};
    opacity: 1;
    transform: scale(1);
    filter: blur(0px);
  }
`;

  return animation;
});

export async function startOnboardingFinishedAnimation() {
  document.body.classList.add("animate-after-onboarding");

  await wait(animationDuration + 200);

  document.body.classList.remove("animate-after-onboarding");
}

const Styles = createGlobalStyle`
  body {
    will-change: transform, opacity;
  }

  body.animate-after-onboarding {
    ${(props) => {
      const rootBg = readThemeValueWithProps(theme.colors.layout.background.value, props);

      const animation = createFadeAnimation(rootBg);

      return css`
        animation: ${animation} ${animationDuration / 1000}s ease-out both;
      `;
    }}
    
    animation-timing-function: cubic-bezier(.37,.96,.5,1);
  }
`;
