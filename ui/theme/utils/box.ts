import { StylesPart, css } from "styled-components";

import { ThemeTarget, createThemeTarget } from "./themeTarget";

type BoxVariants = {
  radius: Box;
  vertical: Box;
  square: Box;
  padding: Box;
  size: Box;
};

export type Box = ThemeTarget<BoxVariants>;

interface BoxInput {
  x?: number;
  y?: number;
  height?: number;
  width?: number;
  radius?: number;
  gap?: number;
}

type BoxFlag = "radius" | "vertical" | "square" | "padding" | "size";

export function box(input: BoxInput, flags: BoxFlag[] = []): Box {
  const { x = 0, y = 0, height, width, radius = 0, gap = 0 } = input;

  function addFlag(flag: BoxFlag) {
    return box(input, [...flags, flag]);
  }

  function hasFlag(flag: BoxFlag) {
    return flags.includes(flag);
  }

  const self: Box = createThemeTarget<BoxVariants>(
    () => {
      function layout() {
        const parts: StylesPart[] = [];

        if (height && hasFlag("size")) {
          parts.push(
            css`
              height: ${height}px;
              min-height: ${height}px;
            `
          );

          if (hasFlag("square")) {
            parts.push(
              css`
                width: ${width ?? height}px;
                min-width: ${width ?? height}px;
                justify-content: center;
              `
            );
          }
        }

        if (!hasFlag("square") && hasFlag("padding")) {
          parts.push(
            css`
              padding: ${y}px ${x}px;
            `
          );
        }

        if (radius && hasFlag("radius")) {
          parts.push(
            css`
              border-radius: ${radius}px;
            `
          );
        }

        if (hasFlag("vertical")) {
          parts.push(
            css`
              flex-direction: column;
            `
          );
        }

        if (gap) {
          parts.push(
            css`
              gap: ${gap}px;
            `
          );
        }

        return parts;
      }

      return css`
        display: flex;
        align-items: center;

        ${layout()}
      `;
    },
    {
      get radius() {
        return addFlag("radius");
      },
      get vertical() {
        return addFlag("vertical");
      },
      get square() {
        return addFlag("square");
      },
      get padding() {
        return addFlag("padding");
      },
      get size() {
        return addFlag("size");
      },
    }
  );

  return self;
}
