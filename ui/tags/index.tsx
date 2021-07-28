import styled from "styled-components";
import { PRIMARY_PINK_3 } from "../theme/colors/base";
import { ReactNode } from "react";
import { setColorOpacity } from "~shared/colors";
import { borderRadius } from "~ui/baseStyles";

interface TagProps {
  color: string;
  children: ReactNode;
  tooltipLabel?: string;
}

const Tag = ({ color, children, tooltipLabel }: TagProps) => {
  return (
    <UITag data-tooltip={tooltipLabel} color={color}>
      {children}
    </UITag>
  );
};

const UITag = styled.button<{ color: string }>`
  padding: 4px 8px;

  font-size: 0.75rem;

  color: ${(props) => props.color};
  background-color: ${(props) => setColorOpacity(props.color, 0.1)};
  ${borderRadius.tag};
`;

export const PrivateTag = ({ tooltipLabel }: Pick<TagProps, "tooltipLabel">) => (
  <Tag tooltipLabel={tooltipLabel} color={PRIMARY_PINK_3}>
    Private
  </Tag>
);
