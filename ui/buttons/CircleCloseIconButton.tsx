import styled from "styled-components";
import { IconCross } from "~ui/icons";
import { Props as CircleIconButtonProps, CircleIconButton } from "./CircleIconButton";

export const CircleCloseIconButton = styled(function (props: Omit<CircleIconButtonProps, "icon">) {
  return <CircleIconButton size="medium" icon={<IconCross />} {...props} />;
})``;
