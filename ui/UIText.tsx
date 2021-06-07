import styled from "styled-components";

interface Props {
  color?: string;
  weight?: "400" | "500" | "600" | "bold";
  size?: string | number;
  lineHeight?: string;
}

export const UIText = styled.p<Props>`
  margin: 0;
  padding: 0;
  color: ${(p) => p.color || "#292829"};
  font-weight: ${(p) => p.weight};
  line-height: ${(p) => p.lineHeight || "1.2em"};
  font-size: ${(p) => (typeof p.size === "string" ? p.size : `${p.size}px`)};
`;
