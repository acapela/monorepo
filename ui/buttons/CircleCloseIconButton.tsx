import styled from "styled-components";

import { IconCross } from "~ui/icons";

import { CircleIconButton, Props as CircleIconButtonProps } from "./CircleIconButton";

export const CircleCloseIconButton = styled(function (props: Omit<CircleIconButtonProps, "icon">) {
  return <CircleIconButton size="medium" icon={<IconCross />} {...props} />;
})``;
