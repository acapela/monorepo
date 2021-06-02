import React from "react";
import styled from "styled-components";

interface Props {
  direction: "row" | "column";
  style?: React.CSSProperties;
  gap?: number;
  alignItems?: "center" | "start" | "end";
  justifyContent?: "start" | "end" | "center" | "space-between" | "space-around";
  children: React.ReactNode;
  wrap?: "nowrap" | "wrap" | "wrap-reverse" | "initial" | "inherit";
}

const alignItemsFlexbox = {
  center: "center",
  start: "flex-start",
  end: "flex-end",
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
  align-items: ${(p) => alignItemsFlexbox[p.alignItems || "start"]};
  justify-content: ${(p) => justifyContentFlexbox[p.justifyContent || "start"]};
  flex-wrap: ${(p) => p.wrap || "initial"};
`;

export const VStack = (props: Omit<Props, "direction">) => <Stack direction="column" {...props} />;

export const HStack = (props: Omit<Props, "direction">) => <Stack direction="row" {...props} />;
