import { ReactNode } from "react";
import styled from "styled-components";
import { borderRadius, fontSize } from "~ui/baseStyles";
import { PRIMARY_COLOR } from "~ui/colors";
import { NamedSize, getNamedSizeSquareStyles } from "~ui/namedSize";
import { getTextColorForBackgroundColor } from "~ui/transitions";

interface Props {
  className?: string;
  label: ReactNode;
  size?: NamedSize;
}

export const CircleLabel = styled(function CircleLabel({ className, label, size = "small" }: Props) {
  return (
    <UIHolder className={className} size={size}>
      {label}
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{ size: NamedSize }>`
  ${(props) => getNamedSizeSquareStyles(props.size)};
  background-color: ${PRIMARY_COLOR};
  ${borderRadius.circle};
  color: ${getTextColorForBackgroundColor(PRIMARY_COLOR)};

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: ${fontSize.label};
`;
