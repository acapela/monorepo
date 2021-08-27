import React, { ChangeEvent } from "react";
import styled from "styled-components";

import { useId } from "~shared/id";
import { getColorHoverVariant } from "~ui/transitions";

import { BACKGROUND_ACCENT, BUTTON_BACKGROUND_COLOR, WHITE } from "../theme/colors/base";

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
  onSet?: () => void;
  onUnset?: () => void;
}

export const Toggle = ({ isSet, size = "large", isDisabled, onSet, onUnset }: Props) => {
  const id = useId();
  function onSwitch(e: ChangeEvent<HTMLInputElement>) {
    e.stopPropagation();

    if (e.target.checked) {
      onSet?.();
    } else {
      onUnset?.();
    }
  }

  return (
    <UIToggle dimensions={getDimensions(size)}>
      <input type="checkbox" checked={isSet} id={id} onChange={onSwitch} disabled={isDisabled} />
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

    background: ${BACKGROUND_ACCENT};

    border-radius: ${({ dimensions }) => dimensions.height}px;

    transition: 0.2s;

    &:hover {
      background: ${getColorHoverVariant(BACKGROUND_ACCENT)};
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

    background: ${WHITE};
    border-radius: ${(props) => props.dimensions.innerCircleDiameter}px;
    transition: 0.2s;
  }

  input:checked + label {
    background: ${BUTTON_BACKGROUND_COLOR};

    &:hover {
      background: ${getColorHoverVariant(BUTTON_BACKGROUND_COLOR)};
    }
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
