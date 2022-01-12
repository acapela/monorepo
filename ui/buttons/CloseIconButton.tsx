import styled from "styled-components";

import { IconCross } from "@aca/ui/icons";

import { IconButtonProps as CircleIconButtonProps, IconButton } from "./IconButton";

export const CloseIconButton = styled(function (props: Omit<CircleIconButtonProps, "icon">) {
  return <IconButton icon={<IconCross />} {...props} />;
})``;
