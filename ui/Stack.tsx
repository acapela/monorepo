import React from "react";
import styled, { css } from "styled-components";

interface Props {
  direction: "row" | "column";
  style?: React.CSSProperties;
  gap?: number;
  alignItems?: "center" | "start" | "end" | "stretch";
  justifyContent?: "start" | "end" | "center" | "space-between" | "space-around";
  children: React.ReactNode;
  wrap?: "nowrap" | "wrap" | "wrap-reverse" | "initial" | "inherit";
  fullWidth?: boolean;
  className?: string;
}

const alignItemsFlexbox = {
  center: "center",
  start: "flex-start",
  end: "flex-end",
  stretch: "stretch",
};

const justifyContentFlexbox = {
  center: "center",
  start: "flex-start",
  end: "flex-end",
  "space-between": "space-between",
  "space-around": "space-around",
};

const Stack = styled.div<Props>`
  display: flex;
  flex-direction: ${(p) => p.direction};
  gap: ${(p) => p.gap || 0}px;
  align-items: ${(p) => alignItemsFlexbox[p.alignItems || "stretch"]};
  justify-content: ${(p) => justifyContentFlexbox[p.justifyContent || "start"]};
  flex-wrap: ${(p) => p.wrap || "initial"};
  ${(p) =>
    p.fullWidth &&
    css<{}>`
      width: 100%;
    `}
`;

export const VStack = (props: Omit<Props, "direction">) => <Stack direction="column" {...props} />;

export const HStack = (props: Omit<Props, "direction">) => <Stack direction="row" {...props} />;
