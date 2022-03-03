import { throttle } from "lodash";
import { useState } from "react";
import { useIsomorphicLayoutEffect } from "react-use";
import { StylesPart, css } from "styled-components";

import { createWindowEvent } from "@aca/shared/domEvents";

export const PHONE_MAX_WIDTH = 840;
export const LARGE_DESKTOP_MIN_WIDTH = 1800;

export function phone(styles: StylesPart) {
  return css`
    @media screen and (max-width: ${PHONE_MAX_WIDTH}px) {
      ${styles}
    }
  `;
}

export function largeDesktop(styles: StylesPart) {
  return css`
    @media screen and (min-width: ${LARGE_DESKTOP_MIN_WIDTH}px) {
      ${styles}
    }
  `;
}

export function desktopOnly(styles: StylesPart) {
  return css`
    @media screen and (min-width: 461px) {
      ${styles}
    }
  `;
}

export const phoneHidden = phone(
  css`
    display: none;
  `
);

export const phoneOnly = (display: "flex" | "block") => css`
  display: none;
  ${phone(
    css`
      display: ${display};
    `
  )}
`;

function getViewportWidth() {
  return Math.min(window.outerWidth, window.innerWidth);
}

export function getIsPhone() {
  if (typeof window === "undefined") return false;

  return getViewportWidth() <= PHONE_MAX_WIDTH;
}

export function useIsPhone() {
  const [isPhone, setIsPhone] = useState(getIsPhone);

  useIsomorphicLayoutEffect(() => {
    function update() {
      const width = getViewportWidth();
      setIsPhone(width <= PHONE_MAX_WIDTH);
    }

    const throttledUpdate = throttle(update, 100);

    return createWindowEvent("resize", () => {
      throttledUpdate();
    });
  }, []);

  return isPhone;
}

export type ResponsiveValues<T> = {
  [key in keyof T]: [T[key], T[key]];
};
