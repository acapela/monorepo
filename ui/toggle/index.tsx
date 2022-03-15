import React from "react";
import styled from "styled-components";

import { useId } from "@aca/shared/id";
import { theme } from "@aca/ui/theme";

/**
 * How big part of full width will toggle occupy to indicate change on long press.
 */
const STATE_CHANGE_WIDTH_INDICATION_RATIO = 0.65;

const sizes: Record<ToggleSize, Dimensions> = {
  large: {
    width: 56,
    height: 32,
    innerCircleDiameter: 26,
    horizontalOffset: 4,
  },
  small: {
    width: 38,
    height: 20,
    innerCircleDiameter: 16,
    horizontalOffset: 2,
  },
};

interface Dimensions {
  height: number;
  width: number;
  innerCircleDiameter: number;
  horizontalOffset: number;
}

type ToggleSize = "small" | "large";

interface Props {
  isSet?: boolean;
  size?: ToggleSize;
  isDisabled?: boolean;
  onChange?: (value: boolean) => void;
}

export const Toggle = ({ isSet = false, size = "small", isDisabled, onChange }: Props) => {
  const id = useId();

  function onSwitch() {
    onChange?.(!isSet);
  }

  return (
    <UIToggle dimensions={getDimensions(size)} onClick={onSwitch}>
      <input type="checkbox" checked={isSet} id={id} disabled={isDisabled} />
      <label htmlFor={id} />
    </UIToggle>
  );
};

function getDimensions(toggleSize: ToggleSize) {
  switch (toggleSize) {
    case "large":
      return sizes.large;
    case "small":
      return sizes.small;
  }
}

const disabledBg = theme.colors.action.transparent.active;

const UIToggle = styled.div<{ dimensions: Dimensions }>`
  user-select: none;

  input[type="checkbox"] {
    display: block;
    height: 0;
    width: 0;
    visibility: hidden;
  }

  label {
    display: block;
    position: relative;
    cursor: pointer;

    width: ${({ dimensions }) => dimensions.width}px;
    height: ${({ dimensions }) => dimensions.height}px;

    ${disabledBg.asBg};

    border-radius: ${({ dimensions }) => dimensions.height}px;

    transition: 0.2s;

    &:hover {
      ${disabledBg.hover.asBg};
    }
  }

  label:after {
    content: "";
    position: absolute;

    left: ${({ dimensions }) => dimensions.horizontalOffset}px;
    top: 50%;
    transform: translateY(-50%);

    width: ${(props) => props.dimensions.innerCircleDiameter}px;
    height: ${(props) => props.dimensions.innerCircleDiameter}px;

    background-color: #fff;
    border-radius: ${(props) => props.dimensions.innerCircleDiameter}px;
    transition: 0.2s;
  }

  input:checked + label {
    ${theme.colors.primary.interactive};
  }

  input:checked + label:after {
    left: calc(100% - ${({ dimensions }) => dimensions.horizontalOffset}px);
    transform: translate(-100%, -50%);
  }

  label:active:after {
    width: ${(props) => {
      const fullInnerWidth = props.dimensions.width - props.dimensions.horizontalOffset * 2;

      return fullInnerWidth * STATE_CHANGE_WIDTH_INDICATION_RATIO;
    }}px;

    transition-delay: 0.066s;
  }
`;
